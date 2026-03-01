package com.realestatecrm.repository;

import com.realestatecrm.dto.AnalyticsDto;
import com.realestatecrm.model.Lead;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByAssignedAgent(User agent);

    List<Lead> findByStatus(LeadStatus status);

    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countLeadsByStatus();

    @Query("SELECT l.property.id, l.property.title, COUNT(l) FROM Lead l WHERE l.property IS NOT NULL GROUP BY l.property.id, l.property.title")
    List<Object[]> countLeadsByProperty();

    @Query("SELECT l.assignedAgent.id, l.assignedAgent.name, COUNT(l) FROM Lead l WHERE l.assignedAgent IS NOT NULL GROUP BY l.assignedAgent.id, l.assignedAgent.name")
    List<Object[]> countLeadsByAgent();
}
