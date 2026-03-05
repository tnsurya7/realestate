# RealEstateCrm

> An enterprise-grade Real Estate CRM platform built with React, Spring Boot, and PostgreSQL.

## 1. Project Overview

RealEstateCrm is a comprehensive Customer Relationship Management (CRM) system tailored specifically for the real estate industry. It streamlines the connection between property buyers, sellers, and real estate agents.

**Key Business Purpose:**
To centralize property listings and lead management, empowering real estate agencies to track inquiries, manage property portfolios, and analyze sales performance in real-time.

**Target Users:**
- **Admin:** Full access to manage users (agents), oversight of all property listings, lead assignment, and access to system-wide analytics.
- **Agent:** Access to assigned leads, ability to update lead statuses, and capability to manage specific property portfolios.
- **Public Users:** Prospective buyers and renters browsing public listings and submitting interest forms (leads).

**High-Level Capabilities:**
- Public-facing property catalog
- Secure, role-based internal dashboards
- End-to-end lead lifecycle management
- Advanced analytics and reporting
- Automated PDF report generation

---

## 2. System Architecture

The platform utilizes a modern, decoupled layered architecture, cleanly separating the client interface from the business logic and data persistence layers.

```text
+-----------------------+
|  Frontend (React+TS)  |
|                       |
|   - Public Pages      |
|   - Secured Dashboard |
|   - Axios API Client  |
+-----------+-----------+
            |
            | (REST / JSON / JWT)
            v
+-----------------------+
| Backend (Spring Boot) |
|                       |
|   - Controllers       |
|   - Security Filter   |
|   - Service Layer     |
|   - Repository Layer  |
+-----------+-----------+
            |
            | (JDBC / Hibernate)
            v
+-----------------------+
|   Database (Neon)     |
|                       |
|   - PostgreSQL        |
|   - Relational Schema |
+-----------------------+
```

- **Layered Backend Architecture:** Follows the MVC pattern with strict boundaries between Controllers (routing/HTTP), Services (business logic), and Repositories (data access).
- **Public vs. Secured APIs:** Public endpoints allow read-only access to properties and lead submission. Protected endpoints require valid JWT tokens.
- **Role-Based Access:** Enforced via Spring Security (`@PreAuthorize`), ensuring Agents cannot access Admin-level analytics or user management endpoints.

---

## 3. Tech Stack

### Frontend
- **React 18 + Vite:** Fast, modern UI development environment.
- **TypeScript:** Strongly typed client-side application.
- **Tailwind CSS:** Utility-first styling for a sleek, responsive SaaS design.
- **Framer Motion:** Fluid, professional micro-animations.
- **Axios:** Promise-based HTTP client for API interactions.
- **React Router v6:** Client-side routing with nested layouts and protected route wrappers.
- **Recharts:** Composable charting library for dashboard analytics.

### Backend
- **Java 17:** Modern, robust backend language.
- **Spring Boot 3:** Enterprise application framework.
- **Spring Security:** Authentication and access-control framework.
- **JWT Authentication:** Stateless, token-based security.
- **Spring Data JPA (Hibernate):** Object-Relational Mapping (ORM).
- **PostgreSQL:** Primary relational database.
- **Swagger (springdoc-openapi):** Automated API documentation.
- **BCrypt:** Secure password hashing algorithm.
- **Global Exception Handling:** `@ControllerAdvice` for standardized API error responses.

### Database
- **PostgreSQL (Neon DB):** Serverless Postgres database.
- **JPA Mappings:** Entity modeling using Java annotations.
- **Indexing:** Optimized querying for properties and leads.
- **Foreign Keys:** Referential integrity established at the database level.

---

## 4. Project Structure

### Frontend Structure
```text
frontend/
└── src/
    ├── assets/       # Static assets and images
    ├── components/   # Reusable UI components (Buttons, Cards, Modals)
    ├── context/      # React Context (AuthContext)
    ├── hooks/        # Custom React hooks
    ├── layouts/      # DashboardLayout, PublicLayout
    ├── pages/        # Route components (Home, AdminDashboard, etc.)
    ├── routes/       # Route definitions and ProtectedRoute logic
    ├── services/     # Axios API service integrations
    └── utils/        # Helper functions
```

