package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.PlayerVsPlayerDTO;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Commander;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StatisticServiceTest {

    @Mock
    private GameParticipantRepository gameParticipantRepository;

    @InjectMocks
    private StatisticService statisticService;

    // Helpers

    private Player player(String name) {
        Player p = new Player();
        p.setName(name);
        return p;
    }

    private Commander commander(String name) {
        return new Commander(name);
    }

    private Deck deck(String commanderName) {
        Deck deck = new Deck();
        deck.setDeckName(commanderName);
        deck.setCommanders(Set.of(commander(commanderName)));
        return deck;
    }

    private GameParticipant gp(Game game, Player player, Deck deck, boolean winner) {
        GameParticipant gp = new GameParticipant();
        gp.setGame(game);
        gp.setPlayer(player);
        gp.setDeck(deck);
        gp.setWinner(winner);
        return gp;
    }

    // Tests

    @Test
    void getWinRateByPlayer_shouldCalculateCorrectly() {
        Player player = player("Max");
        Deck deck = deck("Atraxa");

        Game game = new Game();
        GameParticipant participant = gp(game, player, deck, true);
        game.setPlayers(List.of(participant));

        when(gameParticipantRepository.findByPlayer(player))
                .thenReturn(List.of(participant));

        WinrateByPlayerDTO result = statisticService.getWinRateByPlayer(player);

        assertEquals(1.0, result.winRate());
    }

    @Test
    void countCommanderWins_shouldReturn1_whenCommanderWins() {
        Player winner = player("Maxim");
        Deck deck = deck("Atraxa");

        Game game = new Game();
        GameParticipant participant = gp(game, winner, deck, true);
        game.setPlayers(List.of(participant));

        int wins = Utils.countCommanderWins(List.of(participant), "Atraxa");

        assertEquals(1, wins);
    }

    @Test
    void getWinrateByColor_shouldCalculateCorrectly() {
        Player player = player("Maxim");
        Deck deck = deck("Atraxa");
        deck.setColors("WUBG");

        Game game = new Game();
        GameParticipant participant = gp(game, player, deck, true);
        game.setPlayers(List.of(participant));

        when(gameParticipantRepository.findByDeck_ColorsContaining(deck.getColors()))
                .thenReturn(List.of(participant));

        ColorStatDTO result = statisticService.getWinrateByColor(deck.getColors());

        assertEquals(1.0, result.winRate());
    }

    @Test
    void getWinRateAgainstOtherPlayer_shouldReturnCorrectRate() {
        Player alice = player("Alice");
        Player bob = player("Bob");

        // Spiel 1 — Alice gewinnt
        Game g1 = new Game();
        GameParticipant g1a = gp(g1, alice, null, true);
        GameParticipant g1b = gp(g1, bob, null, false);
        g1.setPlayers(List.of(g1a, g1b));

        // Spiel 2 — Bob gewinnt
        Game g2 = new Game();
        GameParticipant g2a = gp(g2, alice, null, false);
        GameParticipant g2b = gp(g2, bob, null, true);
        g2.setPlayers(List.of(g2a, g2b));

        when(gameParticipantRepository.findByPlayer(alice)).thenReturn(List.of(g1a, g2a));
        when(gameParticipantRepository.findByPlayer(bob)).thenReturn(List.of(g1b, g2b));

        PlayerVsPlayerDTO result =
                statisticService.getWinRateAgainstOtherPlayer(alice, bob);

        assertNotNull(result);
        assertEquals(alice.getName(), result.player1Name());
        assertEquals(alice.getId(), result.player1Id());
        assertEquals(0.5, result.winRate(), 0.0001);
    }

    @Test
    void getStreaksByPlayer_shouldReturnCorrectStreaks() {
        Player player = player("Maxim");

        List<GameParticipant> participants = new ArrayList<>();

        Game g1 = new Game();
        GameParticipant p1 = gp(g1, player, null, true);
        g1.setPlayers(List.of(p1));
        participants.add(p1);

        Game g2 = new Game();
        GameParticipant p2 = gp(g2, player, null, true);
        g2.setPlayers(List.of(p2));
        participants.add(p2);

        Game g3 = new Game();
        GameParticipant p3 = gp(g3, player, null, false);
        g3.setPlayers(List.of(p3));
        participants.add(p3);

        Game g4 = new Game();
        GameParticipant p4 = gp(g4, player, null, false);
        g4.setPlayers(List.of(p4));
        participants.add(p4);

        Game g5 = new Game();
        GameParticipant p5 = gp(g5, player, null, true);
        g5.setPlayers(List.of(p5));
        participants.add(p5);

        when(gameParticipantRepository.findByPlayer(player)).thenReturn(participants);

        StreakDTO result = statisticService.getStreaksByPlayer(player);

        assertEquals(player.getName(), result.playerName());
        assertEquals(List.of(2, -2, 1), result.streaks());
    }

    @Test
    void getCommanderStatsForAll_shouldReturnCorrectStats() {
        Player p1 = player("Maxim");
        Player p2 = player("Felix");

        Commander atraxa = new Commander("Atraxa");

        Deck d1 = new Deck();
        d1.setDeckName("Deck1");
        d1.setCommanders(Set.of(atraxa));

        Deck d2 = new Deck();
        d2.setDeckName("Deck2");
        d2.setCommanders(Set.of(atraxa));

        Game g1 = new Game();
        g1.setId(1);
        GameParticipant gp1 = gp(g1, p1, d1, true);
        g1.setPlayers(List.of(gp1));

        Game g2 = new Game();
        g2.setId(2);
        GameParticipant gp2 = gp(g2, p2, d2, true);
        g2.setPlayers(List.of(gp2));

        when(gameParticipantRepository.findByDeck_Commanders_NameIgnoreCase("Atraxa"))
                .thenReturn(List.of(gp1, gp2));

        CommanderStatDTO result = statisticService.getCommanderStatsForAll("Atraxa");

        assertEquals("Atraxa", result.commanderName());
        assertEquals(2, result.totalGames());
        assertEquals(2, result.totalPlayers());
        assertEquals(2, result.totalWins());
        assertEquals(1.0, result.winRate());
    }


    @Test
    void getLeaderboard_shouldGroupAndSortCorrectly_byPlayer() {

        Player alice = player("Alice");
        alice.setPlayerId(1);

        Player harold = player("Harold");
        harold.setPlayerId(3);

        Deck deckAlice = deck("Atraxa");
        deckAlice.setDeckId(1);
        deckAlice.setColors("WUBG");
        deckAlice.setPlayer(alice);

        Deck deckHarold = deck("Atraxa");
        deckHarold.setDeckId(2);
        deckHarold.setColors("WUBG");
        deckHarold.setPlayer(harold);

        Game g1 = new Game();
        GameParticipant gp1 = gp(g1, alice, deckAlice, true);
        g1.setPlayers(List.of(gp1));

        Game g2 = new Game();
        GameParticipant gp2 = gp(g2, alice, deckAlice, true);
        g2.setPlayers(List.of(gp2));

        Game g3 = new Game();
        GameParticipant gp3 = gp(g3, harold, deckHarold, false);
        g3.setPlayers(List.of(gp3));

        when(gameParticipantRepository.findAll())
                .thenReturn(List.of(gp1, gp2, gp3));

        List<LeaderboardEntryDTO> leaderboard =
                statisticService.getLeaderboard(Utils.DeterminedType.PLAYER, 0, false, false);

        assertEquals(2, leaderboard.size());

        LeaderboardEntryDTO first = leaderboard.get(0);
        LeaderboardEntryDTO second = leaderboard.get(1);

        assertEquals("Alice", first.playerName());
        assertEquals(2, first.totalGames());
        assertEquals(2, first.wins());

        assertEquals("Harold", second.playerName());
        assertEquals(1, second.totalGames());
        assertEquals(0, second.wins());
    }
}
