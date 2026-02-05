package org.example.edhtrack.dto.login;

import org.example.edhtrack.Utils;

public record LoginResponse(
        String token,
        String username,
        Utils.Role role,
        Integer playerId
) {}
