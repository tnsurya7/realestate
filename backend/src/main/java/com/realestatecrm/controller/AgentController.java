package com.realestatecrm.controller;

import com.realestatecrm.dto.ApiResponse;
import com.realestatecrm.dto.LeadDto;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.User;
import com.realestatecrm.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Agent", description = "Agent-specific lead management endpoints")
public class AgentController {

    private final LeadService leadService;

    @GetMapping("/leads")
    @Operation(summary = "Get leads assigned to the current agent")
    public ResponseEntity<ApiResponse<List<LeadDto>>> getMyLeads(@AuthenticationPrincipal User currentUser) {
        List<LeadDto> leads = leadService.getLeadsByAgent(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(leads));
    }

    @GetMapping("/leads/{id}")
    @Operation(summary = "Get a specific lead by ID (must be assigned to this agent)")
    public ResponseEntity<ApiResponse<LeadDto>> getLeadById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        LeadDto lead = leadService.getLeadById(id);
        if (lead.getAssignedAgent() == null || !lead.getAssignedAgent().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied to this lead"));
        }
        return ResponseEntity.ok(ApiResponse.success(lead));
    }

    @PatchMapping("/leads/{id}/status")
    @Operation(summary = "Update status of an assigned lead")
    public ResponseEntity<ApiResponse<LeadDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam LeadStatus status,
            @AuthenticationPrincipal User currentUser) {
        LeadDto lead = leadService.getLeadById(id);
        if (lead.getAssignedAgent() == null || !lead.getAssignedAgent().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied to this lead"));
        }
        return ResponseEntity.ok(ApiResponse.success(leadService.updateLeadStatus(id, status), "Status updated"));
    }

    @PatchMapping("/leads/{id}/notes")
    @Operation(summary = "Add notes to an assigned lead")
    public ResponseEntity<ApiResponse<LeadDto>> addNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User currentUser) {
        LeadDto lead = leadService.getLeadById(id);
        if (lead.getAssignedAgent() == null || !lead.getAssignedAgent().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied to this lead"));
        }
        String notes = body.getOrDefault("notes", "");
        return ResponseEntity.ok(ApiResponse.success(leadService.addNotes(id, notes), "Notes updated"));
    }
}
