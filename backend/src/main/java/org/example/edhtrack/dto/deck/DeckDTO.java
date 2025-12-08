package org.example.edhtrack.dto.deck;

import java.util.Set;

public record DeckDTO(
        int deckId,
        Set<String> commanders,
        String deckName,
        String colors,
        boolean retired
) {}
