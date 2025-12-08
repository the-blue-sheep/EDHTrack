package org.example.edhtrack.dto.deck;

import java.util.Set;

public record CreateDeckDTO(
        int playerId,
        Set<String> commanders,
        String deckName,
        String colors
) {}
