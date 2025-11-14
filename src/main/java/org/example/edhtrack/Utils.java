package org.example.edhtrack;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;

import java.util.*;
import java.util.stream.Collectors;

public final class Utils {
    public static int countWins(List<GameParticipant> participants) {
        if (participants == null) return 0;
        return (int) participants.stream()
                .filter(p -> p.getGame().getWinner() != null &&
                        p.getGame().getWinner().equals(p.getPlayer()))
                .count();
    }

    public static Map<String, Integer> countWins(List<GameParticipant> participants, DeterminedType type) {
        if (participants == null) return Collections.emptyMap();

        Map<String, List<GameParticipant>> grouped = switch (type) {
            case PLAYER -> participants.stream()
                    .collect(Collectors.groupingBy(p -> p.getPlayer().getName()));
            case COMMANDER -> participants.stream()
                    .collect(Collectors.groupingBy(p -> p.getDeck().getCommander()));
            case COLOR -> participants.stream()
                    .collect(Collectors.groupingBy(p -> p.getDeck().getColors()));
        };

        return grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            String key = entry.getKey();
                            List<GameParticipant> groupParticipants = entry.getValue();

                            // distinct games for this group
                            List<Game> games = groupParticipants.stream()
                                    .map(GameParticipant::getGame)
                                    .filter(Objects::nonNull)
                                    .distinct()
                                    .toList();

                            // count games where the winner's deck matches the group key
                            int wins = 0;
                            for (Game game : games) {
                                Player winner = game.getWinner();
                                if (winner == null) continue;

                                // find the GameParticipant in this game for the winner
                                GameParticipant winnerParticipant = game.getPlayers().stream()
                                        .filter(gp -> gp.getPlayer() != null && gp.getPlayer().equals(winner))
                                        .findFirst()
                                        .orElse(null);

                                if (winnerParticipant == null) continue;

                                String winnerGroupKey;
                                switch (type) {
                                    case PLAYER -> winnerGroupKey = winner.getName();
                                    case COMMANDER -> winnerGroupKey = Optional.ofNullable(winnerParticipant.getDeck())
                                            .map(Deck::getCommander).orElse(null);
                                    case COLOR -> winnerGroupKey = Optional.ofNullable(winnerParticipant.getDeck())
                                            .map(Deck::getColors).orElse(null);
                                    default -> winnerGroupKey = null;
                                }

                                if (winnerGroupKey != null && winnerGroupKey.equalsIgnoreCase(key)) {
                                    wins++;
                                }
                            }
                            return wins;
                        }
                ));
    }

    public static int countCommanderWins(List<GameParticipant> participants, String commanderName) {
        if (participants == null || participants.isEmpty() || commanderName == null) return 0;

        String search = commanderName.trim().toLowerCase();

        // 1) Sammle distinct Games aus den übergebenen Teilnehmern
        List<Game> distinctGames = participants.stream()
                .map(GameParticipant::getGame)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        int wins = 0;

        for (Game game : distinctGames) {
            Player winner = game.getWinner();
            if (winner == null) continue; // Unentschieden / kein Gewinner -> überspringen

            // 2) Finde GameParticipant im selben Spiel für den Gewinner
            GameParticipant winnerParticipant = game.getPlayers().stream()
                    .filter(gp -> gp.getPlayer() != null && gp.getPlayer().equals(winner))
                    .findFirst()
                    .orElse(null);

            if (winnerParticipant == null) continue; // kein zugeordnetes Teilnehmer-Objekt für den Gewinner

            // 3) Prüfe Commander des Gewinner-Decks
            Deck winnerDeck = winnerParticipant.getDeck();
            if (winnerDeck == null) continue;

            String winnerCommander = Optional.ofNullable(winnerDeck.getCommander())
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .orElse(null);

            if (winnerCommander != null && winnerCommander.equals(search)) {
                wins++;
            }
        }

        return wins;
    }

    public enum DeterminedType {
        PLAYER,
        COMMANDER,
        COLOR
    }

}
