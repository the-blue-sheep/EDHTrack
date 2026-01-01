package org.example.edhtrack.dto.player;

public record PlayerDetailDTO(
        int playerId,
        String playerName,
        boolean isRetired,
        int totalGames,
        int wins,
        double winRate
) {}
