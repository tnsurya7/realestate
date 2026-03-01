package com.realestatecrm.dto;

import com.realestatecrm.model.LeadStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LeadRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid customer email format")
    private String customerEmail;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @DecimalMin(value = "0", inclusive = false, message = "Budget must be positive")
    private BigDecimal budget;

    private Long propertyId;

    private Long assignedAgentId;

    private LeadStatus status;

    private String notes;

    private String source;
}
