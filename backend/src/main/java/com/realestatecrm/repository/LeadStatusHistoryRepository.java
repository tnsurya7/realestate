package com.realestatecrm.repository;

import com.realestatecrm.model.Lead;
import com.realestatecrm.model.LeadStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadStatusHistoryRepository extends JpaRepository<LeadStatusHistory, Long> {
    
    List<LeadStatusHistory> findByLeadOrderByChangedAtDesc(Lead lead);
    
    List<LeadStatusHistory> findByLeadIdOrderByChangedAtDesc(Long leadId);
}
