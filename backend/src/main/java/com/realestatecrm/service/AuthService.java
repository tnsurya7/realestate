package com.realestatecrm.service;

import com.realestatecrm.dto.LoginRequest;
import com.realestatecrm.dto.LoginResponse;
import com.realestatecrm.dto.RegisterRequest;
import com.realestatecrm.dto.UserDto;
import com.realestatecrm.exception.BadRequestException;
import com.realestatecrm.model.User;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AccountLockedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Value("${app.security.max-failed-attempts}")
    private int maxFailedAttempts;

    @Value("${app.security.lock-duration-minutes}")
    private int lockDurationMinutes;

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);
        log.info("New user registered: {} with role {}", savedUser.getEmail(), savedUser.getRole());
        return mapToDto(savedUser);
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        // Check if account is locked
        if (user.isAccountLocked()) {
            if (isLockExpired(user)) {
                unlockAccount(user);
            } else {
                throw new AccountLockedException("Account is locked. Please try again later.");
            }
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (BadCredentialsException ex) {
            handleFailedAttempt(user);
            int remaining = maxFailedAttempts - user.getFailedAttempts();
            if (remaining <= 0) {
                throw new AccountLockedException("Account locked after " + maxFailedAttempts + " failed attempts.");
            }
            throw new BadCredentialsException("Invalid credentials. " + remaining + " attempt(s) remaining.");
        }

        // Reset failed attempts on successful login
        user.setFailedAttempts(0);
        user.setAccountLocked(false);
        user.setLockTime(null);
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);
        return LoginResponse.of(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    private void handleFailedAttempt(User user) {
        int attempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(attempts);
        if (attempts >= maxFailedAttempts) {
            user.setAccountLocked(true);
            user.setLockTime(LocalDateTime.now());
            log.warn("Account locked for user: {}", user.getEmail());
        }
        userRepository.save(user);
    }

    private boolean isLockExpired(User user) {
        if (user.getLockTime() == null)
            return true;
        return user.getLockTime().plusMinutes(lockDurationMinutes).isBefore(LocalDateTime.now());
    }

    private void unlockAccount(User user) {
        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .accountLocked(user.isAccountLocked())
                .failedAttempts(user.getFailedAttempts())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
