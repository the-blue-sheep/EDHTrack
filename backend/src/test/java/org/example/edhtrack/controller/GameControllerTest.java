package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;

import org.example.edhtrack.dto.GameParticipantOverviewDTO;
import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameEditDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.dto.player.PlayerResultDTO;
import org.example.edhtrack.entity.*;
import org.example.edhtrack.repository.UserRepository;
import org.example.edhtrack.service.GameService;
import org.example.edhtrack.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GameController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class GameControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GameService gameService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void getGames_returnsPagedGames() throws Exception {
        GameParticipantOverviewDTO p1 =
                new GameParticipantOverviewDTO(1, "Alice", 11, Set.of("Mrs. Bumbleflower"), "Bribe Control", "", true, 0);
        GameParticipantOverviewDTO p2 =
                new GameParticipantOverviewDTO(2, "Bob", 22, Set.of("Hazezon, Shaper of Sands"), "Midrange", "", false, 0);

        GameOverviewDTO game1 = new GameOverviewDTO(
                100,
                LocalDate.of(2025, 12, 1),
                "Fun game",
                List.of(p1, p2),
                1,
                0,
                0
        );

        Page<GameOverviewDTO> page = new PageImpl<>(
                List.of(game1),
                PageRequest.of(1, 10),
                1
        );

        when(gameService.getGames(
                anyInt(),
                anyInt(),
                any(),
                any(),
                any()
        )).thenReturn(page);

        mockMvc.perform(get("/api/games")
                        .param("page", "1")
                        .param("size", "10")
                        .param("playerId", "0")
                        .param("commander", "")
                        .param("groupIds", "")
                        .param("firstKillTurn", "0")
                        .param("lastTurn", "0")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].gameId").value(100))
                .andExpect(jsonPath("$.content[0].notes").value("Fun game"))
                .andExpect(jsonPath("$.content[0].participants[0].playerName").value("Alice"))
                .andExpect(jsonPath("$.content[0].participants[1].playerName").value("Bob"));
    }

    @Test
    void createGame_shouldReturnCreatedGame() throws Exception {
        // GIVEN
        LocalDate date = LocalDate.now();

        Player alice = new Player("Alice");
        alice.setPlayerId(1);
        Player bob = new Player("Bob");
        bob.setPlayerId(2);

        Deck deckAlice = new Deck();
        deckAlice.setDeckId(10);
        Commander commanderAlice = new Commander();
        commanderAlice.setName("Atraxa");
        deckAlice.setCommanders(Set.of(commanderAlice));
        deckAlice.setPlayer(alice);

        Deck deckBob = new Deck();
        deckBob.setDeckId(11);
        Commander commanderBob = new Commander();
        commanderBob.setName("Krenko");
        deckBob.setCommanders(Set.of(commanderBob));
        deckBob.setPlayer(bob);

        GameParticipant gp1 = new GameParticipant();
        gp1.setId(1);
        gp1.setPlayer(alice);
        gp1.setDeck(deckAlice);

        GameParticipant gp2 = new GameParticipant();
        gp2.setId(2);
        gp2.setPlayer(bob);
        gp2.setDeck(deckBob);

        List<GameParticipant> participants = List.of(gp1, gp2);
        List<PlayerResultDTO> playerResultDTOs = participants.stream().map(Utils::mapToPlayerResult).toList();

        CreateGameResponseDTO response = new CreateGameResponseDTO(
                2,
                date,
                playerResultDTOs,
                1
        );


        when(gameService.createGame(any(CreateGameDTO.class)))
                .thenReturn(response);

        String requestJson = """
        {
          "gameId": 2,
          "date": "%s",
          "notes": "First Turn Sol Ring wins",
          "participants": [
            { "playerId": 1, "deckId": 10 },
            { "playerId": 2, "deckId": 11 }
          ]
        }
        """.formatted(date.toString());

        // WHEN + THEN
        mockMvc.perform(post("/api/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameId").value(2))
                .andExpect(jsonPath("$.notes").doesNotExist())
                .andExpect(jsonPath("$.players.length()").value(2));

        verify(gameService).createGame(any(CreateGameDTO.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteGame_returnsNoContent() throws Exception {

        mockMvc.perform(delete("/api/games")
                        .param("id", "42"))
                .andExpect(status().isNoContent());

        verify(gameService).deleteGameById(42);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateGame_returnsNoContent() throws Exception {

        String json = """
        {
          "date": "2025-05-05",
          "notes": "Updated game",
          "participants": [
            {
              "playerId": 10,
              "deckId": 20,
              "isWinner": true
            }
          ]
        }
        """;

        mockMvc.perform(put("/api/games/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNoContent());

        verify(gameService).updateGame(eq(1), any(GameEditDTO.class));
    }

}