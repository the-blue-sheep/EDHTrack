package org.example.edhtrack.controller;

import org.example.edhtrack.dto.group.CreateGroupDTO;
import org.example.edhtrack.dto.group.PlayerGroupDTO;
import org.example.edhtrack.dto.group.UpdateGroupDTO;
import org.example.edhtrack.service.PlayerGroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    private final PlayerGroupService playerGroupService;

    public GroupController(PlayerGroupService playerGroupService) {
        this.playerGroupService = playerGroupService;
    }

    @GetMapping
    public List<PlayerGroupDTO> getAll() {
        return playerGroupService.getAll();
    }

    @PostMapping
    public PlayerGroupDTO create(@RequestBody CreateGroupDTO dto) {
        return playerGroupService.save(dto);
    }

    @PutMapping("/{id}")
    public void rename(
            @PathVariable int id,
            @RequestBody UpdateGroupDTO dto
    ) {
        playerGroupService.rename(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        System.out.println("Controller deleting group with id: " + id);
        playerGroupService.deleteById(id);
    }
}
