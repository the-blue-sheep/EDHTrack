package org.example.edhtrack.controller;

import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
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
    public CreateGameResponseDTO createGame(@RequestBody CreateGameDTO dto) {
        return gameService.createGame(dto);
    }
}
