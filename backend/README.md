# RealEstateCrm - Backend

This backend application powers the **RealEstateCrm** platform. It operates as an API server supporting comprehensive management of users, properties, and leads.

## Features

- **Authentication:** JWT-based authentication with role-based access control (Admin & Agent roles).
- **Entities Management:** Complete CRUD endpoints for Lead and Property records.
- **Analytics:** Data aggregation endpoints supporting dashboard analytics (total properties, leads, conversions).
- **Security:** CSRF configuration, CORS management, and secure password hashing with BCrypt.

## Tech Stack

- **Framework:** Java 17 + Spring Boot 3
- **Database:** PostgreSQL (Neon DB config)
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security + JSON Web Tokens (JWT)
- **Documentation:** Swagger UI (springdoc-openapi)
- **Build Tool:** Maven

## API Documentation

Run the application and navigate to:
```
http://localhost:8080/swagger-ui.html
```
To access the interactive API docs and test the endpoints directly.

## Getting Started

### Prerequisites
- JDK 17
- Maven
- PostgreSQL running locally or a remote Neon DB instance

### Configuration

Edit your `application.properties` (or set environment variables) to link your database:
```properties
spring.datasource.url=jdbc:postgresql://<YOUR_DB_URL>
spring.datasource.username=<YOUR_USERNAME>
spring.datasource.password=<YOUR_PASSWORD>
```

### Run the Application

Navigate to the backend root directory and start the server:

```bash
./mvnw spring-boot:run
```

Or build the jar and execute it:

```bash
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
