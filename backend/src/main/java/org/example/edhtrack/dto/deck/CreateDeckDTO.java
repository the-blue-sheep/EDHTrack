package org.example.edhtrack.dto.deck;

import java.util.List;

public record CreateDeckDTO(
        int playerId,
        List<String> commanders,
        String deckName,
        String colors
) {}
