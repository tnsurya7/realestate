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

    @Bean
    public CommandLineRunner initDefaultAdmin() {
        return args -> {
            String adminEmail = "surya@gmail.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                log.info("Creating default Super Admin...");
                RegisterRequest request = new RegisterRequest();
                request.setName("Super Admin");
                request.setEmail(adminEmail);
                request.setPassword("Surya@777");
                request.setRole(Role.ADMIN);
                authService.register(request);
                log.info("Default Super Admin created successfully. [surya@gmail.com / Surya@777]");
            }
        };
    }
}
