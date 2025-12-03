package org.example.edhtrack.dto.game;


import org.example.edhtrack.dto.player.PlayerResultDTO;

import java.time.LocalDate;
import java.util.List;

public record CreateGameResponseDTO(
    int gameId,
    LocalDate date,
    List<PlayerResultDTO> players
) {}
