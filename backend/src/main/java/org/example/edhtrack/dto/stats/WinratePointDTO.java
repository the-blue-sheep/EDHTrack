package org.example.edhtrack.dto.stats;


public record WinratePointDTO(
        int gamesPlayed,
        int wins,
        double winrate
) {}
