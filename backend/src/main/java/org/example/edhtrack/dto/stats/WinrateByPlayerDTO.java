package org.example.edhtrack.dto.stats;

public record WinrateByPlayerDTO(
        int playerId,
        String playerName,
        int gamesIn,
        int gamesWon,
        double winRate) {}
