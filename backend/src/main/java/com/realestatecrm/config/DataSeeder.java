package com.realestatecrm.config;

import com.realestatecrm.dto.RegisterRequest;
import com.realestatecrm.model.Role;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final AuthService authService;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.password}")
    private String adminPassword;

    @org.springframework.beans.factory.annotation.Value("${app.admin.name}")
    private String adminName;

    @Bean
    public CommandLineRunner initDefaultAdmin() {
        return args -> {
            if (!userRepository.existsByEmail(adminEmail)) {
                log.info("Creating default Super Admin...");
                RegisterRequest request = new RegisterRequest();
                request.setName(adminName);
                request.setEmail(adminEmail);
                request.setPassword(adminPassword);
                request.setRole(Role.ADMIN);
                authService.register(request);
                log.info("Default Super Admin created successfully. [" + adminEmail + "]");
            }
        };
    }
}
