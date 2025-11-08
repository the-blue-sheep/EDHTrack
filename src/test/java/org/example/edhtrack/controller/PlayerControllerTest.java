package org.example.edhtrack.controller;

import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.PlayerRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlayerRepository playerRepository;


    @Test
    void getAllPlayers_shouldReturnListOfOnePlayer_whenCalled()  throws Exception {
        //GIVEN
        when(playerRepository.findAll()).thenReturn(List.of(new Player("Günther")));
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/players"))
        //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
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
    void addPlayer_shouldAddPlayer_whenCalled() throws Exception {
        //GIVEN
        Player savedPlayer = new Player("Harald");
        savedPlayer.setPlayerId(1);
        when(playerRepository.save(any(Player.class))).thenReturn(savedPlayer);
        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/players")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                              "name": "Harald"
                        }
                        """))
        //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                        {
                          "id": 1,
                          "name": "Harald"
                        }
                        
                        """
                ))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty());
    }
}