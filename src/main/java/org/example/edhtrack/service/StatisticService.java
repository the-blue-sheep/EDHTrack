package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class StatisticService {
    private final GameParticipantRepository gameParticipantRepository;

    public StatisticService(GameParticipantRepository gameParticipantRepository) {
        this.gameParticipantRepository = gameParticipantRepository;
    }

    public WinrateByPlayerDTO getWinRateByPlayer(Player player) {
        List<GameParticipant> participants = gameParticipantRepository.findByPlayer(player);
        int gamesIn = participants.size();

        int gamesWon = Utils.countWins(participants);

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new WinrateByPlayerDTO(player, gamesIn, gamesWon, winRate);
    }

    public CommanderWinRateDTO getWinRateByCommander(String commanderName) {
        List<GameParticipant> participants = gameParticipantRepository.findAll();
        int gamesIn = participants.size();

        int gamesWon = (int) participants.stream()
                .filter(GameParticipant::isWinner)
                .filter(p -> p.getDeck().getCommanders().stream()
                        .anyMatch(c -> c.getName().equalsIgnoreCase(commanderName)))
                .count();

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new CommanderWinRateDTO(commanderName, gamesIn, gamesWon, winRate);
    }

    public ColorStatDTO getWinrateByColor(String colors) {
        List<GameParticipant> participants = gameParticipantRepository.findByDeck_ColorsContaining(colors);
        int gamesIn = participants.size();

        int gamesWon = Utils.countWins(participants);

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new ColorStatDTO(colors, gamesIn, gamesWon, winRate);
    }

    public WinrateAgainstAnotherPlayer getWinRateAgainstOtherPlayer(Player player1, Player player2) {
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
        return new WinrateAgainstAnotherPlayer(player1, player2, winRate);
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
                    if (hideRetiredDecks && p.getDeck() != null && p.getDeck().isRetired()) {
                        return false;
                    }
                    return true;
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
}
