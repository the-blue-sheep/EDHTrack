package org.example.edhtrack.dto.stats;

import java.util.List;

public record DeckStatDTO(
        int deckId,
        String deckName,
        int totalGames,
        int wins,
        double winRate,
        List<Integer> tableSize,
        boolean isRetired
) {}
