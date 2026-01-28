package org.example.edhtrack.dto.game;

import org.example.edhtrack.dto.GameParticipantDTO;

import java.time.LocalDate;
import java.util.List;

public record GameEditDTO(
        LocalDate date,
        String notes,
        List<GameParticipantDTO> participants,
        int groupId
) {}
