package com.realestatecrm.dto;

import com.realestatecrm.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String type;
    private Long userId;
    private String name;
    private String email;
    private Role role;

    public static LoginResponse of(String token, Long userId, String name, String email, Role role) {
        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(userId)
                .name(name)
                .email(email)
                .role(role)
                .build();
    }
}
