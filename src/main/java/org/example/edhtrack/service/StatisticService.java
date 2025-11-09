package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.DeckRepository;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.example.edhtrack.repository.GameRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class StatisticService {
    private final DeckRepository deckRepository;
    private final PlayerRepository playerRepository;
    private final GameRepository gameRepository;
    private final GameParticipantRepository gameParticipantRepository;

    public StatisticService(DeckRepository deckRepository, PlayerRepository playerRepository, GameRepository gameRepository, GameParticipantRepository gameParticipantRepository) {
        this.deckRepository = deckRepository;
        this.playerRepository = playerRepository;
        this.gameRepository = gameRepository;
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
        List<GameParticipant> participants = gameParticipantRepository.findByDeckId(deck);
        int gamesIn = participants.size();

        int gamesWon = Utils.countWins(participants);

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
        List<GameParticipant> participants = List.of();
        for (GameParticipant p1 : participants1) {
            for (GameParticipant p2 : participants2) {
                if (p1.getId() == p2.getId()) {
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

}
