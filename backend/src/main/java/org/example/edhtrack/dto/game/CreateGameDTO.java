package org.example.edhtrack.dto.game;

import org.example.edhtrack.dto.GameParticipantDTO;

import java.time.LocalDate;
import java.util.List;

public record CreateGameDTO(
        LocalDate date,
        String notes,
        List<GameParticipantDTO> participants,
        Integer groupId,
        int firstKillTurn,
        int lastTurn
) {}
