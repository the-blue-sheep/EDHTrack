package org.example.edhtrack.controller;

import org.example.edhtrack.dto.deck.DeckDTO;
import org.example.edhtrack.dto.player.PlayerCreateDTO;
import org.example.edhtrack.dto.player.PlayerResponseDTO;
import org.example.edhtrack.dto.player.PlayerSetRetiredDTO;
import org.example.edhtrack.dto.player.PlayerUpdateDTO;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.PlayerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService playerService;
    private final DeckService deckService;


    public PlayerController(PlayerService playerService, DeckService deckService) {
        this.playerService = playerService;
        this.deckService = deckService;
    }

    @GetMapping
    public List<PlayerResponseDTO> findAll() {
        return playerService.getAllPlayers();
    }

    @PostMapping
    public PlayerResponseDTO createPlayer(@RequestBody PlayerCreateDTO dto) {
        return playerService.createPlayer(dto);
    }

    @PostMapping("/update")
    public PlayerResponseDTO updatePlayerName(@RequestBody PlayerUpdateDTO dto) {
        return playerService.updatePlayer(dto);
    }

    @PostMapping("/retire")
    public PlayerResponseDTO setIsRetiredPlayer(@RequestBody PlayerSetRetiredDTO dto) {
        return playerService.setIsRetiredPlayer(dto);
    }

    @GetMapping("/{id}/decks")
    public Set<DeckDTO> findDecks(@PathVariable int id) {
        return deckService.getDecksByPlayerId(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlayer(@PathVariable int id) {
        playerService.deletePlayer(id);
    }
}
