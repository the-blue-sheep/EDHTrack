package org.example.edhtrack.controller;

import org.example.edhtrack.dto.player.PlayerCreateDTO;
import org.example.edhtrack.dto.player.PlayerResponseDTO;
import org.example.edhtrack.entity.Deck;
import org.example.edhtrack.service.DeckService;
import org.example.edhtrack.service.PlayerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService playerService;
    private final DeckService deckService;


    public PlayerController(PlayerService playerService, DeckService deckService) {
        this.playerService = playerService;
        this.deckService = deckService;
    }

    @PostMapping
    public PlayerResponseDTO createPlayer(@RequestBody PlayerCreateDTO dto) {
        return playerService.createPlayer(dto);
    }

    @PostMapping("/update")
    public PlayerResponseDTO updatePlayer(@RequestBody PlayerCreateDTO dto) {
        return playerService.updatePlayer(dto);
    }

    @PostMapping("/retire")
    public PlayerResponseDTO setIsRetiredPlayer(@RequestBody PlayerCreateDTO dto,  boolean isRetired) {
        return playerService.setIsRetiredPlayer(dto, isRetired);
    }

    @GetMapping
    public List<PlayerResponseDTO> findAll() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/{id}/decks")
    public List<Deck> findDecks(@PathVariable int id) {
        return deckService.getDecksByPlayerId(id);
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable int id) {
        playerService.deletePlayer(id);
    }
}
