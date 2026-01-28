package org.example.edhtrack.dto.deck;

import org.example.edhtrack.Utils;

import java.util.Set;

public record DeckDTO(
        int deckId,
        Set<String> commanders,
        String deckName,
        String colors,
        Utils.Bracket bracket,
        boolean retired
) {}
