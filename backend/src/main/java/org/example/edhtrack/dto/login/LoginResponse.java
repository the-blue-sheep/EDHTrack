package org.example.edhtrack.dto.login;

import org.example.edhtrack.Utils;

public record LoginResponse(
        String username,
        String userUsername, Utils.Role role,
        Integer playerId
) {}

