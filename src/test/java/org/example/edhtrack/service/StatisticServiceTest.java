package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticServiceTest {

    @Mock
    private GameParticipantRepository gameParticipantRepository;

    @InjectMocks
    private StatisticService statisticService;

    @Test
    void getWinRateByPlayer_shouldCalculateCorrectly() {
        Player player = new Player("Max");
        Game game = new Game();
        game.setWinner(player);

        Deck deck = new Deck();
        deck.setCommander("Atraxa");

        GameParticipant participant = new GameParticipant();
        participant.setGame(game);
        participant.setPlayer(player);
        participant.setDeck(deck);

        when(gameParticipantRepository.findByPlayer(player))
                .thenReturn(List.of(participant));

        WinrateByPlayerDTO result = statisticService.getWinRateByPlayer(player);

        assertEquals(1.0, result.winRate());
    }

    @Test
    void countCommanderWins_shouldReturn1_whenCommanderWins() {
        Player winner = new Player("Maxim");
        Deck deck = new Deck();
        deck.setCommander("Atraxa");

        Game game = new Game();
        game.setWinner(winner);

        GameParticipant participant = new GameParticipant();
        participant.setPlayer(winner);
        participant.setDeck(deck);
        participant.setGame(game);

        // bidirektional, sonst kennt Game seine Teilnehmer nicht
        game.setPlayers(List.of(participant));

        int wins = Utils.countCommanderWins(List.of(participant), "Atraxa");

        assertEquals(1, wins);
    }

    @Test
    void getWinrateByColor_shouldCalculateCorrectly() {
        Player player = new Player("Maxim");
        Game game = new Game();
        game.setWinner(player);

        Deck deck = new Deck();
        deck.setCommander("Atraxa");
        deck.setColors("WUBG");
        GameParticipant participant = new GameParticipant();
        participant.setGame(game);
        participant.setPlayer(player);
        participant.setDeck(deck);

        when(gameParticipantRepository.findByDeck_ColorsContaining(deck.getColors()))
                .thenReturn(List.of(participant));

        ColorStatDTO result = statisticService.getWinrateByColor(deck.getColors());

        assertEquals(1.0, result.winRate());
    }

    @Test
    void getWinRateAgainstOtherPlayer_shouldReturnCorrectRate() {
        // GIVEN
        Player player1 = new Player("Alice");
        Player player2 = new Player("Bob");

        Game game1 = new Game();
        game1.setWinner(player1);

        GameParticipant gp1a = new GameParticipant();
        gp1a.setGame(game1);
        gp1a.setPlayer(player1);

        GameParticipant gp1b = new GameParticipant();
        gp1b.setGame(game1);
        gp1b.setPlayer(player2);

        game1.setPlayers(List.of(gp1a, gp1b));

        Game game2 = new Game();
        game2.setWinner(player2);

        GameParticipant gp2a = new GameParticipant();
        gp2a.setGame(game2);
        gp2a.setPlayer(player1);

        GameParticipant gp2b = new GameParticipant();
        gp2b.setGame(game2);
        gp2b.setPlayer(player2);

        game2.setPlayers(List.of(gp2a, gp2b));

        when(gameParticipantRepository.findByPlayer(player1))
                .thenReturn(List.of(gp1a, gp2a));

        when(gameParticipantRepository.findByPlayer(player2))
                .thenReturn(List.of(gp1b, gp2b));

        // WHEN
        WinrateAgainstAnotherPlayer result =
                statisticService.getWinRateAgainstOtherPlayer(player1, player2);

        // THEN
        assertNotNull(result);
        assertEquals(player1, result.player());
        assertEquals(0.5, result.winRate(), 0.0001);
    }


    @Test
    void getStreaksByPlayer_shouldReturnCorrectStreaks() {
        // GIVEN
        Player player = new Player("Maxim");

        Game g1 = new Game(); g1.setWinner(player);
        Game g2 = new Game(); g2.setWinner(player);
        Game g3 = new Game(); g3.setWinner(new Player("Felix"));
        Game g4 = new Game(); g4.setWinner(new Player("Felix"));
        Game g5 = new Game(); g5.setWinner(player);

        List<GameParticipant> participants = new ArrayList<>();

        GameParticipant p1 = new GameParticipant();
        p1.setPlayer(player);
        p1.setGame(g1);
        participants.add(p1);

        GameParticipant p2 = new GameParticipant();
        p2.setPlayer(player);
        p2.setGame(g2);
        participants.add(p2);

        GameParticipant p3 = new GameParticipant();
        p3.setPlayer(player);
        p3.setGame(g3);
        participants.add(p3);

        GameParticipant p4 = new GameParticipant();
        p4.setPlayer(player);
        p4.setGame(g4);
        participants.add(p4);

        GameParticipant p5 = new GameParticipant();
        p5.setPlayer(player);
        p5.setGame(g5);
        participants.add(p5);

        when(gameParticipantRepository.findByPlayer(player)).thenReturn(participants);

        StreakDTO result = statisticService.getStreaksByPlayer(player);

        // THEN
        assertEquals(player.getName(), result.playerName());
        assertEquals(List.of(2, -2, 1), result.streaks());
    }

    @Test
    void getCommanderStatsForAll_shouldReturnCorrectStats() {
        // GIVEN
        Player player1 = new Player("Maxim");
        Player player2 = new Player("Felix");

        Deck deck1 = new Deck();
        deck1.setCommander("Atraxa");

        Deck deck2 = new Deck();
        deck2.setCommander("Atraxa");

        Game game1 = new Game();
        game1.setWinner(player1);

        Game game2 = new Game();
        game2.setWinner(player2);

        GameParticipant p1 = new GameParticipant();
        p1.setPlayer(player1);
        p1.setDeck(deck1);
        p1.setGame(game1);

        GameParticipant p2 = new GameParticipant();
        p2.setPlayer(player2);
        p2.setDeck(deck2);
        p2.setGame(game2);

        List<GameParticipant> participants = List.of(p1, p2);

        when(gameParticipantRepository.findByDeck_CommanderContaining("Atraxa"))
                .thenReturn(participants);

        // WHEN
        CommanderStatDTO result = statisticService.getCommanderStatsForAll("Atraxa");

        // THEN
        assertEquals("Atraxa", result.commanderName());
        assertEquals(2, result.totalGames());     // zwei unterschiedliche Spiele
        assertEquals(2, result.totalPlayers());   // beide Spieler haben einmal gewonnen
        assertEquals(2, result.totalWins());       // beide Spiele gewonnen (je einer)
        assertEquals(1.0, result.winRate());
    }


    @Test
    void getLeaderboard_shouldGroupAndSortCorrectly_byPlayer() {
        // GIVEN
        Player player1 = new Player("Alice");
        Player player2 = new Player("Bob");

        Game game1 = new Game();
        game1.setWinner(player1);

        Game game2 = new Game();
        game2.setWinner(player1);

        Game game3 = new Game();
        game3.setWinner(player2);

        Deck deck = new Deck();
        deck.setCommander("Atraxa");
        deck.setColors("WUBG");

        GameParticipant gp1 = new GameParticipant();
        gp1.setPlayer(player1);
        gp1.setDeck(deck);
        gp1.setGame(game1);

        GameParticipant gp2 = new GameParticipant();
        gp2.setPlayer(player1);
        gp2.setDeck(deck);
        gp2.setGame(game2);

        GameParticipant gp3 = new GameParticipant();
        gp3.setPlayer(player2);
        gp3.setDeck(deck);
        gp3.setGame(game3);

        //WHEN
        when(gameParticipantRepository.findAll()).thenReturn(List.of(gp1, gp2, gp3));

        List<LeaderboardEntryDTO> leaderboard = statisticService.getLeaderboard(Utils.DeterminedType.PLAYER);

        assertEquals(2, leaderboard.size());

        LeaderboardEntryDTO first = leaderboard.get(0);
        LeaderboardEntryDTO second = leaderboard.get(1);

        // THEN
        assertEquals("Alice", first.playerName());
        assertEquals(2, first.totalGames());
        assertEquals(2, first.wins());
        assertEquals(1.0, first.winRate(), 0.001);

        assertEquals("Bob", second.playerName());
        assertEquals(1, second.totalGames());
        assertEquals(1, second.wins());
        assertEquals(1.0, second.winRate(), 0.001);
    }

}