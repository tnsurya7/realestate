package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.ContactRequest;
import com.realestatecrm.model.Contact;
import com.realestatecrm.repository.ContactRepository;
import com.realestatecrm.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Public contact form endpoint")
public class ContactController {

    private final ContactRepository contactRepository;
    private final EmailService emailService;

    @PostMapping
    @Operation(summary = "Submit contact form (Public - no auth required)")
    public ResponseEntity<ApiResponse<Void>> submitContact(@Valid @RequestBody ContactRequest request) {
        try {
            // Save to database
            Contact contact = Contact.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .message(request.getMessage())
                    .build();
            contactRepository.save(contact);
            log.info("Contact form submitted by: {}", request.getEmail());

            // Send email notification
            emailService.sendContactFormEmail(request);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(null, "Message sent successfully! We'll get back to you within 24 hours."));
        } catch (Exception e) {
            log.error("Failed to process contact form", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to send message. Please try again."));
        }
    }
}
