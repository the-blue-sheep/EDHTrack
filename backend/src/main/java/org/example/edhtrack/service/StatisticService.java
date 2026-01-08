package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.*;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Commander;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
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

    public StatisticService(GameParticipantRepository gameParticipantRepository, DeckRepository deckRepository, PlayerRepository playerRepository) {
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

    public CommanderWinRateDTO getWinRateByCommander(String commanderName) {

        List<GameParticipant> participants =
                gameParticipantRepository.findAll().stream()
                        .filter(gp ->
                                gp.getDeck().getCommanders().stream()
                                        .anyMatch(c -> c.getName().equalsIgnoreCase(commanderName))
                        )
                        .toList();

        int totalGames = participants.size();
        int wins = (int) participants.stream()
                .filter(GameParticipant::isWinner)
                .count();

        double winRate = totalGames == 0
                ? 0.0
                : (double) wins / totalGames;

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

    public PlayerVsPlayerDTO getWinRateAgainstOtherPlayer(Player player1, Player player2) {
        List<GameParticipant> participants1 = gameParticipantRepository.findByPlayer(player1);
        List<GameParticipant> participants2 =  gameParticipantRepository.findByPlayer(player2);
        List<GameParticipant> participants = new ArrayList<>();
        for (GameParticipant p1 : participants1) {
            for (GameParticipant p2 : participants2) {
                if (p1.getGame().equals(p2.getGame())) {
                    participants.add(p1);
                }
            }
        }

        int gamesIn = participants.size();
        int gamesWon = Utils.countWins(participants);

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new PlayerVsPlayerDTO(
                player1.getId(),
                player1.getName(),
                player2.getId(),
                player2.getName(),
                winRate
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
            boolean hideRetiredDecks
    ) {

        List<GameParticipant> participants = gameParticipantRepository.findAll();

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

    public List<CommanderWinRateDTO> getWinRatesForAllCommanders() {

        return deckRepository.findAll().stream()
                .flatMap(deck -> deck.getCommanders().stream())
                .map(Commander::getName)
                .distinct()
                .map(this::getWinRateByCommander)
                .filter(dto -> dto.totalGames() > 0)
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

    public List<DeckStatDTO> getTopPlayedDecks(Player player, int limit) {
        return getDeckStatsForPlayer(player).stream()
                .sorted(Comparator.comparing(DeckStatDTO::totalGames).reversed())
                .limit(limit)
                .toList();
    }

    public List<DeckStatDTO> getTopSuccessfulDecks(Player player, int limit) {
        return getDeckStatsForPlayer(player).stream()
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

}
