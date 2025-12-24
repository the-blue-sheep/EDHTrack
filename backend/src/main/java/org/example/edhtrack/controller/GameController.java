package org.example.edhtrack.controller;

import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.service.GameService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping
    public List<GameOverviewDTO> getAllGames() {
        return gameService.getAllGames();
    }

    @PostMapping
    public CreateGameResponseDTO createGame(@RequestBody CreateGameDTO dto) {
        return gameService.createGame(dto);
    }
}
