package org.example.edhtrack.dto.game;

import org.example.edhtrack.dto.GameParticipantOverviewDTO;

import java.time.LocalDate;
import java.util.List;

public record GameOverviewDTO(
        int gameId,
        LocalDate date,
        String notes,
        List<GameParticipantOverviewDTO> participants
) {}