package com.realestatecrm.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ContactRequest {
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^$|^[0-9]{10}$", message = "Phone number must be exactly 10 digits or empty")
    private String phone;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 1000, message = "Message must be between 10 and 1000 characters")
    private String message;
}
