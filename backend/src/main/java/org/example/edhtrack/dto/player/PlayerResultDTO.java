package org.example.edhtrack.dto.player;

import java.util.Set;

public record PlayerResultDTO(
        String playerName,
        Set<String> commanders,
        boolean winner
) {}
