package org.example.edhtrack.dto.stats;

import org.example.edhtrack.entity.Player;

public record WinrateByPlayerDTO(Player player, int gamesIn, int gamesWon, double winRate) {}
