package com.realestatecrm.service;

import com.realestatecrm.dto.LeadDto;
import com.realestatecrm.dto.LeadRequest;
import com.realestatecrm.exception.BadRequestException;
import com.realestatecrm.exception.ResourceNotFoundException;
import com.realestatecrm.model.Lead;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.Property;
import com.realestatecrm.model.Role;
import com.realestatecrm.model.User;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyService propertyService;
    private final EmailService emailService;

    public List<LeadDto> getAllLeadsList() {
        log.info("Fetching all leads without pagination");
        return leadRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<LeadDto> getAllLeads(org.springframework.data.domain.Pageable pageable) {
        log.info("Fetching leads - page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return leadRepository.findAll(pageable).map(this::mapToDto);
    }


    public LeadDto getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        return mapToDto(lead);
    }

    public List<LeadDto> getLeadsByAgent(Long agentId) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", agentId));
        return leadRepository.findByAssignedAgent(agent).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeadDto createLead(LeadRequest request) {
        Lead.LeadBuilder builder = Lead.builder()
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .budget(request.getBudget())
                .source(request.getSource())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW);

        Property property = null;
        if (request.getPropertyId() != null) {
            property = propertyRepository.findById(request.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));
            builder.property(property);
        }

        if (request.getAssignedAgentId() != null) {
            User agent = userRepository.findById(request.getAssignedAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", request.getAssignedAgentId()));
            if (agent.getRole() != Role.AGENT) {
                throw new BadRequestException("Assigned user must have AGENT role");
            }
            builder.assignedAgent(agent);
        }

        Lead saved = leadRepository.save(builder.build());
        log.info("Created lead for: {}", saved.getCustomerName());

        // Send email notification
        try {
            emailService.sendLeadNotificationEmail(request, property);
        } catch (Exception e) {
            log.error("Failed to send lead notification email", e);
        }

        return mapToDto(saved);
    }

    @Transactional
    public LeadDto updateLead(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));

        lead.setCustomerName(request.getCustomerName());
        lead.setCustomerEmail(request.getCustomerEmail());
        lead.setCustomerPhone(request.getCustomerPhone());
        lead.setBudget(request.getBudget());
        lead.setSource(request.getSource());
        lead.setNotes(request.getNotes());

        if (request.getStatus() != null) {
            lead.setStatus(request.getStatus());
        }

        if (request.getPropertyId() != null) {
            Property property = propertyRepository.findById(request.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property", "id", request.getPropertyId()));
            lead.setProperty(property);
        }

        if (request.getAssignedAgentId() != null) {
            User agent = userRepository.findById(request.getAssignedAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent", "id", request.getAssignedAgentId()));
            if (agent.getRole() != Role.AGENT) {
                throw new BadRequestException("Assigned user must have AGENT role");
            }
            lead.setAssignedAgent(agent);
        }

        return mapToDto(leadRepository.save(lead));
    }

    @Transactional
    public LeadDto updateLeadStatus(Long id, LeadStatus status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        lead.setStatus(status);
        return mapToDto(leadRepository.save(lead));
    }

    @Transactional
    public LeadDto addNotes(Long id, String notes) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        lead.setNotes(notes);
        return mapToDto(leadRepository.save(lead));
    }

    @Transactional
    public void deleteLead(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead", "id", id);
        }
        leadRepository.deleteById(id);
        log.info("Deleted lead with id: {}", id);
    }

    public LeadDto mapToDto(Lead lead) {
        LeadDto dto = new LeadDto();
        dto.setId(lead.getId());
        dto.setCustomerName(lead.getCustomerName());
        dto.setCustomerEmail(lead.getCustomerEmail());
        dto.setCustomerPhone(lead.getCustomerPhone());
        dto.setBudget(lead.getBudget());
        dto.setStatus(lead.getStatus());
        dto.setNotes(lead.getNotes());
        dto.setSource(lead.getSource());
        dto.setCreatedAt(lead.getCreatedAt());
        dto.setUpdatedAt(lead.getUpdatedAt());

        if (lead.getProperty() != null) {
            dto.setProperty(propertyService.mapToDto(lead.getProperty()));
        }

        if (lead.getAssignedAgent() != null) {
            User agent = lead.getAssignedAgent();
            dto.setAssignedAgent(com.realestatecrm.dto.UserDto.builder()
                    .id(agent.getId())
                    .name(agent.getName())
                    .email(agent.getEmail())
                    .role(agent.getRole())
                    .build());
        }

        return dto;
    }
}
