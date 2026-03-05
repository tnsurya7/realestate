package com.realestatecrm.scheduler;

import com.realestatecrm.model.Lead;
import com.realestatecrm.model.LeadStatus;
import com.realestatecrm.model.Property;
import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.repository.LeadRepository;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class PropertyRecommendationScheduler {

    private final LeadRepository leadRepository;
    private final PropertyRepository propertyRepository;
    private final EmailService emailService;

    /**
     * Sends daily property recommendations to leads
     * Runs every day at 9:00 AM
     * Prevents duplicate emails by checking lastEmailSentDate
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyPropertyRecommendations() {
        log.info("Starting daily property recommendation email scheduler");
        
        try {
            // Get all NEW leads
            List<Lead> leads = leadRepository.findByStatus(LeadStatus.NEW);
            log.info("Found {} NEW leads for recommendations", leads.size());
            
            int emailsSent = 0;
            int emailsSkipped = 0;
            
            for (Lead lead : leads) {
                try {
                    // Skip if email already sent today
                    if (lead.getLastEmailSentDate() != null && 
                        lead.getLastEmailSentDate().toLocalDate().equals(LocalDate.now())) {
                        log.debug("Skipping lead {} - email already sent today", lead.getId());
                        emailsSkipped++;
                        continue;
                    }
                    
                    // Find matching properties based on budget
                    List<Property> recommendations = findMatchingProperties(lead);
                    
                    if (!recommendations.isEmpty()) {
                        // Send recommendation email
                        emailService.sendPropertyRecommendations(lead, recommendations);
                        
                        // Update last email sent date
                        lead.setLastEmailSentDate(LocalDateTime.now());
                        leadRepository.save(lead);
                        
                        emailsSent++;
                        log.info("Sent {} property recommendations to: {}", 
                                recommendations.size(), lead.getCustomerEmail());
                    } else {
                        log.debug("No matching properties found for lead {}", lead.getId());
                    }
                    
                } catch (Exception e) {
                    log.error("Failed to send recommendations to lead {}: {}", 
                             lead.getId(), e.getMessage(), e);
                }
            }
            
            log.info("Property recommendation scheduler completed - Sent: {}, Skipped: {}", 
                    emailsSent, emailsSkipped);
            
        } catch (Exception e) {
            log.error("Error in property recommendation scheduler: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Find properties matching lead's budget and preferences
     * Returns up to 3 best matches
     */
    private List<Property> findMatchingProperties(Lead lead) {
        if (lead.getBudget() == null) {
            // If no budget specified, return latest available properties
            return propertyRepository.findByStatus(PropertyStatus.AVAILABLE)
                    .stream()
                    .limit(3)
                    .collect(Collectors.toList());
        }
        
        // Find properties within budget
        return propertyRepository.findByPriceLessThanEqualAndStatus(
                lead.getBudget(), 
                PropertyStatus.AVAILABLE
        )
        .stream()
        .limit(3)
        .collect(Collectors.toList());
    }
    
    /**
     * Manual trigger for testing (can be called via endpoint)
     */
    public void triggerManually() {
        log.info("Manually triggering property recommendation scheduler");
        sendDailyPropertyRecommendations();
    }
}
