package com.realestatecrm.repository;

import com.realestatecrm.model.Property;
import com.realestatecrm.model.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByStatus(PropertyStatus status);

    List<Property> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
}
