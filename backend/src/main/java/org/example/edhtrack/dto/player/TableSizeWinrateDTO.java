package org.example.edhtrack.dto.player;

public record TableSizeWinrateDTO(
        int tableSize,
        int games,
        int wins,
        double winRate
) {}
