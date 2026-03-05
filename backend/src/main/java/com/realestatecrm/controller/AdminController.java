package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.AnalyticsDto;
import com.realestatecrm.dto.LeadDto;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.dto.UserDto;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.Role;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.service.AnalyticsService;
import com.realestatecrm.service.LeadService;
import com.realestatecrm.service.PdfReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin-only management endpoints")
public class AdminController {

    private final LeadService leadService;
    private final AnalyticsService analyticsService;
    private final PdfReportService pdfReportService;
    private final UserRepository userRepository;
    private final com.realestatecrm.service.AuthService authService;
    private final com.realestatecrm.scheduler.PropertyRecommendationScheduler propertyRecommendationScheduler;

    // ---- Leads ----

    @GetMapping("/leads")
    @Operation(summary = "Get all leads with pagination")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<LeadDto>>> getAllLeads(
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
        
        org.springframework.data.domain.Page<LeadDto> leads = leadService.getAllLeads(pageable);
        return ResponseEntity.ok(ApiResponse.success(leads));
    }
    
    @GetMapping("/leads/all")
    @Operation(summary = "Get all leads without pagination (legacy)")
    public ResponseEntity<ApiResponse<List<LeadDto>>> getAllLeadsLegacy() {
        return ResponseEntity.ok(ApiResponse.success(leadService.getAllLeadsList()));
    }

    @GetMapping("/leads/{id}")
    @Operation(summary = "Get lead by ID")
    public ResponseEntity<ApiResponse<LeadDto>> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id)));
    }

    @GetMapping("/leads/{id}/history")
    @Operation(summary = "Get lead status change history")
    public ResponseEntity<ApiResponse<List<com.realestatecrm.model.LeadStatusHistory>>> getLeadHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadStatusHistory(id)));
    }


    @PostMapping("/leads")
    @Operation(summary = "Create a lead")
    public ResponseEntity<ApiResponse<LeadDto>> createLead(@Valid @RequestBody LeadRequest request) {
        LeadDto created = leadService.createLead(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Lead created successfully"));
    }

    @PutMapping("/leads/{id}")
    @Operation(summary = "Update a lead")
    public ResponseEntity<ApiResponse<LeadDto>> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.success(leadService.updateLead(id, request), "Lead updated"));
    }

    @PatchMapping("/leads/{id}/status")
    @Operation(summary = "Update lead status")
    public ResponseEntity<ApiResponse<LeadDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam LeadStatus status) {
        return ResponseEntity.ok(ApiResponse.success(leadService.updateLeadStatus(id, status), "Status updated"));
    }

    @PatchMapping("/leads/{id}/assign")
    @Operation(summary = "Assign lead to an agent")
    public ResponseEntity<ApiResponse<LeadDto>> assignLead(
            @PathVariable Long id,
            @RequestParam Long agentId) {
        LeadRequest req = new LeadRequest();
        // Use agent assignment only
        LeadDto existing = leadService.getLeadById(id);
        req.setCustomerName(existing.getCustomerName());
        req.setCustomerEmail(existing.getCustomerEmail());
        req.setCustomerPhone(existing.getCustomerPhone());
        req.setBudget(existing.getBudget());
        req.setStatus(existing.getStatus());
        req.setNotes(existing.getNotes());
        req.setSource(existing.getSource());
        req.setAssignedAgentId(agentId);
        if (existing.getProperty() != null) {
            req.setPropertyId(existing.getProperty().getId());
        }
        return ResponseEntity.ok(ApiResponse.success(leadService.updateLead(id, req), "Lead assigned"));
    }

    @DeleteMapping("/leads/{id}")
    @Operation(summary = "Delete a lead")
    public ResponseEntity<ApiResponse<Void>> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Lead deleted successfully"));
    }

    // ---- Agents ----

    @GetMapping("/agents")
    @Operation(summary = "Get all agents")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllAgents() {
        List<UserDto> agents = userRepository.findByRole(Role.AGENT).stream()
                .map(u -> UserDto.builder()
                        .id(u.getId())
                        .name(u.getName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .accountLocked(u.isAccountLocked())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(agents));
    }

    @PostMapping("/agents")
    @Operation(summary = "Create a new agent")
    public ResponseEntity<ApiResponse<UserDto>> createAgent(
            @Valid @RequestBody com.realestatecrm.dto.RegisterRequest request) {
        request.setRole(Role.AGENT); // Force role to AGENT
        UserDto created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Agent created successfully"));
    }

    @PutMapping("/agents/{id}")
    @Operation(summary = "Update an agent")
    public ResponseEntity<ApiResponse<UserDto>> updateAgent(
            @PathVariable Long id,
            @Valid @RequestBody com.realestatecrm.dto.UpdateUserRequest request) {
        UserDto updated = authService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Agent updated successfully"));
    }


    // ---- Analytics ----

    @GetMapping("/analytics")
    @Operation(summary = "Get CRM analytics data")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getAnalytics()));
    }

    // ---- PDF Report ----

    @GetMapping("/report")
    @Operation(summary = "Download PDF lead report")
    public ResponseEntity<byte[]> downloadReport() {
        try {
            byte[] pdfBytes = pdfReportService.generateReport();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "leads-report.pdf");
            headers.setContentLength(pdfBytes.length);
            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/scheduler/trigger-recommendations")
    @Operation(summary = "Manually trigger property recommendation emails (Admin only)")
    public ResponseEntity<ApiResponse<String>> triggerPropertyRecommendations() {
        try {
            log.info("Manual trigger requested for property recommendations");
            propertyRecommendationScheduler.triggerManually();
            return ResponseEntity.ok(ApiResponse.success(
                "Property recommendation scheduler triggered successfully. Check logs for details.",
                "Scheduler triggered"
            ));
        } catch (Exception e) {
            log.error("Failed to trigger scheduler: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to trigger scheduler: " + e.getMessage()));
        }
    }

}
