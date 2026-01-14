package org.example.edhtrack.dto.login;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword
) {}

