package org.example.edhtrack.dto.player;

import java.util.List;

public record PlayerResultDTO(
        String playerName,
        List<String> commanders,
        boolean winner
) {}
