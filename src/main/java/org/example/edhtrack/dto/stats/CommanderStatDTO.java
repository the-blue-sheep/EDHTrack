package org.example.edhtrack.dto.stats;

public record CommanderStatDTO(String commanderName, int totalGames, int totalPlayers, int totalWins, double winRate) {}
