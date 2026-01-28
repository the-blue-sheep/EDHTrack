package org.example.edhtrack.service;

import org.example.edhtrack.dto.group.CreateGroupDTO;
import org.example.edhtrack.dto.group.PlayerGroupDTO;
import org.example.edhtrack.dto.group.UpdateGroupDTO;
import org.example.edhtrack.entity.PlayerGroup;
import org.example.edhtrack.repository.PlayerGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerGroupService {
    private final PlayerGroupRepository playerGroupRepository;

    public PlayerGroupService(PlayerGroupRepository playerGroupRepository) {
        this.playerGroupRepository = playerGroupRepository;
    }

    public List<PlayerGroupDTO> getAll() {
        return playerGroupRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public PlayerGroupDTO save(CreateGroupDTO dto) {
        PlayerGroup group = new PlayerGroup();
        group.setName(dto.name());
        group.setIsDefault(false);

        PlayerGroup saved = playerGroupRepository.save(group);

        return mapToDTO(saved);
    }

    public void rename(int id, UpdateGroupDTO dto) {

        PlayerGroup group = playerGroupRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Group not found: " + id)
                );

        group.setName(dto.name());

    }

    private PlayerGroupDTO mapToDTO(PlayerGroup group) {
        return new PlayerGroupDTO(
                group.getGroupId(),
                group.getName(),
                group.isDefault()
        );
    }

    public void deleteById(int id) {
        System.out.println("Deleting player group with id: " + id);

        PlayerGroup group = playerGroupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        if (group.isDefault()) {
            throw new IllegalStateException("Default group cannot be deleted");
        }

        playerGroupRepository.delete(group);
    }
}
