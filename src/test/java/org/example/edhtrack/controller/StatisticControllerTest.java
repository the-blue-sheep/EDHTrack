package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.stats.LeaderboardEntryDTO;
import org.example.edhtrack.service.StatisticService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StatisticControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StatisticService statisticService;

    @Test
    void getLeaderboard_shouldReturnOkAndJson() throws Exception {
        // GIVEN
        List<LeaderboardEntryDTO> mockList = List.of(
                new LeaderboardEntryDTO("Alice", 10, 6, 0.6)
        );

        when(statisticService.getLeaderboard(Utils.DeterminedType.PLAYER, 0, false, false))
                .thenReturn(mockList);

        // WHEN + THEN
        mockMvc.perform(get("/api/stats/leaderboard")
                        .param("type", "PLAYER"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playerName").value("Alice"))
                .andExpect(jsonPath("$[0].totalGames").value(10))
                .andExpect(jsonPath("$[0].wins").value(6))
                .andExpect(jsonPath("$[0].winRate").value(0.6));
    }

}
