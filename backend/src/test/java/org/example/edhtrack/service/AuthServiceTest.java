package org.example.edhtrack.service;

import org.example.edhtrack.Utils;
import org.example.edhtrack.dto.login.LoginRequest;
import org.example.edhtrack.dto.login.LoginResponse;
import org.example.edhtrack.entity.Player;
import org.example.edhtrack.entity.User;
import org.example.edhtrack.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    @WithMockUser(roles = "USER")
    void login_withValidCredentials_returnsLoginResponse() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("encodedPassword");
        user.setRole(Utils.Role.USER);
        user.setPlayer(new Player("alice"));

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret", "encodedPassword")).thenReturn(true);

        LoginRequest request = new LoginRequest("alice", "secret");
        LoginResponse response = authService.login(request);

        assertEquals("alice", response.username());
        assertEquals(Utils.Role.USER, response.role());
        assertEquals(0, response.playerId());
    }

    @Test
    @WithMockUser(roles = "USER")
    void login_withInvalidUsername_throwsException() {
        when(userRepository.findByUsername("bob")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest("bob", "secret");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(request));

        assertEquals("401 UNAUTHORIZED \"Invalid credentials\"", ex.getMessage());
    }

    @Test
    @WithMockUser(roles = "USER")
    void login_withInvalidPassword_throwsException() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encodedPassword")).thenReturn(false);

        LoginRequest request = new LoginRequest("alice", "wrong");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(request));

        assertEquals("401 UNAUTHORIZED \"Invalid credentials\"", ex.getMessage());
    }

    @Test
    void changePassword_withCorrectOldPassword_updatesPassword() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("encodedOld");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old123", "encodedOld")).thenReturn(true);
        when(passwordEncoder.encode("new456")).thenReturn("encodedNew");

        authService.changePassword("alice", "old123", "new456");

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        assertEquals("encodedNew", captor.getValue().getPassword());
    }

    @Test
    void changePassword_withWrongOldPassword_throwsException() {
        User user = new User();
        user.setUsername("alice");
        user.setPassword("encodedOld");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongOld", "encodedOld")).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.changePassword("alice", "wrongOld", "new123"));

        assertEquals("Current password incorrect", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_withUnknownUser_throwsException() {
        when(userRepository.findByUsername("bob")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.changePassword("bob", "old", "new"));

        assertEquals("User not found", ex.getMessage());
        verify(userRepository, never()).save(any());
    }
}
