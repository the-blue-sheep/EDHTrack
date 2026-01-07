package org.example.edhtrack.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.player.*;
import org.example.edhtrack.entity.GameParticipant;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.repository.GameParticipantRepository;
import org.example.edhtrack.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final GameParticipantRepository gameParticipantRepository;

    public PlayerService(PlayerRepository playerRepository, GameParticipantRepository gameParticipantRepository) {
        this.playerRepository = playerRepository;
        this.gameParticipantRepository = gameParticipantRepository;
    }

    public PlayerResponseDTO createPlayer(PlayerCreateDTO dto) {
        Player player = new Player(dto.getName());
        Player saved = playerRepository.save(player);
        return new PlayerResponseDTO(saved.getId(), saved.getName(), saved.isRetired());
    }

    public List<PlayerResponseDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(p -> new PlayerResponseDTO(p.getId(), p.getName(), p.isRetired()))
                .collect(Collectors.toList());
    }

    public void deletePlayer(int id) {
        playerRepository.deleteById(id);
    }

    public PlayerResponseDTO updatePlayer(PlayerUpdateDTO dto) {
        Player player = playerRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Id not found: " + dto.id()));
        player.setName(dto.newName());

        Player saved = playerRepository.save(player);
        return new PlayerResponseDTO(saved.getId(), saved.getName(), saved.isRetired());
    }

    public Player getPlayerById(int playerId) {
        return  playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Id not found: " + playerId));
    }

    public PlayerResponseDTO setIsRetiredPlayer(PlayerSetRetiredDTO dto) {

        Player player = playerRepository.findById(dto.id())
                .orElseThrow(() ->
                        new EntityNotFoundException("Player not found: " + dto.id())
                );

        player.setRetired(dto.isRetired());

        Player saved = playerRepository.save(player);

        return new PlayerResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.isRetired()
        );
    }

}
