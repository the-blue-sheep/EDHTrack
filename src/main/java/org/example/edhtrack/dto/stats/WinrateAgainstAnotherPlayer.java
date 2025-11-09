package org.example.edhtrack.dto.stats;

import org.example.edhtrack.entity.Player;

public record WinrateAgainstAnotherPlayer(Player player, Player opposingPlayer, double winRate) {}
