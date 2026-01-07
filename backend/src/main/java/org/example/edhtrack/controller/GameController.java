package org.example.edhtrack.controller;

import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameEditDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping
    public Page<GameOverviewDTO> getGames(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return gameService.getGames(page, size);
    }

    @GetMapping("/{id}")
    public GameOverviewDTO getGameById(
            @PathVariable int id
    ) {
        return gameService.getGameById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateGame(
            @PathVariable int id,
            @RequestBody GameEditDTO dto
    ) {
        gameService.updateGame(id, dto);
    }

    @PostMapping
    public CreateGameResponseDTO createGame(@RequestBody CreateGameDTO dto) {
        return gameService.createGame(dto);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGame(@RequestParam int id) {
        gameService.deleteGameById(id);
    }
}
