package org.example.edhtrack.controller;

import org.example.edhtrack.dto.CreateGameDTO;
import org.example.edhtrack.entity.Game;
import org.example.edhtrack.service.GameService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @PostMapping
    public Game createGame(@RequestBody CreateGameDTO dto) {
        return gameService.createGame(dto);
    }
}
