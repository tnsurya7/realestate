package com.realestatecrm.repository;

import com.realestatecrm.model.Property;
import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.model.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    List<Property> findByStatus(PropertyStatus status);
    
    List<Property> findByPriceLessThanEqualAndStatus(BigDecimal price, PropertyStatus status);

    List<Property> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
    
    @Query("SELECT p FROM Property p WHERE " +
           "(:city IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:type IS NULL OR p.propertyType = :type) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) AND " +
           "(:status IS NULL OR p.status = :status)")
    Page<Property> searchProperties(
        @Param("city") String city,
        @Param("type") PropertyType type,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("bedrooms") Integer bedrooms,
        @Param("status") PropertyStatus status,
        Pageable pageable
    );
}
