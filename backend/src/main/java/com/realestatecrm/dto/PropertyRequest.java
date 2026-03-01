package com.realestatecrm.dto;

import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.model.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    private String description;

    private PropertyStatus status;
}
