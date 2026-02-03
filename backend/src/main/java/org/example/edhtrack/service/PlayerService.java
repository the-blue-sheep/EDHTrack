package org.example.edhtrack.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.edhtrack.dto.player.*;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.entity.User;
import org.example.edhtrack.repository.PlayerRepository;
import org.example.edhtrack.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final UserRepository userRepository;

    public PlayerService(PlayerRepository playerRepository,
                         UserRepository userRepository) {
        this.playerRepository = playerRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    private void checkOwnershipOrAdmin(Player player) {
        User current = getCurrentUser();
        if (current.getRole() == null) {
            throw new AccessDeniedException("Role not set");
        }

        if (current.getRole().name().equals("ADMIN") || current.getRole().name().equals("SUPERUSER")) {
            return;
        }

        if (current.getPlayer() == null || current.getPlayer().getId() != player.getId()) {
            throw new AccessDeniedException("You can only modify your own player");
        }
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
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Player not found: " + id));

        checkOwnershipOrAdmin(player);
        playerRepository.delete(player);
    }

    public PlayerResponseDTO updatePlayer(PlayerUpdateDTO dto) {
        Player player = playerRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Player not found: " + dto.id()));

        checkOwnershipOrAdmin(player);

        player.setName(dto.newName());
        Player saved = playerRepository.save(player);

        return new PlayerResponseDTO(saved.getId(), saved.getName(), saved.isRetired());
    }

    public Player getPlayerById(int playerId) {
        return playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found: " + playerId));
    }

    public PlayerResponseDTO setIsRetiredPlayer(PlayerSetRetiredDTO dto) {
        Player player = playerRepository.findById(dto.id())
                .orElseThrow(() -> new EntityNotFoundException("Player not found: " + dto.id()));

        checkOwnershipOrAdmin(player);

        player.setRetired(dto.isRetired());
        Player saved = playerRepository.save(player);

        return new PlayerResponseDTO(saved.getId(), saved.getName(), saved.isRetired());
    }
}
