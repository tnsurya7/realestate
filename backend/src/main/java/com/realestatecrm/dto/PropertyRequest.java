package com.realestatecrm.dto;

import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.model.PropertyType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Location is required")
    @Size(min = 3, max = 200, message = "Location must be between 3 and 200 characters")
    private String location;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "999999999.99", message = "Price is too high")
    private BigDecimal price;

    @NotNull(message = "Property type is required")
    private PropertyType propertyType;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private PropertyStatus status;

    @Min(value = 0, message = "Bedrooms cannot be negative")
    @Max(value = 50, message = "Bedrooms cannot exceed 50")
    private Integer bedrooms;
    
    @Min(value = 0, message = "Bathrooms cannot be negative")
    @Max(value = 50, message = "Bathrooms cannot exceed 50")
    private Integer bathrooms;
    
    @DecimalMin(value = "0.0", message = "Area cannot be negative")
    @DecimalMax(value = "999999.99", message = "Area is too large")
    private Double area;
    
    @Pattern(regexp = "^(https?://.*|)$", message = "Image URL must be a valid HTTP/HTTPS URL or empty")
    private String imageUrl;
}
