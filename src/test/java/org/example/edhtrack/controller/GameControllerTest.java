package org.example.edhtrack.controller;

import org.example.edhtrack.dto.CreateGameDTO;
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
        deckAlice.setCommanders(List.of(commanderAlice));
        deckAlice.setPlayer(alice);

        Deck deckBob = new Deck();
        deckBob.setDeckId(11);
        Commander commanderBob = new Commander();
        commanderBob.setName("Krenko");
        deckBob.setCommanders(List.of(commanderBob));
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

        Game response = new Game();
        response.setDate(date);
        response.setId(2);
        response.setNotes("First Turn Sol Ring wins");
        response.setPlayers(participants);

        when(gameService.createGame(any(CreateGameDTO.class)))
                .thenReturn(response);

        String requestJson = """
        {
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
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.notes").value("First Turn Sol Ring wins"))
                .andExpect(jsonPath("$.players.length()").value(2));

        verify(gameService).createGame(any(CreateGameDTO.class));
    }

}