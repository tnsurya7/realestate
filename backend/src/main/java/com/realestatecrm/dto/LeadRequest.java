package com.realestatecrm.dto;

import com.realestatecrm.model.LeadStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LeadRequest {

    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid customer email format")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String customerPhone;

    @DecimalMin(value = "0", inclusive = false, message = "Budget must be positive")
    @DecimalMax(value = "999999999.99", message = "Budget is too high")
    private BigDecimal budget;

    private Long propertyId;

    private Long assignedAgentId;

    private LeadStatus status;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @Size(max = 100, message = "Source cannot exceed 100 characters")
    private String source;
}
