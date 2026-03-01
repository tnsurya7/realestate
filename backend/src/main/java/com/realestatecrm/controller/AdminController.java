package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.AnalyticsDto;
import com.realestatecrm.dto.LeadDto;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.dto.UserDto;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.Role;
import com.realestatecrm.model.User;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.service.AnalyticsService;
import com.realestatecrm.service.LeadService;
import com.realestatecrm.service.PdfReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    // ---- Leads ----

    @GetMapping("/leads")
    @Operation(summary = "Get all leads")
    public ResponseEntity<ApiResponse<List<LeadDto>>> getAllLeads() {
        return ResponseEntity.ok(ApiResponse.success(leadService.getAllLeads()));
    }

    @GetMapping("/leads/{id}")
    @Operation(summary = "Get lead by ID")
    public ResponseEntity<ApiResponse<LeadDto>> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getLeadById(id)));
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
}
