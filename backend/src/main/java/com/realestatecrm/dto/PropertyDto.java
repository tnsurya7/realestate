package com.realestatecrm.dto;

import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.model.PropertyType;
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
public class PropertyDto {
    private Long id;
    private String title;
    private String location;
    private BigDecimal price;
    private PropertyType propertyType;
    private String description;
    private PropertyStatus status;
    private LocalDateTime createdAt;
    private Integer bedrooms;
    private Integer bathrooms;
    private Double area;
    private String imageUrl;
}