### Backend Structure
```text
backend/
└── src/main/java/com/realestatecrm/
    ├── config/       # Spring Security, CORS, Swagger configs
    ├── controller/   # REST API Endpoints
    ├── dto/          # Data Transfer Objects for API requests/responses
    ├── exception/    # Custom Exceptions & GlobalExceptionHandler
    ├── model/        # JPA Entities (User, Property, Lead, etc.)
    ├── repository/   # Spring Data JPA interfaces
    ├── security/     # JWT filters and token providers
    └── service/      # Core business logic layer
```

---

## 5. Database Schema

The core relational data model centers around Users, Properties, and Leads.

### Schema Representation
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN / AGENT
    failed_attempts INT DEFAULT 0,
    account_locked BOOLEAN DEFAULT FALSE,
    lock_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2),
    location VARCHAR(255),
    property_type VARCHAR(50), -- VILLA, APARTMENT, COMMERCIAL
    status VARCHAR(50), -- AVAILABLE, SOLD, RENTED
    bedrooms INT,
    bathrooms INT,
    area INT, -- sqft
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    budget DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, CONTACTED, QUALIFIED, CLOSED
    source VARCHAR(100),
    property_id BIGINT REFERENCES properties(id),
    assigned_agent_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_status_history (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by BIGINT REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relationships
- **ManyToOne (Leads -> Properties):** Multiple leads can inquire about a single property. Foreign key: `property_id`.
- **ManyToOne (Leads -> Users):** Multiple leads can be assigned to one agent. Foreign key: `assigned_agent_id`.
- **OneToMany (Leads -> LeadStatusHistory):** A lead has a history of status changes.

---

## 6. Authentication & Security

Security is strictly enforced across both the client and server.

**Authentication Flow:**
```text
Client (Login) -> API (/auth/login) -> Validate Credentials -> Generate JWT 
  -> Return JWT -> Client stores JWT -> Attach to subsequent Authorization Headers
```

**Security Features:**
- **JWT Authentication Flow:** Stateless tokens utilized for API authorization.
- **Token Expiration:** JWTs are minted with strict expiration limits.
- **Role-Based Access Control (RBAC):** Backend endpoints restricted via `@PreAuthorize("hasRole('ADMIN')")`.
- **Strong Password Validation:** Handled during user creation using BCrypt hashing.
- **Login Attempt Limiting:** Accounts lock automatically after 3 consecutive failed login attempts.
- **Account Locking Logic:** Time-based lock releases or requires admin intervention via `lockTime` / `accountLocked` flags.
- **Protected Routes (Frontend):** React Router implements an `AuthContext` check before rendering dashboard elements.
- **Axios Interceptor Usage:** JWTs are automatically injected into outgoing HTTP request headers.

---

## 7. API Documentation

The REST API utilizes standard HTTP verbs and status codes (`200 OK`, `201 Created`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`). Structuring relies heavily on specific domains and roles.

**Public APIs:**
- `GET /api/properties`: Fetch available listings for the public site.
- `GET /api/properties/{id}`: Fetch single property details.
- `POST /api/leads`: Submit a new inquiry from the public site.

**Admin APIs (`/api/admin/*`):**
- `GET/POST/PUT/DELETE /leads`: Full lead management and assignment.
- `GET/POST/PUT/DELETE /properties`: Inventory management.
- `GET /analytics`: Retrieve dashboard aggregations.
- `GET /report/download`: Generates and downloads a PDF summary.

**Agent APIs (`/api/agent/*`):**
- `GET /leads`: View leads assigned to the authenticated agent.
- `PATCH /status/{leadId}`: Update the status of an assigned lead.

**Swagger Integration:**
Locally, navigate to `http://localhost:8080/swagger-ui.html` to explore the interactive OpenAPI 3 documentation.

---

## 8. Analytics & Reporting

The system features robust reporting capabilities tailored for administrative oversight.

- **Lead Status Analytics:** Pie charts aggregating leads grouped by status (NEW, CONTACTED, etc.).
- **Property-based Lead Count:** Bar charts visualizing which properties drive the most inbound interest.
- **Agent Performance Metrics:** Tracking closed deals and active pipelines per agent.
- **SQL GROUP BY Usage:** Backend utilizes Spring Data JPA native queries or aggregations (e.g., `SELECT status, COUNT(*) FROM leads GROUP BY status`) for highly efficient metric extraction.
- **PDF Report Generation Logic:** Java-based PDF generation (e.g., iText or JasperReports) constructs a downloadable business snapshot summarizing the current pipeline.

---

## 9. Frontend Features

The React application delivers a premium, native-feeling user experience.

- **Public Marketing Website:** High-conversion landing page, property catalog, about, and contact pages.
- **Admin Dashboard:** Centralized command center with editable tables for properties and leads.
- **Agent Dashboard:** Streamlined view focused strictly on assigned tasks and lead follow-ups.
- **Responsive Layout:** Mobile-first Tailwind CSS design ensuring usability across all devices.
- **Animations:** Subtle layout transitions and hover effects powered by Framer Motion.
- **Chart Integration:** Recharts library visualizes complex analytical data beautifully.
- **Toast Notifications:** Standardized user feedback via `react-hot-toast` for success/error states.
- **Loading States:** Skeleton screens and CSS spinners prevent layout shift during API resolution.
- **SEO Optimization:** Semantic HTML and meta tags structured for search engine indexing.

---

## 10. Environment Variables

Create `.env` files in their respective roots before initializing the environments.

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:8080/api
```

**Backend (`backend/src/main/resources/application.properties`):**
```properties
spring.datasource.url=jdbc:postgresql://<NEON_DB_URL>
spring.datasource.username=<USERNAME>
spring.datasource.password=<PASSWORD>
jwt.secret=<YOUR_SECURE_RANDOM_BASE64_SECRET>
jwt.expiration=86400000
```

---

## 11. Installation & Setup

### Database Configuration
1. Provision a PostgreSQL instance (e.g., local Postgres or Neon).
2. Configure the credentials in `application.properties`.

### Backend Setup
1. Ensure Java 17 and Maven are installed.
2. Navigate to the `backend` directory.
3. Build the project: `./mvnw clean install`
4. Run the server: `./mvnw spring-boot:run`
*(Server starts on port 8080)*

### Frontend Setup
1. Ensure Node.js (v18+) is installed.
2. Navigate to the `frontend` directory.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
*(Client starts on port 5173)*

### Building for Production (Frontend)
```bash
npm run build
```
Generates a static `dist` directory ready for deployment.

---

## 12. Deployment Guide

### Docker Deployment (Recommended)

The easiest way to deploy the entire stack is using Docker Compose:

```bash
# 1. Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# 2. Build and start all services
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
```

For detailed Docker deployment instructions, see [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md).

### Traditional Deployment

- **Frontend Deployment (Vercel):** Connect the GitHub repository to Vercel. Set the Framework Preset to "Vite". Configure the `VITE_API_URL` environment variable to point to the production backend.
- **Backend Deployment (Render/Railway):** Deploy the Spring Boot application using Docker or native Java environments. Ensure the `$PORT` variable is bound correctly.
- **Database Hosting (Neon):** Neon provides an auto-scaling serverless Postgres instance. Supply the connection string into the backend's environment variables.
- **Environment Configuration:** Ensure all secrets (JWT keys, DB passwords) are injected securely via the hosting provider's secrets manager.

---

## 13. Production Best Practices

- **Schema Validation:** Switch `spring.jpa.hibernate.ddl-auto` from `update` to `validate` in production to prevent accidental schema drops. Use tools like Flyway or Liquibase for migrations.
- **Secure Secret Storage:** Never commit `.env` files or hardcoded JWT secrets to version control.
- **CORS Configuration:** Strictly define `AllowedOrigins` in Spring MVC to match exactly the production frontend domain.
- **HTTPS:** Ensure TLS/SSL is enforced across all external web traffic.
- **Rate Limiting:** Implement rate limiting (e.g., Bucket4j) on authentication endpoints to deter brute-force attacks.
- **Logging:** Output logs in JSON format for easier ingestion by APM tools (e.g., Datadog, ELK).

---

## 14. Future Enhancements

The system architecture is designed for extensibility. Planned roadmap features include:
- **Refresh Tokens:** Implementing short-lived access tokens with secure HTTP-only refresh tokens.
- **Role Expansion:** Introducing 'Manager' roles for regional oversight.
- **Lead Scoring:** Automated algorithms to prioritize hot leads based on interaction frequency.
- **Email Automation:** Integration with SendGrid/AWS SES for automated property alerts and welcome sequences.
- **Audit Logs:** Comprehensive tracking of all database modifications by users for compliance purposes.
