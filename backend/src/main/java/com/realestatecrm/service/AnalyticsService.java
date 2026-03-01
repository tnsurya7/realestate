package com.realestatecrm.service;

import com.realestatecrm.dto.AnalyticsDto;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.Role;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public AnalyticsDto getAnalytics() {
        // Lead count by status
        Map<String, Long> leadCountByStatus = new HashMap<>();
        for (LeadStatus status : LeadStatus.values()) {
            leadCountByStatus.put(status.name(), 0L);
        }
        List<Object[]> statusResults = leadRepository.countLeadsByStatus();
        for (Object[] row : statusResults) {
            leadCountByStatus.put(row[0].toString(), (Long) row[1]);
        }

        // Lead count by property
        List<AnalyticsDto.PropertyLeadCount> leadCountByProperty = leadRepository.countLeadsByProperty()
                .stream()
                .map(row -> new AnalyticsDto.PropertyLeadCount((Long) row[0], (String) row[1], (Long) row[2]))
                .collect(Collectors.toList());

        // Lead count by agent
        List<AnalyticsDto.AgentLeadCount> leadCountByAgent = leadRepository.countLeadsByAgent()
                .stream()
                .map(row -> new AnalyticsDto.AgentLeadCount((Long) row[0], (String) row[1], (Long) row[2]))
                .collect(Collectors.toList());

        return AnalyticsDto.builder()
                .leadCountByStatus(leadCountByStatus)
                .leadCountByProperty(leadCountByProperty)
                .leadCountByAgent(leadCountByAgent)
                .totalLeads(leadRepository.count())
                .totalProperties(propertyRepository.count())
                .totalAgents(userRepository.findByRole(Role.AGENT).size())
                .build();
    }
}
