package org.example.edhtrack.dto.stats;

public record PlayerWinRateDTO(String playerName, int totalGames, int wins, double winRate) {}
