package org.example.edhtrack.dto.player;

public record PlayerVsPlayerDTO(
        int player1Id,
        String player1Name,
        int player2Id,
        String player2Name,
        double winRate
) {}