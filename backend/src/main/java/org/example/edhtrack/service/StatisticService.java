package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.*;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.*;
import org.example.edhtrack.repository.DeckRepository;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class StatisticService {
    private final GameParticipantRepository gameParticipantRepository;
    private final DeckRepository deckRepository;
    private final PlayerRepository playerRepository;

    public StatisticService(
            GameParticipantRepository gameParticipantRepository,
            DeckRepository deckRepository,
            PlayerRepository playerRepository
    ) {
        this.gameParticipantRepository = gameParticipantRepository;
        this.deckRepository = deckRepository;
        this.playerRepository = playerRepository;
    }

    public WinrateByPlayerDTO getWinRateByPlayer(Player player) {
        List<GameParticipant> participants = gameParticipantRepository.findByPlayer(player);
        int gamesIn = participants.size();

        int gamesWon = Utils.countWins(participants);

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new WinrateByPlayerDTO(player.getId(), player.getName(), gamesIn, gamesWon, winRate);
    }

    public CommanderWinRateDTO getWinRateByCommander(String commanderName, int minGames) {

        List<GameParticipant> participants =
                gameParticipantRepository.findAll().stream()
                        .filter(gp ->
                                gp.getDeck().getCommanders().stream()
                                        .anyMatch(c ->
                                                c.getName().equalsIgnoreCase(commanderName)
                                        )
                        )
                        .toList();

        int totalGames = participants.size();

        if (totalGames < minGames) {
            return new CommanderWinRateDTO(
                    commanderName,
                    totalGames,
                    0,
                    0.0
            );
        }

        int wins = (int) participants.stream()
                .filter(GameParticipant::isWinner)
                .count();

        double winRate = (double) wins / totalGames;

        return new CommanderWinRateDTO(
                commanderName,
                totalGames,
                wins,
                winRate
        );
    }


    public ColorStatDTO getWinrateByColor(String colors) {
        List<GameParticipant> participants = gameParticipantRepository.findByDeck_ColorsContaining(colors);
        int gamesIn = participants.size();

        int gamesWon = Utils.countWins(participants);

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new ColorStatDTO(colors, gamesIn, gamesWon, winRate);
    }

    public PlayerVsPlayerDTO getPlayerVsPlayerStats(Player player1, Player player2, String tableSizes) {
        List<Integer> sizes = Arrays.stream(tableSizes.split(","))
                .map(Integer::parseInt)
                .toList();

        List<GameParticipant> allP1 = gameParticipantRepository.findByPlayer(player1);
        List<GameParticipant> allP2 = gameParticipantRepository.findByPlayer(player2);

        int totalGamesP1 = allP1.size();
        int totalGamesP2 = allP2.size();

        int totalWinsP1 = (int) allP1.stream().filter(GameParticipant::isWinner).count();
        int totalWinsP2 = (int) allP2.stream().filter(GameParticipant::isWinner).count();

        double winRateP1Overall = totalGamesP1 == 0 ? 0 : (double) totalWinsP1 / totalGamesP1;
        double winRateP2Overall = totalGamesP2 == 0 ? 0 : (double) totalWinsP2 / totalGamesP2;

        List<Game> gamesTogetherList = allP1.stream()
                .map(GameParticipant::getGame)
                .filter(game -> allP2.stream().anyMatch(p2 -> p2.getGame().equals(game)))
                .filter(game -> sizes.isEmpty()
                        || sizes.contains(game.getPlayers().size()))
                .distinct()
                .toList();
        int gamesTogetherCount = gamesTogetherList.size();

        int player1WinsH2H = 0;
        int player2WinsH2H = 0;

        for (Game g : gamesTogetherList) {
            List<GameParticipant> participants = g.getPlayers();
            boolean p1Won = participants.stream()
                    .anyMatch(p -> p.getPlayer().equals(player1) && p.isWinner());
            boolean p2Won = participants.stream()
                    .anyMatch(p -> p.getPlayer().equals(player2) && p.isWinner());

            if (p1Won) player1WinsH2H++;
            if (p2Won) player2WinsH2H++;
        }


        double winRateP1WithP2 = gamesTogetherCount == 0 ? 0 : (double) player1WinsH2H / gamesTogetherCount;
        double winRateP2WithP1 = gamesTogetherCount == 0 ? 0 : (double) player2WinsH2H / gamesTogetherCount;

        double deltaP1 = winRateP1WithP2 - winRateP1Overall;
        double deltaP2 = winRateP2WithP1 - winRateP2Overall;

        return new PlayerVsPlayerDTO(
                player1.getId(),
                player1.getName(),
                player2.getId(),
                player2.getName(),
                totalGamesP1,
                totalGamesP2,
                gamesTogetherCount,
                player1WinsH2H,
                player2WinsH2H,
                winRateP1Overall,
                winRateP2Overall,
                winRateP1WithP2,
                winRateP2WithP1,
                deltaP1,
                deltaP2
        );
    }

    public StreakDTO getStreaksByPlayer(Player player){
        List<GameParticipant> participants = gameParticipantRepository.findByPlayer(player);
        List<Boolean> results = participants.stream()
                .map(GameParticipant::isWinner)
                .toList();

        List<Integer> streaks = new ArrayList<>();
        boolean current = results.getFirst();
        int count = 1;

        for (int i = 1; i < results.size(); i++) {
            if (results.get(i) == current) {
                count++;
            } else {
                streaks.add(current ? count : -count);
                current = results.get(i);
                count = 1;
            }
        }
        streaks.add(current ? count : -count);

        return new StreakDTO(player.getName(), streaks);
    }

    public CommanderStatDTO getCommanderStatsForAll(String commanderName) {
        List<GameParticipant> participants = gameParticipantRepository
                .findByDeck_Commanders_NameIgnoreCase(commanderName);

        int totalGames = (int) participants.stream()
                .map(gp -> gp.getGame().getId())
                .distinct()
                .count();

        int totalPlayers = (int) participants.stream()
                .map(GameParticipant::getPlayer)
                .distinct()
                .count();

        int totalWins = (int) participants.stream()
                .filter(GameParticipant::isWinner)
                .count();

        double winRate = totalGames == 0 ? 0 : (double) totalWins / totalGames;

        return new CommanderStatDTO(commanderName, totalGames, totalPlayers, totalWins, winRate);
    }


    public List<LeaderboardEntryDTO> getLeaderboard(
            Utils.DeterminedType type,
            int minGames,
            boolean hideRetiredPlayers,
            boolean hideRetiredDecks,
            String tableSizes
    ) {

        List<Integer> sizes = Arrays.stream(tableSizes.split(","))
                .map(Integer::parseInt)
                .toList();

        if (sizes.isEmpty()) {
            return List.of();
        }

        List<GameParticipant> participants = gameParticipantRepository.findAll();

        participants = participants.stream()
                .filter(p -> sizes.contains(p.getGame().getPlayers().size()))
                .filter(p -> {
                    if (hideRetiredPlayers && p.getPlayer().isRetired()) {
                        return false;
                    }
                    return !hideRetiredDecks || p.getDeck() == null || !p.getDeck().isRetired();
                })
                .toList();

        participants = participants.stream()
                .filter(p -> {
                    if (hideRetiredPlayers && p.getPlayer().isRetired()) {
                        return false;
                    }
                    return !hideRetiredDecks || p.getDeck() == null || !p.getDeck().isRetired();
                })
                .toList();

        Map<String, List<GameParticipant>> grouped;
        switch (type) {
            case PLAYER -> grouped = participants.stream()
                    .collect(Collectors.groupingBy(p -> p.getPlayer().getName()));

            case COMMANDER -> grouped = participants.stream()
                    .flatMap(p -> p.getDeck().getCommanders().stream()
                            .map(c -> new AbstractMap.SimpleEntry<>(c.getName(), p)))
                    .collect(Collectors.groupingBy(Map.Entry::getKey,
                            Collectors.mapping(Map.Entry::getValue, Collectors.toList())));

            case COLOR -> grouped = participants.stream()
                    .collect(Collectors.groupingBy(p -> p.getDeck().getColors()));

            default -> throw new IllegalArgumentException("Unsupported leaderboard type: " + type);
        }


        return grouped.entrySet().stream()
                .map(entry -> {
                    String key = entry.getKey();
                    List<GameParticipant> games = entry.getValue();

                    int totalGames = games.size();
                    int wins = (int) games.stream()
                            .filter(GameParticipant::isWinner)
                            .count();
                    double winRate = totalGames == 0 ? 0 : (double) wins / totalGames;

                    return new LeaderboardEntryDTO(key, totalGames, wins, winRate);
                })
                .filter(dto -> dto.totalGames() >= minGames)
                .sorted(Comparator.comparingDouble(LeaderboardEntryDTO::winRate).reversed())
                .toList();

    }

    public List<CommanderWinRateDTO> getWinRatesForAllCommanders(int minGames) {

        return deckRepository.findAll().stream()
                .flatMap(deck -> deck.getCommanders().stream())
                .map(Commander::getName)
                .distinct()
                .map(name -> getWinRateByCommander(name, minGames))
                .filter(dto -> dto.totalGames() >= minGames)
                .sorted(Comparator.comparing(CommanderWinRateDTO::winRate).reversed())
                .toList();
    }


    public List<PlayerGamesCountDTO> getPlayerGamesCount(boolean hideRetired) {
        return playerRepository.findAll()
                .stream()
                .filter(p -> !hideRetired || !p.isRetired())
                .map(player -> {
                    int games = gameParticipantRepository.countByPlayer(player);
                    return new PlayerGamesCountDTO(
                            player.getId(),
                            player.getName(),
                            player.isRetired(),
                            games
                    );
                })
                .sorted(Comparator.comparing(PlayerGamesCountDTO::totalGames).reversed())
                .toList();
    }

    public PlayerDetailDTO getPlayerDetail(Player player) {
        List<GameParticipant> parts = gameParticipantRepository.findByPlayer(player);

        int totalGames = parts.size();
        int wins = Utils.countWins(parts);
        double winRate = totalGames == 0 ? 0 : (double) wins / totalGames;

        return new PlayerDetailDTO(
                player.getId(),
                player.getName(),
                player.isRetired(),
                totalGames,
                wins,
                winRate
        );
    }

    public List<DeckStatDTO> getTopPlayedDecks(Player player, int minGames, int limit) {
        return getDeckStatsForPlayer(player).stream()
                .filter(dto -> dto.totalGames() >= minGames)
                .sorted(Comparator.comparing(DeckStatDTO::totalGames).reversed())
                .limit(limit)
                .toList();
    }

    public List<DeckStatDTO> getTopSuccessfulDecks(Player player, int minGames, int limit) {
        return getDeckStatsForPlayer(player).stream()
                .filter(dto -> dto.totalGames() >= minGames)
                .sorted(Comparator.comparing(DeckStatDTO::winRate).reversed())
                .limit(limit)
                .toList();
    }

    public List<DeckStatDTO> getDeckStatsForPlayer(Player player) {
        Map<Deck, List<GameParticipant>> byDeck =
                gameParticipantRepository.findByPlayer(player)
                        .stream()
                        .collect(Collectors.groupingBy(GameParticipant::getDeck));

        return byDeck.entrySet().stream()
                .map(entry -> {
                    Deck deck = entry.getKey();
                    List<GameParticipant> games = entry.getValue();

                    int totalGames = games.size();
                    int wins = Utils.countWins(games);
                    double winRate = totalGames == 0 ? 0 : (double) wins / totalGames;
                    boolean isRetired = entry.getKey().isRetired();

                    return new DeckStatDTO(
                            deck.getDeckId(),
                            deck.getDeckName(),
                            totalGames,
                            wins,
                            winRate,
                            isRetired
                    );
                })
                .toList();
    }

    public TableSizeWinrateResponseDTO getTableSizeWinRateByPlayer(Player player) {

        List<GameParticipant> participants =
                gameParticipantRepository.findByPlayer(player);

        Map<Integer, List<GameParticipant>> byTableSize =
                participants.stream()
                        .collect(Collectors.groupingBy(
                                gp -> gp.getGame().getPlayers().size()
                        ));

        List<TableSizeWinrateDTO> stats =
                byTableSize.entrySet().stream()
                        .sorted(Map.Entry.comparingByKey())
                        .map(entry -> {
                            int tableSize = entry.getKey();
                            List<GameParticipant> games = entry.getValue();

                            int totalGames = games.size();
                            long wins = games.stream()
                                    .filter(GameParticipant::isWinner)
                                    .count();

                            double winRate = totalGames == 0
                                    ? 0.0
                                    : (double) wins / totalGames;

                            return new TableSizeWinrateDTO(
                                    tableSize,
                                    totalGames,
                                    (int) wins,
                                    winRate
                            );
                        })
                        .toList();

        return new TableSizeWinrateResponseDTO(
                player.getId(),
                player.getName(),
                stats
        );
    }

    public WinrateOverTimeDTO getWinrateOverTime(
            Player player,
            Deck deck,
            int stepSize
    ) {
        if (stepSize <= 0) {
            stepSize = 1;
        }

        List<GameParticipant> participants =
                new ArrayList<>(gameParticipantRepository.findByPlayerAndDeck(player, deck));

        participants.sort(Comparator.comparing(gp -> gp.getGame().getId()));

        List<WinratePointDTO> points = new ArrayList<>();

        int totalGames = 0;
        int totalWins = 0;

        for (int i = 0; i < participants.size(); i++) {
            GameParticipant gp = participants.get(i);
            totalGames++;

            if (gp.isWinner()) {
                totalWins++;
            }

            boolean isStepBoundary = totalGames % stepSize == 0;
            boolean isLastGame = i == participants.size() - 1;

            if (isStepBoundary || isLastGame) {
                double winrate = totalGames == 0
                        ? 0.0
                        : (double) totalWins / totalGames;

                points.add(new WinratePointDTO(
                        totalGames,
                        totalWins,
                        winrate
                ));
            }
        }

        return new WinrateOverTimeDTO(
                player.getId(),
                deck.getDeckId(),
                stepSize,
                points
        );
    }

}
