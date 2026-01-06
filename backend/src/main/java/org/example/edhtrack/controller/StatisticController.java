package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.PlayerDetailDTO;
import org.example.edhtrack.dto.player.PlayerGamesCountDTO;
import org.example.edhtrack.dto.player.PlayerVsPlayerDTO;
import org.example.edhtrack.dto.stats.*;
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
    public StreakDTO getStreak(@RequestParam int playerId){
        return statisticService.getStreaksByPlayer(playerService.getPlayerById(playerId));
    }

    @GetMapping("/commander-winrate")
    public CommanderWinRateDTO getCommanderWinRate(@RequestParam String commanderName){
        return statisticService.getWinRateByCommander(commanderName);
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
    public WinrateByPlayerDTO getWinRateByPlayer(@RequestParam int playerId) {
        return statisticService.getWinRateByPlayer(playerService.getPlayerById(playerId));
    }

    @GetMapping("/player-vs-player-stat")
    public PlayerVsPlayerDTO getWinRateAgainstAnotherPlayer(@RequestParam int playerId1, @RequestParam int playerId2) {
        return statisticService.getWinRateAgainstOtherPlayer(playerService.getPlayerById(playerId1), playerService.getPlayerById(playerId2));
    }

    @GetMapping("/winrate-by-player")
    public WinrateByPlayerDTO getWinrateByPlayer(@RequestParam int playerId){
        return statisticService.getWinRateByPlayer(playerService.getPlayerById(playerId));
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntryDTO> getLeaderboard(
            @RequestParam Utils.DeterminedType type,
            @RequestParam(defaultValue = "0") int minGames,
            @RequestParam(defaultValue = "false") boolean hideRetiredPlayers,
            @RequestParam(defaultValue = "false") boolean hideRetiredDecks
    ){
        return statisticService.getLeaderboard(type, minGames, hideRetiredPlayers, hideRetiredDecks);
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
            @RequestParam(defaultValue = "6") int limit
    ) {
        Player player = playerService.getPlayerById(id);
        return statisticService.getTopPlayedDecks(player, limit);
    }

    @GetMapping("/players/{id}/top-successful-decks")
    public List<DeckStatDTO> getTopSuccessfulDecks(
            @PathVariable int id,
            @RequestParam(defaultValue = "6") int limit
    ) {
        Player player = playerService.getPlayerById(id);
        return statisticService.getTopSuccessfulDecks(player, limit);
    }

}
