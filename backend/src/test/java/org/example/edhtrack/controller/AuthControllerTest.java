package org.example.edhtrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.edhtrack.dto.login.ChangePasswordRequest;
import org.example.edhtrack.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import(AuthControllerTest.TestSecurityConfig.class)
class AuthControllerTest {

    @TestConfiguration
    static class TestSecurityConfig {

        @Bean
        SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;


//    @Test
//    void login_returnsLoginResponse() throws Exception {
//        LoginRequest request = new LoginRequest("alice", "secret");
//
//        LoginResponse response = new LoginResponse(
//                "alice",
//                user.getUsername(), Utils.Role.USER,
//                42
//        );
//
//        when(authService.login(any(LoginRequest.class)))
//                .thenReturn(response);
//
//        mockMvc.perform(post("/api/auth/login")
//                        .contentType("application/json")
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.username").value("alice"))
//                .andExpect(jsonPath("$.role").value("USER"))
//                .andExpect(jsonPath("$.playerId").value(42));
//
//        verify(authService).login(any(LoginRequest.class));
//    }

    @Test
    @WithMockUser(username = "alice")
    void changePassword_callsServiceWithPrincipal() throws Exception {
        ChangePasswordRequest request =
                new ChangePasswordRequest("old123", "new456");

        mockMvc.perform(post("/api/auth/change-password")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        verify(authService).changePassword(
                "alice",
                "old123",
                "new456"
        );
    }
}
