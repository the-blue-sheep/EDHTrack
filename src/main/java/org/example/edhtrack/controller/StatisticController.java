package org.example.edhtrack.controller;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.stats.*;
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
        return statisticService.getWinRateByCommander(deckService.getDeckByCommanderName(commanderName));
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
    public WinrateAgainstAnotherPlayer  getWinRateAgainstAnotherPlayer(@RequestParam int playerId1, @RequestParam int playerId2) {
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
}
