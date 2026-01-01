package org.example.edhtrack.dto.player;

public record PlayerGamesCountDTO(
        int playerId,
        String playerName,
        boolean isRetired,
        int totalGames
) {}