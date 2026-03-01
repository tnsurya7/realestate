package com.realestatecrm.dto;

import com.realestatecrm.model.LeadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadDto {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private BigDecimal budget;
    private PropertyDto property;
    private UserDto assignedAgent;
    private LeadStatus status;
    private String notes;
    private String source;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
