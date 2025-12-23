package org.example.edhtrack.service;

import org.example.edhtrack.dto.GameParticipantOverviewDTO;
import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.dto.GameParticipantDTO;
import org.example.edhtrack.entity.*;
import org.example.edhtrack.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class GameServiceTest {

    @Mock
    GameRepository gameRepository;

    @Mock
    GameParticipantRepository gameParticipantRepository;

    @Mock
    PlayerRepository playerRepository;

    @Mock
    DeckRepository deckRepository;

    GameService gameService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        gameService = new GameService(gameRepository, gameParticipantRepository, playerRepository, deckRepository);
    }

    @Test
    void createGame_shouldSaveGameAndParticipants() {
        // Arrange
        LocalDate date = LocalDate.of(2025, 12, 24);

        var dto = new CreateGameDTO(
                date,
                "Holiday Game",
                List.of(
                        new GameParticipantDTO(1, 10, true),
                        new GameParticipantDTO(2, 20, false)
                )
        );

        Player p1 = new Player();
        p1.setPlayerId(1);
        p1.setName("Alice");

        Player p2 = new Player();
        p2.setPlayerId(2);
        p2.setName("Bob");

        Deck d1 = new Deck();
        d1.setDeckId(10);
        d1.setDeckName("DeckA");
        d1.setCommanders(new HashSet<>());

        Deck d2 = new Deck();
        d2.setDeckId(20);
        d2.setDeckName("DeckB");
        d2.setCommanders(new HashSet<>());

        when(playerRepository.findById(1)).thenReturn(Optional.of(p1));
        when(playerRepository.findById(2)).thenReturn(Optional.of(p2));

        when(deckRepository.findById(10)).thenReturn(Optional.of(d1));
        when(deckRepository.findById(20)).thenReturn(Optional.of(d2));

        Game savedGame = new Game();
        savedGame.setId(55);
        savedGame.setDate(date);
        savedGame.setNotes("Holiday Game");

        when(gameRepository.save(any(Game.class))).thenReturn(savedGame);

        CreateGameResponseDTO result = gameService.createGame(dto);

        assertThat(result.gameId()).isEqualTo(55);
        assertThat(result.date()).isEqualTo(date);

        verify(gameParticipantRepository).saveAll(anyList());

        assertThat(result.players()).hasSize(2);
        assertThat(result.players().get(0).playerName()).isEqualTo("Alice");
        assertThat(result.players().get(1).playerName()).isEqualTo("Bob");
    }

    @Test
    void getAllGames_returnsCorrectOverview() {
        Game g1 = new Game();
        g1.setId(100);
        g1.setDate(LocalDate.of(2025, 12, 1));
        g1.setNotes("Test Game");

        GameParticipant gp1 = new GameParticipant();
        Player p1 = new Player(); p1.setPlayerId(3); p1.setName("Carl");
        Deck d1 = new Deck(); d1.setDeckId(30); d1.setDeckName("DeckC");
        gp1.setPlayer(p1);
        gp1.setDeck(d1);
        gp1.setWinner(true);

        g1.setPlayers(List.of(gp1));

        when(gameRepository.findAll()).thenReturn(List.of(g1));

        List<GameOverviewDTO> result = gameService.getAllGames();

        assertThat(result).hasSize(1);

        GameOverviewDTO gameDto = result.getFirst();
        assertThat(gameDto.gameId()).isEqualTo(100);
        assertThat(gameDto.notes()).isEqualTo("Test Game");
        assertThat(gameDto.date()).isEqualTo(LocalDate.of(2025, 12, 1));

        assertThat(gameDto.participants()).hasSize(1);

        GameParticipantOverviewDTO partDto = gameDto.participants().getFirst();
        assertThat(partDto.playerName()).isEqualTo("Carl");
        assertThat(partDto.deckName()).isEqualTo("DeckC");
        assertThat(partDto.isWinner()).isTrue();

        verify(gameRepository).findAll();
    }

    @Test
    void createGame_ifDateIsNull_usesNow() {
        CreateGameDTO dto = new CreateGameDTO(
                null,
                "Notes",
                List.of(new GameParticipantDTO(1, 10, true))
        );

        Player p1 = new Player();
        p1.setPlayerId(1);
        p1.setName("Alice");
        Deck d1 = new Deck();
        d1.setDeckId(10);
        d1.setDeckName("Alpha");
        d1.setCommanders(new HashSet<>());

        when(playerRepository.findById(1)).thenReturn(Optional.of(p1));
        when(deckRepository.findById(10)).thenReturn(Optional.of(d1));

        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game g = invocation.getArgument(0);
            g.setId(500);
            return g;
        });

        CreateGameResponseDTO result = gameService.createGame(dto);

        assertThat(result.date()).isEqualTo(LocalDate.now());
        assertThat(result.gameId()).isEqualTo(500);
    }

}