package org.example.edhtrack;

import lombok.Getter;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.player.PlayerResultDTO;
import org.example.edhtrack.entity.Commander;
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
                    .collect(Collectors.groupingBy(p ->
                            String.valueOf(Optional.ofNullable(p.getDeck())
                                    .map(d -> d.getCommanders()
                                            .stream()
                                            .map(Commander::getName)
                                            .sorted()
                                            .toList()
                                    ).orElse(List.of("Unknown")))
                    ));
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
                .map(Deck::getCommanders)
                .filter(Objects::nonNull)
                .flatMap(Set::stream)
                .map(Commander::getName)
                .filter(Objects::nonNull)
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(name -> name.equals(search))
                .count();
    }

    public static DeckDTO toDTO(Deck deck) {
        Set<String> commanders = deck.getCommanders()
                .stream()
                .map(Commander::getName)
                .collect(Collectors.toSet());

        return new DeckDTO(
                deck.getDeckId(),
                commanders,
                deck.getDeckName(),
                deck.getColors(),
                deck.getBracket(),
                deck.isRetired()
        );
    }

    public static PlayerResultDTO mapToPlayerResult(GameParticipant gp) {
        return new PlayerResultDTO(
                gp.getPlayer().getName(),
                gp.getDeck().getCommanders().stream()
                        .map(Commander::getName)
                        .collect(Collectors.toSet()),
                gp.isWinner()
        );
    }

    public enum DeterminedType {
        PLAYER,
        COMMANDER,
        COLOR
    }

    public enum Role {
        USER,
        SUPERUSER,
        ADMIN
    }

    @Getter
    public enum Bracket {
        BRACKET1("Bracket 1"),
        BRACKET2("Bracket 2"),
        BRACKET3("Bracket 3"),
        BRACKET4("Bracket 4"),
        CEDH("cEdh");

        private final String displayName;

        Bracket(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public static List<Integer> parseGroups(String groupIds) {
        if (groupIds == null || groupIds.isBlank()) {
            return null;
        }

        return Arrays.stream(groupIds.split(","))
                .map(Integer::parseInt)
                .toList();
    }

}
