package org.example.edhtrack.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class StatisticControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getLeaderboard_shouldReturnOkAndJson() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/statistics/leaderboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").exists());
    }
}
