package org.example.edhtrack.controller;

import org.example.edhtrack.dto.game.CreateGameDTO;
import org.example.edhtrack.dto.game.CreateGameResponseDTO;
import org.example.edhtrack.dto.game.GameEditDTO;
import org.example.edhtrack.dto.game.GameOverviewDTO;
import org.example.edhtrack.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
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
            @RequestParam(defaultValue = "10") int size,
            //int kann kein "nicht gesetzt" Darstellen wenn selectedPlayerId undefined ist
            @RequestParam(required = false) Integer playerId,
            @RequestParam(required = false) String commander,
            @RequestParam(required = false) String groupIds
    ) {

        if (playerId != null && playerId == 0) {
            playerId = null;
        }

        if (commander != null && commander.isBlank()) {
            commander = null;
        }

        if (groupIds != null && groupIds.isBlank()) {
            groupIds = null;
        }

        return gameService.getGames(page, size, playerId, commander, groupIds);
    }

    @GetMapping("/{id}")
    public GameOverviewDTO getGameById(
            @PathVariable int id
    ) {
        return gameService.getGameById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPERUSER','ADMIN')")
    public void updateGame(
            @PathVariable int id,
            @RequestBody GameEditDTO dto
    ) throws Exception {
        gameService.updateGame(id, dto);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPERUSER','ADMIN')")
    public CreateGameResponseDTO createGame(@RequestBody CreateGameDTO dto) {
        return gameService.createGame(dto);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('SUPERUSER','ADMIN')")
    public void deleteGame(@RequestParam int id) {
        gameService.deleteGameById(id);
    }
}
