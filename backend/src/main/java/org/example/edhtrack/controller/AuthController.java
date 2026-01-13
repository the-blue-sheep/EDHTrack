package org.example.edhtrack.controller;

import org.example.edhtrack.dto.login.ChangePasswordRequest;
import org.example.edhtrack.dto.login.LoginRequest;
import org.example.edhtrack.dto.login.LoginResponse;
import org.example.edhtrack.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/change-password")
    public void changePassword(
            @RequestBody ChangePasswordRequest req,
            Principal principal
    ) {
        authService.changePassword(
                principal.getName(),
                req.oldPassword(),
                req.newPassword()
        );
    }

}
