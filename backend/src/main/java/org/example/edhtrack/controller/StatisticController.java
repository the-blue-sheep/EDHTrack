package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.*;
import org.example.edhtrack.dto.stats.*;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.PlayerService;
import org.example.edhtrack.service.StatisticService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatisticController {

    private final DeckService deckService;
    private final StatisticService statisticService;
    private final PlayerService playerService;

    public StatisticController(StatisticService statisticService, PlayerService playerService, DeckService deckService) {
        this.statisticService = statisticService;
        this.playerService = playerService;
        this.deckService = deckService;
    }

    @GetMapping("/streaks")
    public StreakDTO getStreak(
            @RequestParam int playerId,
            @RequestParam(required = false) String groupIds
    ){
        return statisticService.getStreaksByPlayer(playerService.getPlayerById(playerId), groupIds);
    }

    @GetMapping("/commander-winrate")
    public CommanderWinRateDTO getCommanderWinRate(
            @RequestParam String commanderName,
            @RequestParam int minGames,
            @RequestParam(required = false) String groupIds
    ){
        return statisticService.getWinRateByCommander(commanderName, minGames, groupIds);
    }

    @GetMapping("/color-winrate")
    public ColorStatDTO getWinrateByColor(@RequestParam String colorIdentity){
        return statisticService.getWinrateByColor(colorIdentity);
    }

    @GetMapping("/commander-stats")
    public CommanderStatDTO getCommanderStats(@RequestParam String commanderName){
        return statisticService.getCommanderStatsForAll(commanderName);
    }

    @GetMapping("/commander-amounts")
    public List<CommanderAmountStatDTO> getCommanderAmounts() {
        return deckService.getCommanderAmounts();
    }

    @GetMapping("/player-winrate")
    public WinrateByPlayerDTO getWinRateByPlayer(
            @RequestParam int playerId,
            @RequestParam(required = false) String groupIds
    ) {
        return statisticService.getWinRateByPlayer(playerService.getPlayerById(playerId), groupIds);
    }

    @GetMapping("/commander-winrates")
    public List<CommanderWinRateDTO> getAllCommanderWinrates(
            @RequestParam int minGames,
            @RequestParam(required = false, defaultValue = "1") String groupIds
    ) {
        return statisticService.getWinRatesForAllCommanders(minGames, groupIds);
    }

    @GetMapping("/player-vs-player-stat")
    public PlayerVsPlayerDTO getPlayerVsPlayerStat(
            @RequestParam int playerId1,
            @RequestParam int playerId2,
            @RequestParam(required = false, defaultValue = "3,4,5,6") String tableSizes
    ) {
        Player p1 = playerService.getPlayerById(playerId1);
        Player p2 = playerService.getPlayerById(playerId2);


        return statisticService.getPlayerVsPlayerStats(p1, p2, tableSizes);
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntryDTO> getLeaderboard(
            @RequestParam Utils.DeterminedType type,
            @RequestParam(defaultValue = "0") int minGames,
            @RequestParam(defaultValue = "false") boolean hideRetiredPlayers,
            @RequestParam(defaultValue = "false") boolean hideRetiredDecks,
            @RequestParam(required = false, defaultValue = "3,4,5,6") String tableSizes,
            @RequestParam(required = false, defaultValue = "1") String groupIds
    ){
        return statisticService.getLeaderboard(type, minGames, hideRetiredPlayers, hideRetiredDecks, tableSizes, groupIds);
    }

    @GetMapping("/players/game-count")
    public List<PlayerGamesCountDTO> getPlayerGameCounts(
            @RequestParam(defaultValue = "false") boolean hideRetired
    ) {
        return statisticService.getPlayerGamesCount(hideRetired);
    }

    @GetMapping("/players/{id}/detail")
    public PlayerDetailDTO getPlayerDetail(@PathVariable int id) {
        Player player = playerService.getPlayerById(id);
        return statisticService.getPlayerDetail(player);
    }

    @GetMapping("/players/{id}/top-played-decks")
    public List<DeckStatDTO> getTopPlayedDecks(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int minGames,
            @RequestParam(defaultValue = "6") int limit,
            @RequestParam(required = false) String groupIds

    ) {
        Player player = playerService.getPlayerById(id);
        return statisticService.getTopPlayedDecks(player, minGames, limit, groupIds);
    }

    @GetMapping("/players/{id}/top-successful-decks")
    public List<DeckStatDTO> getTopSuccessfulDecks(
            @PathVariable int id,
            @RequestParam(defaultValue = "0") int minGames,
            @RequestParam(defaultValue = "6") int limit,
            @RequestParam(required = false) String groupIds
    ) {
        Player player = playerService.getPlayerById(id);
        return statisticService.getTopSuccessfulDecks(player, minGames, limit, groupIds);
    }

    @GetMapping("/players/{id}/table-size-winrate")
    public TableSizeWinrateResponseDTO getTableSizeWinRateByPlayer(
            @PathVariable int id,
            @RequestParam(required = false) String groupIds
    ) {
        Player player = playerService.getPlayerById(id);
        return statisticService.getTableSizeWinRateByPlayer(player, groupIds);
    }

    @GetMapping("/players/{playerId}/decks/{deckId}/winrate-over-time")
    public WinrateOverTimeDTO getWinrateOverTime(
            @PathVariable int playerId,
            @PathVariable int deckId,
            @RequestParam(defaultValue = "3") int stepSize,
            @RequestParam(required = false) String groupIds
    ) {
        Player player = playerService.getPlayerById(playerId);
        Deck deck = deckService.getDeckById(deckId);

        return statisticService.getWinrateOverTime(player, deck, stepSize, groupIds);
    }
}
