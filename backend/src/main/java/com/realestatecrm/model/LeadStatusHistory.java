package com.realestatecrm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_status_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private LeadStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private LeadStatus newStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt;

    @Column(name = "notes", length = 500)
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
    }
}
