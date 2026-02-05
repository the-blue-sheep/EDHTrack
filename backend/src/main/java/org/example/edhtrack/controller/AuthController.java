package org.example.edhtrack.controller;

import org.example.edhtrack.dto.login.ChangePasswordRequest;
import org.example.edhtrack.dto.login.LoginRequest;
import org.example.edhtrack.dto.login.LoginResponse;
import org.example.edhtrack.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        try {
            LoginResponse resp = authService.login(req);
            return ResponseEntity.ok(resp);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
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
