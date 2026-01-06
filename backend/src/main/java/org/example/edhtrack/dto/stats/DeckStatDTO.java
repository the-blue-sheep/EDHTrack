package org.example.edhtrack.dto.stats;

public record DeckStatDTO(
        int deckId,
        String deckName,
        int totalGames,
        int wins,
        double winRate,
        boolean isRetired
) {}
