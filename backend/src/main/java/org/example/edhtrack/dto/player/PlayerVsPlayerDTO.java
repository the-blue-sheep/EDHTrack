package org.example.edhtrack.dto.player;

public record PlayerVsPlayerDTO(
        int player1Id,
        String player1Name,
        int player2Id,
        String player2Name,
        int totalGamesPlayer1,
        int totalGamesPlayer2,
        int gamesTogether,
        int player1WinsHeadToHead,
        int player2WinsHeadToHead,
        double winRatePlayer1Overall,
        double winRatePlayer2Overall,
        double winRatePlayer1WithPlayer2,
        double winRatePlayer2WithPlayer1,
        double deltaPlayer1,
        double deltaPlayer2
) {}