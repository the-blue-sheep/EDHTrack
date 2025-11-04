package org.example.edhtrack.service;

import org.example.edhtrack.dto.PlayerCreateDTO;
import org.example.edhtrack.dto.PlayerResponseDTO;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public PlayerResponseDTO createPlayer(PlayerCreateDTO dto) {
        Player player = new Player(dto.getName());
        Player saved = playerRepository.save(player);
        return new PlayerResponseDTO(saved.getId(), saved.getName());
    }

    public List<PlayerResponseDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(p -> new PlayerResponseDTO(p.getId(), p.getName()))
                .collect(Collectors.toList());
    }

    public void deletePlayer(int id) {
        playerRepository.deleteById(id);
    }
}
