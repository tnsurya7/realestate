package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.LeadDto;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
@Tag(name = "Public Leads", description = "Public endpoint for submitting a lead inquiry")
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    @Operation(summary = "Submit a lead inquiry (Public - no auth required)")
    public ResponseEntity<ApiResponse<LeadDto>> submitLead(@Valid @RequestBody LeadRequest request) {
        LeadDto created = leadService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Lead submitted successfully! We'll contact you soon."));
    }
}
