package org.example.edhtrack.dto.game;

import org.example.edhtrack.dto.GameParticipantDTO;

import java.time.LocalDate;
import java.util.List;

public record CreateGameDTO(LocalDate date, int winnerId, String notes, List<GameParticipantDTO> participants) {}
