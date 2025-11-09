package org.example.edhtrack.controller;

import org.example.edhtrack.dto.CreateGameDTO;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.GameParticipantService;
import org.example.edhtrack.service.GameService;
import org.example.edhtrack.service.PlayerService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final PlayerService playerService;
    private final DeckService deckService;
    private final GameService gameService;
    private final GameParticipantService gameParticipantService;

    public GameController(PlayerService playerService, DeckService deckService, GameService gameService, GameParticipantService gameParticipantService){
        this.playerService = playerService;
        this.deckService = deckService;
        this.gameService = gameService;
        this.gameParticipantService = gameParticipantService;
    }

    @PostMapping
    public Game createGame(@RequestBody CreateGameDTO dto) {
        return gameService.createGame(dto);
    }
}
