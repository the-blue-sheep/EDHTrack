package org.example.edhtrack.controller;

import org.example.edhtrack.dto.PlayerCreateDTO;
import org.example.edhtrack.dto.PlayerResponseDTO;
import org.example.edhtrack.service.PlayerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService playerService;


    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @PostMapping
    public PlayerResponseDTO createPlayer(@RequestBody PlayerCreateDTO dto) {
        return playerService.createPlayer(dto);
    }

    @GetMapping
    public List<PlayerResponseDTO> findAll() {
        return playerService.getAllPlayers();
    }

    @DeleteMapping("/{id}")
    public void deletePlayer(@PathVariable int id) {
        playerService.deletePlayer(id);
    }
}


