package org.example.edhtrack.dto.stats;

import java.util.List;

public record WinrateOverTimeDTO(
        int playerId,
        int deckId,
        int stepSize,
        List<WinratePointDTO> points,
        String groupIds
) {}
