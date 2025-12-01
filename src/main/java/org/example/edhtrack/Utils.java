package org.example.edhtrack;

import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.GameParticipant;

import java.util.*;
import java.util.stream.Collectors;

public final class Utils {
    public static int countWins(List<GameParticipant> participants) {
        return (int) participants.stream()
                .filter(GameParticipant::isWinner)
                .count();
    }

    public static Map<String, Integer> countWinsByType(List<GameParticipant> participants, DeterminedType type) {
        if (participants == null) return Collections.emptyMap();

        Map<String, List<GameParticipant>> grouped = switch (type) {
            case PLAYER -> participants.stream()
                    .collect(Collectors.groupingBy(p -> p.getPlayer().getName()));
            case COMMANDER -> participants.stream()
                    .collect(Collectors.groupingBy(p -> Optional.ofNullable(p.getDeck())
                            .map(Deck::getCommander)
                            .orElse("Unknown")));
            case COLOR -> participants.stream()
                    .collect(Collectors.groupingBy(p -> Optional.ofNullable(p.getDeck())
                            .map(Deck::getColors)
                            .orElse("Unknown")));
        };

        return grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> (int) entry.getValue().stream()
                                .filter(GameParticipant::isWinner)
                                .count()
                ));
    }


    public static int countCommanderWins(List<GameParticipant> participants, String commanderName) {
        if (participants == null || participants.isEmpty() || commanderName == null) return 0;

        String search = commanderName.trim().toLowerCase();

        return (int) participants.stream()
                .filter(GameParticipant::isWinner)
                .map(GameParticipant::getDeck)
                .filter(Objects::nonNull)
                .map(Deck::getCommander)
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(cmd -> cmd.equals(search))
                .count();
    }


    public enum DeterminedType {
        PLAYER,
        COMMANDER,
        COLOR
    }

}
