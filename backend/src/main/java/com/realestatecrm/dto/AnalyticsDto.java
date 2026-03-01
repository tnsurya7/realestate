package com.realestatecrm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    private Map<String, Long> leadCountByStatus;
    private List<PropertyLeadCount> leadCountByProperty;
    private List<AgentLeadCount> leadCountByAgent;
    private long totalLeads;
    private long totalProperties;
    private long totalAgents;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PropertyLeadCount {
        private Long propertyId;
        private String propertyTitle;
        private Long count;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AgentLeadCount {
        private Long agentId;
        private String agentName;
        private Long count;
    }
}
