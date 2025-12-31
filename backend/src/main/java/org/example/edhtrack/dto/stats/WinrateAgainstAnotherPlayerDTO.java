package org.example.edhtrack.dto.stats;

import org.example.edhtrack.entity.Player;

public record WinrateAgainstAnotherPlayerDTO(Player player1, Player player2, double winRate) {}
