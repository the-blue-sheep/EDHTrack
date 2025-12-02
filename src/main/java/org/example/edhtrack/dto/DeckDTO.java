package org.example.edhtrack.dto;

import java.util.List;

public record DeckDTO(
        int deckId,
        List<String> commanders,
        String deckName,
        String colors,
        boolean retired
) {}
