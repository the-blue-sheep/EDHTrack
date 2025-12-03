package org.example.edhtrack.dto.deck;

import java.util.List;

public record DeckDTO(
        int deckId,
        List<String> commanders,
        String deckName,
        String colors,
        boolean retired
) {}
