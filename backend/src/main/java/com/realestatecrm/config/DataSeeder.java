package com.realestatecrm.config;

import com.realestatecrm.dto.RegisterRequest;
import com.realestatecrm.model.Property;
import com.realestatecrm.model.PropertyStatus;
import com.realestatecrm.model.PropertyType;
import com.realestatecrm.model.Role;
import com.realestatecrm.repository.PropertyRepository;
import com.realestatecrm.repository.UserRepository;
import com.realestatecrm.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final PropertyRepository propertyRepository;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String adminEmail;

    @org.springframework.beans.factory.annotation.Value("${app.admin.password}")
    private String adminPassword;

    @org.springframework.beans.factory.annotation.Value("${app.admin.name}")
    private String adminName;

    @Bean
    public CommandLineRunner initDefaultAdmin() {
        return args -> {
            // Seed Admin
            if (!userRepository.existsByEmail(adminEmail)) {
                log.info("Creating default Super Admin...");
                RegisterRequest request = new RegisterRequest();
                request.setName(adminName);
                request.setEmail(adminEmail);
                request.setPassword(adminPassword);
                request.setRole(Role.ADMIN);
                authService.register(request);
                log.info("Default Super Admin created successfully. [" + adminEmail + "]");
            }

            // Seed Properties (only once, when DB is empty)
            if (propertyRepository.count() == 0) {
                log.info("Seeding initial properties...");

                propertyRepository.save(Property.builder()
                        .title("Luxury 3BHK in Anna Nagar")
                        .location("Anna Nagar, Chennai")
                        .price(BigDecimal.valueOf(8500000))
                        .propertyType(PropertyType.APARTMENT)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "A stunning 3-bedroom apartment in the prime area of Anna Nagar with premium amenities, 24/7 security, modern interiors, and excellent connectivity to major IT hubs and schools.")
                        .bedrooms(3).bathrooms(2).area(1600.0)
                        .imageUrl("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Premium Villa with Pool")
                        .location("RS Puram, Coimbatore")
                        .price(BigDecimal.valueOf(22000000))
                        .propertyType(PropertyType.VILLA)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "An exquisite 5-bedroom villa with a private swimming pool, landscaped garden, and modern architecture. Perfect for luxury living in a serene environment.")
                        .bedrooms(5).bathrooms(4).area(4500.0)
                        .imageUrl("https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Commercial Space – IT Park")
                        .location("HITEC City, Hyderabad")
                        .price(BigDecimal.valueOf(15000000))
                        .propertyType(PropertyType.COMMERCIAL)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "Prime commercial office space in a Grade-A IT park with floor-to-ceiling windows, high-speed internet, and proximity to major tech companies.")
                        .bedrooms(0).bathrooms(2).area(3000.0)
                        .imageUrl("https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Studio Apartment – City Centre")
                        .location("MG Road, Bengaluru")
                        .price(BigDecimal.valueOf(4500000))
                        .propertyType(PropertyType.APARTMENT)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "A smart studio apartment perfect for young professionals in the heart of Bengaluru. Fully furnished with modern appliances and metro connectivity.")
                        .bedrooms(1).bathrooms(1).area(650.0)
                        .imageUrl("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Farm House Retreat")
                        .location("Nanjangud Road, Mysore")
                        .price(BigDecimal.valueOf(11000000))
                        .propertyType(PropertyType.VILLA)
                        .status(PropertyStatus.SOLD)
                        .description(
                                "A sprawling farmhouse retreat with lush gardens, a courtyard, and peaceful countryside views. Ideal as a second home or weekend getaway.")
                        .bedrooms(4).bathrooms(3).area(8000.0)
                        .imageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Office Space – Premier Zone")
                        .location("BKC, Mumbai")
                        .price(BigDecimal.valueOf(35000000))
                        .propertyType(PropertyType.OFFICE)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "Premium office space in Mumbai's most prestigious business district. Features include smart lighting, HVAC, and a dedicated reception area.")
                        .bedrooms(0).bathrooms(4).area(5000.0)
                        .imageUrl("https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Residential Plot – Salem Highway")
                        .location("Omalur Road, Salem")
                        .price(BigDecimal.valueOf(2500000))
                        .propertyType(PropertyType.PLOT)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "A prime 1200 sqft residential plot on Salem Highway with clear title, DTCP approved, and ready for immediate construction. Excellent appreciation potential.")
                        .bedrooms(0).bathrooms(0).area(1200.0)
                        .imageUrl("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80")
                        .build());

                propertyRepository.save(Property.builder()
                        .title("Warehouse – Industrial Hub")
                        .location("Ambattur, Chennai")
                        .price(BigDecimal.valueOf(18000000))
                        .propertyType(PropertyType.WAREHOUSE)
                        .status(PropertyStatus.AVAILABLE)
                        .description(
                                "A large industrial warehouse with 10,000 sqft of covered space, loading docks, 3-phase power supply, and 24/7 security. Ideal for logistics and e-commerce businesses.")
                        .bedrooms(0).bathrooms(2).area(10000.0)
                        .imageUrl("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80")
                        .build());

                log.info("Seeded {} properties into database.", propertyRepository.count());
            }
        };
    }
}
