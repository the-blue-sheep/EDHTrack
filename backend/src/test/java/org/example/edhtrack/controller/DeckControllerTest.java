package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.deck.CreateDeckDTO;
import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.deck.RetireDeckDTO;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.StatisticService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


@SpringBootTest
@AutoConfigureMockMvc
class DeckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DeckService deckService;

    @MockitoBean
    StatisticService statisticService;

    @Test
    @WithMockUser(roles = "USER")
    void createDeck_shouldReturnDeck() throws Exception {

        DeckDTO response = new DeckDTO(1, Set.of("Keen"), "Hey Arnold!", "WUBR", Utils.Bracket.BRACKET2, false);

        //When
        when(deckService.createDeck(any(CreateDeckDTO.class)))
                .thenReturn(response);

        String requestJson = """
        {
          "playerId": 1,
          "commanders": ["Keen"],
          "deckName": "Hey Arnold!",
          "colors": "WUBR"
        }
        """;

        mockMvc.perform(post("/api/decks")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deckId").value(1))
                .andExpect(jsonPath("$.commanders").value("Keen"))
                .andExpect(jsonPath("$.deckName").value("Hey Arnold!"))
                .andExpect(jsonPath("$.colors").value("WUBR"))
                .andExpect(jsonPath("$.retired").value(false));

        verify(deckService).createDeck(any(CreateDeckDTO.class));

    }

    @Test
    @WithMockUser(roles = "USER")
    void setRetiredDeckStatus_shouldReturnDifferentRetiredStatus() throws Exception {
        DeckDTO response = new DeckDTO(1, Set.of("Keen"), "Hey Arnold!", "WUBR", Utils.Bracket.BRACKET2, true);

        when(deckService.setRetiredDeckStatus(any())).thenReturn(response);

        String requestJson = """
        {
          "deckId": 1,
          "retired": true
        }
        """;

        mockMvc.perform(post("/api/decks/retire")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deckId").value(1))
                .andExpect(jsonPath("$.retired").value(true));

        verify(deckService).setRetiredDeckStatus(any(RetireDeckDTO.class));
    }

    @Test
    @WithMockUser(roles = "USER")
    void updateDeck_shouldReturnUpdatedDeck() throws Exception {
        DeckDTO response = new DeckDTO(1, Set.of("Keen"), "Hey Arnold!", "WUBR", Utils.Bracket.BRACKET2, false);

        when(deckService.setRetiredDeckStatus(any())).thenReturn(response);

        String requestJson = """
        {
          "playerId": 1,
          "commanders": ["Keen"],
          "deckName": "Hey Arnold!",
          "colors": "WUBR",
          "retired": false
        }
        """;

        mockMvc.perform(post("/api/decks/retire")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deckId").value(1))
                .andExpect(jsonPath("$.commanders").value("Keen"))
                .andExpect(jsonPath("$.deckName").value("Hey Arnold!"))
                .andExpect(jsonPath("$.colors").value("WUBR"))
                .andExpect(jsonPath("$.retired").value(false));

        verify(deckService).setRetiredDeckStatus(any(RetireDeckDTO.class));
    }

    @Test
    void getAllCommanderNames_returnsListOfNames() throws Exception {
        when(deckService.getAllCommanderNames()).thenReturn(
                List.of("Atraxa", "Edgar", "Yuriko")
        );

        mockMvc.perform(get("/api/decks/commanders"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(3));
    }

}