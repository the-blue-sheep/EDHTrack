package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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

    public CommanderWinRateDTO getWinRateByCommander(Deck deck) {
        List<GameParticipant> participants = gameParticipantRepository.findByDeck(deck);
        int gamesIn = participants.size();

        int gamesWon = Utils.countCommanderWins(participants, deck.getCommander());

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;
        return new CommanderWinRateDTO(deck.getCommander(), gamesIn, gamesWon, winRate);
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
                .map(p -> p.getGame().getWinner() != null && p.getGame().getWinner().equals(player))
                .toList();

        List<Integer> streaks = new ArrayList<>();
        boolean current = results.get(0);
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
        List<GameParticipant> participants = gameParticipantRepository.findByDeck_CommanderContaining(commanderName);
        int gamesIn = participants.size();
        int totalGames = Math.toIntExact(participants.stream()
                .map(GameParticipant::getGame)
                .distinct()
                .count());
        int totalPlayers = Math.toIntExact(participants.stream()
                .filter(p -> p.getGame().getWinner() != null &&
                        p.getGame().getWinner().equals(p.getPlayer()))
                .map(GameParticipant::getGame)
                .distinct()
                .count());

        int gamesWon = Utils.countWins(participants);

        double winRate = gamesIn == 0 ? 0 : (double) gamesWon / gamesIn;

        return new CommanderStatDTO(commanderName, totalGames,totalPlayers,gamesWon, winRate);
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
                    .collect(Collectors.groupingBy(p -> p.getDeck().getCommander()));

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
                            .filter(p -> p.getGame().getWinner() != null &&
                                    p.getGame().getWinner().equals(p.getPlayer()))
                            .count();
                    double winRate = totalGames == 0 ? 0 : (double) wins / totalGames;

                    return new LeaderboardEntryDTO(key, totalGames, wins, winRate);
                })
                .filter(dto -> dto.totalGames() >= minGames)
                .sorted(Comparator.comparingDouble(LeaderboardEntryDTO::winRate).reversed())
                .toList();

    }
}
