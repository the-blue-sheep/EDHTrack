package org.example.edhtrack.dto.player;

import java.util.List;

public record TableSizeWinrateResponseDTO(
        int playerId,
        String playerName,
        List<TableSizeWinrateDTO> stats
) {}

