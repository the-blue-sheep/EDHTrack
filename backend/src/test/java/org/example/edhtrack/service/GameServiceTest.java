package org.example.edhtrack.service;

import org.example.edhtrack.dto.GameParticipantOverviewDTO;
import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameEditDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.dto.GameParticipantDTO;
import org.example.edhtrack.entity.*;
import org.example.edhtrack.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.*;

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
    void getGames_returnsCorrectOverview() {
        Game g1 = new Game();
        g1.setId(100);
        g1.setDate(LocalDate.of(2025, 12, 1));
        g1.setNotes("Test Game");

        GameParticipant gp1 = new GameParticipant();

        Player p1 = new Player();
        p1.setPlayerId(3);
        p1.setName("Carl");

        Deck d1 = new Deck();
        d1.setDeckId(30);
        d1.setDeckName("DeckC");

        gp1.setPlayer(p1);
        gp1.setDeck(d1);
        gp1.setWinner(true);

        g1.setPlayers(List.of(gp1));

        Page<Game> page = new PageImpl<>(List.of(g1));

        when(gameRepository.findByFilters(
                any(),
                any(),
                any(Pageable.class)
        )).thenReturn(page);

        Page<GameOverviewDTO> result = gameService.getGames(0, 10, 0, "");

        assertThat(result.getContent()).hasSize(1);

        GameOverviewDTO gameDto = result.getContent().getFirst();
        assertThat(gameDto.gameId()).isEqualTo(100);
        assertThat(gameDto.notes()).isEqualTo("Test Game");
        assertThat(gameDto.date()).isEqualTo(LocalDate.of(2025, 12, 1));

        assertThat(gameDto.participants()).hasSize(1);

        GameParticipantOverviewDTO partDto = gameDto.participants().getFirst();
        assertThat(partDto.playerName()).isEqualTo("Carl");
        assertThat(partDto.deckName()).isEqualTo("DeckC");
        assertThat(partDto.isWinner()).isTrue();

        verify(gameRepository).findByFilters(any(), any(), any(Pageable.class));
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

    @Test
    void getGameById_returnsCorrectGame() {
        Game game = new Game();
        game.setId(1);
        game.setDate(LocalDate.of(2025, 1, 1));
        game.setNotes("Test");

        Player player = new Player();
        player.setPlayerId(10);
        player.setName("Alice");

        Deck deck = new Deck();
        deck.setDeckId(20);
        deck.setDeckName("Control");

        GameParticipant gp = new GameParticipant();
        gp.setGame(game);
        gp.setPlayer(player);
        gp.setDeck(deck);
        gp.setWinner(true);

        game.setPlayers(List.of(gp));

        when(gameRepository.findById(1)).thenReturn(Optional.of(game));

        GameOverviewDTO dto = gameService.getGameById(1);

        assertThat(dto.gameId()).isEqualTo(1);
        assertThat(dto.notes()).isEqualTo("Test");
        assertThat(dto.participants()).hasSize(1);

        GameParticipantOverviewDTO p = dto.participants().getFirst();
        assertThat(p.playerName()).isEqualTo("Alice");
        assertThat(p.deckName()).isEqualTo("Control");
        assertThat(p.isWinner()).isTrue();
    }

    @Test
    void deleteGameById_deletesGame() {
        gameService.deleteGameById(42);

        verify(gameRepository).deleteById(42);
    }

    @Test
    void updateGame_updatesGameAndParticipants() throws Exception {

        Game game = new Game();
        game.setId(1);
        game.setDate(LocalDate.of(2024, 1, 1));
        game.setNotes("Old");

        game.setPlayers(new ArrayList<>());

        when(gameRepository.findById(1)).thenReturn(Optional.of(game));

        Player player = new Player();
        player.setPlayerId(10);
        player.setName("Alice");

        Deck deck = new Deck();
        deck.setDeckId(20);
        deck.setDeckName("Control");

        when(playerRepository.findById(10)).thenReturn(Optional.of(player));
        when(deckRepository.findById(20)).thenReturn(Optional.of(deck));

        GameParticipantDTO participantDTO = new GameParticipantDTO(10, 20, true);

        GameEditDTO dto = new GameEditDTO(
                LocalDate.of(2025, 5, 5),
                "Updated",
                List.of(participantDTO)
        );

        // when
        gameService.updateGame(1, dto);

        // then
        assertThat(game.getDate()).isEqualTo(LocalDate.of(2025, 5, 5));
        assertThat(game.getNotes()).isEqualTo("Updated");
        assertThat(game.getPlayers()).hasSize(1);

        GameParticipant gp = game.getPlayers().getFirst();
        assertThat(gp.getPlayer().getName()).isEqualTo("Alice");
        assertThat(gp.getDeck().getDeckName()).isEqualTo("Control");
        assertThat(gp.isWinner()).isTrue();

        verify(gameRepository).save(game);
    }

}