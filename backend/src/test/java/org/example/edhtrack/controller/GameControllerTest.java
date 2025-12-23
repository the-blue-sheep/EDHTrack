package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import org.example.edhtrack.dto.GameParticipantOverviewDTO;
import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.dto.player.PlayerResultDTO;
import org.example.edhtrack.entity.*;
import org.example.edhtrack.service.GameService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class GameControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GameService gameService;

    @Test
    void getAllGames_returnsListOfGames() throws Exception {
        GameParticipantOverviewDTO p1 = new GameParticipantOverviewDTO(1, "Alice", 11, "Bribe Control", true);
        GameParticipantOverviewDTO p2 = new GameParticipantOverviewDTO(2, "Bob", 22, "Midrange", false);

        GameOverviewDTO game1 = new GameOverviewDTO(
                100,
                LocalDate.of(2025, 12, 1),
                "Fun game",
                List.of(p1, p2)
        );

        when(gameService.getAllGames()).thenReturn(List.of(game1));

        mockMvc.perform(get("/api/games")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].gameId").value(100))
                .andExpect(jsonPath("$[0].notes").value("Fun game"))
                .andExpect(jsonPath("$[0].participants[0].playerName").value("Alice"))
                .andExpect(jsonPath("$[0].participants[1].playerName").value("Bob"));
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
                playerResultDTOs
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

        // WHEN + THEN: Request an den Controller, Response prüfen
        mockMvc.perform(post("/api/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.gameId").value(2))
                .andExpect(jsonPath("$.notes").doesNotExist())
                .andExpect(jsonPath("$.players.length()").value(2));

        verify(gameService).createGame(any(CreateGameDTO.class));
    }

}