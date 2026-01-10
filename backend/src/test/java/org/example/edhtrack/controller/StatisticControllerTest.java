package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.PlayerDetailDTO;
import org.example.edhtrack.dto.player.PlayerGamesCountDTO;
import org.example.edhtrack.dto.player.TableSizeWinrateDTO;
import org.example.edhtrack.dto.player.TableSizeWinrateResponseDTO;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.PlayerService;
import org.example.edhtrack.service.StatisticService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StatisticControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StatisticService statisticService;

    @MockitoBean
    private PlayerService playerService;

    @MockitoBean
    private DeckService deckService;

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

    @Test
    void getAllCommanderWinrates_returnsWinrateList() throws Exception {
        when(statisticService.getWinRatesForAllCommanders(1))
                .thenReturn(List.of(
                        new CommanderWinRateDTO("Atraxa", 10, 6, 0.6)
                ));

        mockMvc.perform(get("/api/stats/commander-winrates")
                        .param("minGames", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].commanderName").value("Atraxa"))
                .andExpect(jsonPath("$[0].totalGames").value(10))
                .andExpect(jsonPath("$[0].wins").value(6))
                .andExpect(jsonPath("$[0].winRate").value(0.6));
    }

    @Test
    void getPlayerGameCounts_returnsNumberOfGames() throws Exception {
        when(statisticService.getPlayerGamesCount(false))
                .thenReturn(List.of(
                        new PlayerGamesCountDTO(1, "Hans", false, 100)
                ));

        mockMvc.perform(get("/api/stats/players/game-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].playerId").value(1))
                .andExpect(jsonPath("$[0].playerName").value("Hans"))
                .andExpect(jsonPath("$[0].isRetired").value(false))
                .andExpect(jsonPath("$[0].totalGames").value(100));
    }

    @Test
    void getPlayerDetail_returnsPlayerDetail() throws Exception {
        Player player = new Player();
        player.setId(1);
        player.setName("Hans");
        player.setRetired(false);

        when(playerService.getPlayerById(1)).thenReturn(player);
        when(statisticService.getPlayerDetail(player))
                .thenReturn(new PlayerDetailDTO(
                        1, "Hans", false, 100, 25, 0.25
                ));


        mockMvc.perform(get("/api/stats/players/1/detail"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.playerId").value(1))
                .andExpect(jsonPath("$.playerName").value("Hans"))
                .andExpect(jsonPath("$.isRetired").value(false))
                .andExpect(jsonPath("$.totalGames").value(100))
                .andExpect(jsonPath("$.wins").value(25))
                .andExpect(jsonPath("$.winRate").value(0.25));
    }

    @Test
    void getTopPlayedDecks_returnsTopPlayedDecks() throws Exception {
        Player player = new Player();
        player.setId(1);
        player.setName("Hans");
        player.setRetired(false);


        DeckStatDTO deck1 = new DeckStatDTO(1, "Atraxa", 100, 25, 0.25, false);
        DeckStatDTO deck2 = new DeckStatDTO(2, "Edgar", 10, 5, 0.50, false);
        DeckStatDTO deck3 = new DeckStatDTO(3, "Y'shtola", 50, 25, 0.50, false);

        when(playerService.getPlayerById(1)).thenReturn(player);
        when(statisticService.getTopPlayedDecks(player, 3, 3))
                .thenReturn(List.of(deck1, deck2, deck3));

        mockMvc.perform(get("/api/stats/players/1/top-played-decks")
                        .param("minGames", "3")
                        .param("limit", "3"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].deckId").value(1))
                .andExpect(jsonPath("$[0].deckName").value("Atraxa"))
                .andExpect(jsonPath("$[0].totalGames").value(100))
                .andExpect(jsonPath("$[0].wins").value(25))
                .andExpect(jsonPath("$[0].winRate").value(0.25))
                .andExpect(jsonPath("$[1].deckId").value(2))
                .andExpect(jsonPath("$[1].deckName").value("Edgar"))
                .andExpect(jsonPath("$[1].totalGames").value(10))
                .andExpect(jsonPath("$[1].wins").value(5))
                .andExpect(jsonPath("$[1].winRate").value(0.5))
                .andExpect(jsonPath("$[2].deckId").value(3))
                .andExpect(jsonPath("$[2].deckName").value("Y'shtola"))
                .andExpect(jsonPath("$[2].totalGames").value(50))
                .andExpect(jsonPath("$[2].wins").value(25))
                .andExpect(jsonPath("$[2].winRate").value(0.50));
    }

    @Test
    void getTopSuccessfulDecks_returnsNumberOfDecks() throws Exception {
        Player player = new Player();
        player.setId(1);
        player.setName("Hans");
        player.setRetired(false);


        DeckStatDTO deck1 = new DeckStatDTO(1, "Atraxa", 100, 25, 0.25, false);
        DeckStatDTO deck2 = new DeckStatDTO(2, "Edgar", 10, 5, 0.50, false);
        DeckStatDTO deck3 = new DeckStatDTO(3, "Y'shtola", 50, 25, 0.50, false);

        when(playerService.getPlayerById(1)).thenReturn(player);
        when(statisticService.getTopSuccessfulDecks(player, 3, 3))
                .thenReturn(List.of(deck1, deck2, deck3));

        mockMvc.perform(get("/api/stats/players/1/top-successful-decks")
                        .param("minGames", "3")
                        .param("limit", "3"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].deckId").value(1))
                .andExpect(jsonPath("$[0].deckName").value("Atraxa"))
                .andExpect(jsonPath("$[0].totalGames").value(100))
                .andExpect(jsonPath("$[0].wins").value(25))
                .andExpect(jsonPath("$[0].winRate").value(0.25))
                .andExpect(jsonPath("$[1].deckId").value(2))
                .andExpect(jsonPath("$[1].deckName").value("Edgar"))
                .andExpect(jsonPath("$[1].totalGames").value(10))
                .andExpect(jsonPath("$[1].wins").value(5))
                .andExpect(jsonPath("$[1].winRate").value(0.5))
                .andExpect(jsonPath("$[2].deckId").value(3))
                .andExpect(jsonPath("$[2].deckName").value("Y'shtola"))
                .andExpect(jsonPath("$[2].totalGames").value(50))
                .andExpect(jsonPath("$[2].wins").value(25))
                .andExpect(jsonPath("$[2].winRate").value(0.50));
    }

    @Test
    void testGetTableSizeWinRateByPlayer() throws Exception {
        Player player = new Player();
        player.setId(1);
        player.setName("Alice");
        TableSizeWinrateDTO dto3 = new TableSizeWinrateDTO(3, 10, 5, 0.5);
        TableSizeWinrateDTO dto4 = new TableSizeWinrateDTO(4, 20, 12, 0.6);
        TableSizeWinrateResponseDTO responseDTO =
                new TableSizeWinrateResponseDTO(1, "Alice", List.of(dto3, dto4));

        when(playerService.getPlayerById(1)).thenReturn(player);
        when(statisticService.getTableSizeWinRateByPlayer(player)).thenReturn(responseDTO);

        mockMvc.perform(get("/api/stats/players/1/table-size-winrate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").value(1))
                .andExpect(jsonPath("$.playerName").value("Alice"))
                .andExpect(jsonPath("$.stats[0].tableSize").value(3))
                .andExpect(jsonPath("$.stats[1].tableSize").value(4));
    }

    @Test
    void getWinrateOverTime_shouldReturnWinrateData() throws Exception {
        // GIVEN
        int playerId = 1;
        int deckId = 10;
        int stepSize = 5;

        Player player = new Player();
        player.setId(playerId);
        player.setName("Alice");

        Deck deck = new Deck();
        deck.setDeckId(deckId);
        deck.setDeckName("Atraxa");

        List<WinratePointDTO> points = List.of(
                new WinratePointDTO(5, 2, 0.4),
                new WinratePointDTO(10, 5, 0.5)
        );

        WinrateOverTimeDTO expectedDto = new WinrateOverTimeDTO(
                playerId,
                deckId,
                stepSize,
                points
        );

        when(playerService.getPlayerById(playerId)).thenReturn(player);
        when(deckService.getDeckById(deckId)).thenReturn(deck);
        when(statisticService.getWinrateOverTime(player, deck, stepSize))
                .thenReturn(expectedDto);

        // WHEN & THEN
        mockMvc.perform(
                        get("/api/stats/players/{playerId}/decks/{deckId}/winrate-over-time",
                                playerId, deckId)
                                .param("stepSize", String.valueOf(stepSize))
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").value(playerId))
                .andExpect(jsonPath("$.deckId").value(deckId))
                .andExpect(jsonPath("$.stepSize").value(stepSize))
                .andExpect(jsonPath("$.points").isArray())
                .andExpect(jsonPath("$.points.length()").value(2))
                .andExpect(jsonPath("$.points[0].gamesPlayed").value(5))
                .andExpect(jsonPath("$.points[0].wins").value(2))
                .andExpect(jsonPath("$.points[0].winrate").value(0.4));
    }

}
