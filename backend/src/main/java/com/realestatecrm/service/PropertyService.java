package com.realestatecrm.service;

import com.realestatecrm.dto.PropertyDto;
import com.realestatecrm.dto.PropertyRequest;
import com.realestatecrm.exception.ResourceNotFoundException;
import com.realestatecrm.model.Property;
import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public List<PropertyDto> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<PropertyDto> getAllProperties(org.springframework.data.domain.Pageable pageable) {
        log.info("Fetching properties - page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        return propertyRepository.findAll(pageable).map(this::mapToDto);
    }

    public List<PropertyDto> getAllPropertiesList() {
        log.info("Fetching all properties without pagination");
        return propertyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    public List<PropertyDto> getAvailableProperties() {
        return propertyRepository.findByStatus(PropertyStatus.AVAILABLE).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));
        return mapToDto(property);
    }

    @Transactional
    public PropertyDto createProperty(PropertyRequest request) {
        Property property = Property.builder()
                .title(request.getTitle())
                .location(request.getLocation())
                .price(request.getPrice())
                .propertyType(request.getPropertyType())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : PropertyStatus.AVAILABLE)
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .area(request.getArea())
                .imageUrl(request.getImageUrl())
                .build();

        Property saved = propertyRepository.save(property);
        log.info("Created property: {}", saved.getTitle());
        return mapToDto(saved);
    }

    @Transactional
    public PropertyDto updateProperty(Long id, PropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", id));

        property.setTitle(request.getTitle());
        property.setLocation(request.getLocation());
        property.setPrice(request.getPrice());
        property.setPropertyType(request.getPropertyType());
        property.setDescription(request.getDescription());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setArea(request.getArea());
        property.setImageUrl(request.getImageUrl());
        if (request.getStatus() != null) {
            property.setStatus(request.getStatus());
        }

        return mapToDto(propertyRepository.save(property));
    }

    @Transactional
    public void deleteProperty(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Property", "id", id);
        }
        propertyRepository.deleteById(id);
        log.info("Deleted property with id: {}", id);
    }

    public PropertyDto mapToDto(Property property) {
        return PropertyDto.builder()
                .id(property.getId())
                .title(property.getTitle())
                .location(property.getLocation())
                .price(property.getPrice())
                .propertyType(property.getPropertyType())
                .description(property.getDescription())
                .status(property.getStatus())
                .createdAt(property.getCreatedAt())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .area(property.getArea())
                .imageUrl(property.getImageUrl())
                .build();
    }


    public org.springframework.data.domain.Page<PropertyDto> searchProperties(
            String city,
            com.realestatecrm.model.PropertyType type,
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice,
            Integer bedrooms,
            com.realestatecrm.model.PropertyStatus status,
            org.springframework.data.domain.Pageable pageable) {

        log.info("Searching properties - city: {}, type: {}, minPrice: {}, maxPrice: {}, bedrooms: {}, status: {}",
                 city, type, minPrice, maxPrice, bedrooms, status);

        return propertyRepository.searchProperties(city, type, minPrice, maxPrice, bedrooms, status, pageable)
                .map(this::mapToDto);
    }

}
