package org.example.edhtrack.dto;

import java.util.Set;

public record GameParticipantOverviewDTO(
        int playerId,
        String playerName,
        int deckId,
        Set<String> commanders,
        String deckName,
        String notes,
        boolean isWinner,
        Integer turnOrder
) {}
