package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.PropertyDto;
import com.realestatecrm.dto.PropertyRequest;
import com.realestatecrm.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Properties", description = "Property management endpoints")
public class PropertyController {

    private final PropertyService propertyService;

    // Public endpoint - no auth required
    @GetMapping("/properties")
    @Operation(summary = "Get all available properties (Public)")
    public ResponseEntity<ApiResponse<List<PropertyDto>>> getAvailableProperties() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getAvailableProperties()));
    }

    @GetMapping("/properties/{id}")
    @Operation(summary = "Get property by ID (Public)")
    public ResponseEntity<ApiResponse<PropertyDto>> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getPropertyById(id)));
    }

    // Admin-only endpoints
    @GetMapping("/admin/properties")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all properties with pagination (Admin only)")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<PropertyDto>>> getAllProperties(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        
        org.springframework.data.domain.Sort.Direction sortDirection = 
            direction.equalsIgnoreCase("ASC") ? 
            org.springframework.data.domain.Sort.Direction.ASC : 
            org.springframework.data.domain.Sort.Direction.DESC;
        
        org.springframework.data.domain.Pageable pageable = 
            org.springframework.data.domain.PageRequest.of(page, size, 
            org.springframework.data.domain.Sort.by(sortDirection, sortBy));
        
        org.springframework.data.domain.Page<PropertyDto> properties = propertyService.getAllProperties(pageable);
        return ResponseEntity.ok(ApiResponse.success(properties));
    }
    
    @GetMapping("/admin/properties/all")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get all properties without pagination (Admin only - legacy)")
    public ResponseEntity<ApiResponse<List<PropertyDto>>> getAllPropertiesLegacy() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getAllPropertiesList()));
    }

    @PostMapping("/admin/properties")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create new property (Admin only)")
    public ResponseEntity<ApiResponse<PropertyDto>> createProperty(@Valid @RequestBody PropertyRequest request) {
        PropertyDto created = propertyService.createProperty(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Property created successfully"));
    }

    @PutMapping("/admin/properties/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update property (Admin only)")
    public ResponseEntity<ApiResponse<PropertyDto>> updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(propertyService.updateProperty(id, request), "Property updated"));
    }

    @DeleteMapping("/admin/properties/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete property (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Property deleted successfully"));
    }
}
