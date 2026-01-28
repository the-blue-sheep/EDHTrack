package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.player.PlayerCreateDTO;
import org.example.edhtrack.dto.player.PlayerResponseDTO;
import org.example.edhtrack.dto.player.PlayerSetRetiredDTO;
import org.example.edhtrack.dto.player.PlayerUpdateDTO;
import org.example.edhtrack.repository.PlayerRepository;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.PlayerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlayerRepository playerRepository;
    @MockitoBean
    private PlayerService playerService;
    @MockitoBean
    private DeckService deckService;

    @Test
    void getAllPlayers_shouldReturnListOfOnePlayer_whenCalled()  throws Exception {
        //GIVEN
        PlayerResponseDTO response = new PlayerResponseDTO(0, "Günther", false);
        when(playerService.getAllPlayers()).thenReturn(List.of(response));
        //WHEN
        mockMvc.perform(get("/api/players"))
        //THEN
                .andExpect(status().isOk())
                .andExpect(content().json(
                        """
                        [
                            {
                              "id": 0,
                              "name": "Günther"
                            }
                        ]
                        """
                ));
    }

    @Test
    void createPlayer_shouldCreatePlayer_whenCalled() throws Exception {
        // GIVEN
        PlayerResponseDTO response = new PlayerResponseDTO(1, "Harald", false);

        when(playerService.createPlayer(any(PlayerCreateDTO.class)))
                .thenReturn(response);

        // WHEN / THEN
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "name": "Harald"
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                    {
                      "id": 1,
                      "name": "Harald"
                    }
                    """))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Harald"));
    }


    @Test
    void updatePlayer_shouldUpdatePlayerName_andReturnChangedName() throws Exception {
        PlayerUpdateDTO dto = new PlayerUpdateDTO(1, "Harlad", true);
        PlayerResponseDTO response = new PlayerResponseDTO(1, "Harald", false);

        when(playerService.updatePlayer(any(PlayerUpdateDTO.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/players/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                      {
                      "id": 1,
                      "newName": "Harald"
                      }
                    """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Harald"));
        }

    @Test
    void retirePlayer_shouldChangeRetiredStatus() throws Exception {
        PlayerResponseDTO response = new PlayerResponseDTO(1, "Stephen", true);

        when(playerService.setIsRetiredPlayer(any(PlayerSetRetiredDTO.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/players/retire")
                .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                "id": 1,
                                "name": "Stephen",
                                "isRetired": true
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Stephen"))
                .andExpect(jsonPath("$.isRetired").value(true));
    }

    @Test
    void deletePlayer_shouldDeletePlayer() throws Exception {
        //GIVEN
        int playerId = 14;

        //WHEN + THEN
        mockMvc.perform(delete("/api/players/{id}", playerId))
                .andExpect(status().isNoContent());

        verify(playerService).deletePlayer(playerId);
    }

    @Test
    void findDecks_shouldReturnListOfDecks_whenCalled() throws Exception {
        int playerId = 10;

        DeckDTO atraxa = new DeckDTO(1, Set.of("Atraxa, Praetor's Voice"), "Atraxa Superfriends", "WUBG", Utils.Bracket.BRACKET1, false );

        DeckDTO krenko = new DeckDTO(2, Set.of("Krenko, Mob Boss"), "krenko Goblinhorde", "R", Utils.Bracket.BRACKET1, false );

        Set<DeckDTO> decks = Set.of(
                atraxa,
                krenko
        );

        // Mocking Service
        when(deckService.getDecksByPlayerId(playerId)).thenReturn(decks);

        mockMvc.perform(get("/api/players/{id}/decks", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].deckId", containsInAnyOrder(1, 2)))
                .andExpect(jsonPath("$[*].commanders[*]", hasItem("Atraxa, Praetor's Voice")))
                .andExpect(jsonPath("$[*].colors", hasItem("WUBG")));

        verify(deckService).getDecksByPlayerId(playerId);

    }
}