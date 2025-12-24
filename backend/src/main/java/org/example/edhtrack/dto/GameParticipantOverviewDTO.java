package org.example.edhtrack.dto;

public record GameParticipantOverviewDTO(
        int playerId,
        String playerName,
        int deckId,
        String deckName,
        boolean isWinner
) {}
