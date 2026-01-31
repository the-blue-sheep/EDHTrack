package org.example.edhtrack.dto.deck;

import org.example.edhtrack.Utils;

import java.util.Set;

public record CreateDeckDTO(
        int playerId,
        Set<String> commanders,
        String deckName,
        Utils.Bracket bracket,
        String colors
) {}
