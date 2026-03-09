# RealEstate CRM - Complete Project Structure

## 📁 Root Directory

```
real-estate-crm/
├── backend/                          # Spring Boot Backend (Java 17)
├── frontend/                         # React + TypeScript Frontend
├── .github/workflows/                # GitHub Actions CI/CD
├── .codex/                          # Kiro AI configuration
├── .vscode/                         # VS Code settings
├── docker-compose.yml               # Docker orchestration
├── render.yaml                      # Render deployment config
├── test-sendgrid.sh                # SendGrid test script
└── [Documentation Files]            # Various MD files
```

---

## 🔧 Backend Structure (Spring Boot)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/realestatecrm/
│   │   │   ├── RealEstateCrmApplication.java    # Main application entry
│   │   │   │
│   │   │   ├── config/                          # Configuration classes
│   │   │   │   ├── ApplicationConfig.java       # Bean configurations
│   │   │   │   ├── DataSeeder.java             # Initial data seeding
│   │   │   │   ├── SecurityConfig.java         # Spring Security config
│   │   │   │   └── SwaggerConfig.java          # API documentation config
│   │   │   │
│   │   │   ├── controller/                      # REST API Controllers
│   │   │   │   ├── AdminController.java        # Admin endpoints
│   │   │   │   ├── AgentController.java        # Agent endpoints
│   │   │   │   ├── AuthController.java         # Authentication
│   │   │   │   ├── ContactController.java      # Contact form
│   │   │   │   ├── HealthController.java       # Health check
│   │   │   │   ├── LeadController.java         # Lead management
│   │   │   │   └── PropertyController.java     # Property management
│   │   │   │
│   │   │   ├── dto/                            # Data Transfer Objects
│   │   │   │   ├── AnalyticsDto.java          # Analytics data
│   │   │   │   ├── ApiResponse.java           # Standard API response
│   │   │   │   ├── ContactRequest.java        # Contact form data
│   │   │   │   ├── LeadDto.java               # Lead data
│   │   │   │   ├── LeadRequest.java           # Lead creation/update
│   │   │   │   ├── LoginRequest.java          # Login credentials
│   │   │   │   ├── LoginResponse.java         # Login response with JWT
│   │   │   │   ├── PropertyDto.java           # Property data
│   │   │   │   ├── PropertyRequest.java       # Property creation/update
│   │   │   │   ├── RegisterRequest.java       # User registration
│   │   │   │   ├── UpdateUserRequest.java     # User update
│   │   │   │   └── UserDto.java               # User data
│   │   │   │
│   │   │   ├── exception/                      # Exception handling
│   │   │   │   ├── BadRequestException.java
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── RateLimitExceededException.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── ValidationErrorResponse.java
│   │   │   │
│   │   │   ├── model/                          # JPA Entity Models
│   │   │   │   ├── Contact.java               # Contact form entity
│   │   │   │   ├── Lead.java                  # Lead entity
│   │   │   │   ├── LeadStatus.java            # Lead status enum
│   │   │   │   ├── LeadStatusHistory.java     # Lead status audit trail
│   │   │   │   ├── Property.java              # Property entity
│   │   │   │   ├── PropertyStatus.java        # Property status enum
│   │   │   │   ├── PropertyType.java          # Property type enum
│   │   │   │   ├── Role.java                  # User role enum
│   │   │   │   └── User.java                  # User entity
│   │   │   │
│   │   │   ├── repository/                     # Spring Data JPA Repositories
│   │   │   │   ├── ContactRepository.java
│   │   │   │   ├── LeadRepository.java
│   │   │   │   ├── LeadStatusHistoryRepository.java
│   │   │   │   ├── PropertyRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   │
│   │   │   ├── scheduler/                      # Scheduled tasks
│   │   │   │   └── PropertyRecommendationScheduler.java  # Daily 9 AM emails
│   │   │   │
│   │   │   ├── security/                       # Security components
│   │   │   │   ├── JwtAuthenticationFilter.java    # JWT validation filter
│   │   │   │   ├── JwtTokenProvider.java          # JWT generation/validation
│   │   │   │   └── RateLimitingFilter.java        # Rate limiting (Bucket4j)
│   │   │   │
│   │   │   ├── service/                        # Business logic services
│   │   │   │   ├── AnalyticsService.java      # Dashboard analytics
│   │   │   │   ├── AuthService.java           # Authentication logic
│   │   │   │   ├── EmailService.java          # SendGrid email sending
│   │   │   │   ├── LeadService.java           # Lead management
│   │   │   │   ├── PdfReportService.java      # PDF generation (iText)
│   │   │   │   └── PropertyService.java       # Property management
│   │   │   │
│   │   │   └── util/                           # Utility classes
│   │   │       └── PageResponse.java          # Pagination wrapper
│   │   │
│   │   └── resources/
│   │       └── application.properties          # Application configuration
│   │
│   └── test/                                   # Test files
│       └── java/
│
├── .dockerignore                               # Docker ignore patterns
├── .env                                        # Environment variables (local)
├── .env.example                                # Environment template
├── .gitignore                                  # Git ignore patterns
├── Dockerfile                                  # Docker build config
├── pom.xml                                     # Maven dependencies
├── README.md                                   # Backend documentation
└── start.sh                                    # Local startup script
```

---

## ⚛️ Frontend Structure (React + TypeScript)

```
frontend/
├── src/
│   ├── assets/                                 # Static assets
│   │
│   ├── components/                             # Reusable components
│   │   ├── FloatingButtons.tsx                # WhatsApp/Call buttons
│   │   ├── Footer.tsx                         # Footer with SVG icons
│   │   ├── Modal.tsx                          # Modal dialog
│   │   ├── Navbar.tsx                         # Navigation bar
│   │   ├── PropertyCard.tsx                   # Property display card
│   │   ├── Sidebar.tsx                        # Admin sidebar
│   │   └── UI.tsx                             # UI utility components
│   │
│   ├── context/                                # React Context
│   │   └── AuthContext.tsx                    # Authentication context
│   │
│   ├── hooks/                                  # Custom React hooks
│   │
│   ├── layouts/                                # Layout components
│   │   ├── DashboardLayout.tsx                # Admin dashboard layout
│   │   └── PublicLayout.tsx                   # Public pages layout
│   │
│   ├── pages/                                  # Page components
│   │   ├── admin/                             # Admin pages
│   │   │   ├── AdminAgentsPage.tsx           # Agent management
│   │   │   ├── AdminAnalyticsPage.tsx        # Analytics dashboard
│   │   │   ├── AdminDashboard.tsx            # Main dashboard
│   │   │   ├── AdminLeadsPage.tsx            # Lead management
│   │   │   └── AdminPropertiesPage.tsx       # Property management
│   │   │
│   │   ├── AboutPage.tsx                      # About us page
│   │   ├── ContactPage.tsx                    # Contact form page
│   │   ├── HomePage.tsx                       # Landing page
│   │   ├── LoginPage.tsx                      # Login page
│   │   ├── PropertiesPage.tsx                 # Property listing
│   │   └── PropertyDetailPage.tsx             # Property details
│   │
│   ├── services/                               # API service layer
│   │   ├── adminService.ts                    # Admin API calls
│   │   ├── api.ts                             # Axios instance
│   │   ├── authService.ts                     # Authentication API
│   │   ├── contactService.ts                  # Contact form API
│   │   ├── leadService.ts                     # Lead API calls
│   │   └── propertyService.ts                 # Property API calls
│   │
│   ├── types/                                  # TypeScript types
│   │   └── index.ts                           # Type definitions
│   │
│   ├── utils/                                  # Utility functions
│   │
│   ├── App.tsx                                 # Main App component
│   ├── index.css                               # Global styles (Tailwind)
│   └── main.tsx                                # React entry point
│
├── public/                                     # Public assets
│   └── vite.svg                               # Vite logo
│
├── .dockerignore                               # Docker ignore patterns
├── .env                                        # Environment variables (local)
├── .env.example                                # Environment template
├── .env.production                             # Production env vars
├── .gitignore                                  # Git ignore patterns
├── Dockerfile                                  # Docker build config
├── eslint.config.js                            # ESLint configuration
├── index.html                                  # HTML entry point
├── nginx.conf                                  # Nginx config for Docker
├── package.json                                # NPM dependencies
├── package-lock.json                           # NPM lock file
├── README.md                                   # Frontend documentation
├── tsconfig.json                               # TypeScript config
├── tsconfig.app.json                           # App TypeScript config
├── tsconfig.node.json                          # Node TypeScript config
├── vercel.json                                 # Vercel deployment config
└── vite.config.ts                              # Vite build config
```

---

## 📚 Documentation Files

```
root/
├── DEPLOYMENT_STATUS.md                        # Current deployment status
├── DEPLOYMENT_VERIFICATION.md                  # Deployment verification steps
├── DOCKER_DEPLOYMENT.md                        # Docker deployment guide
├── DOCKER_QUICKSTART.md                        # Quick Docker setup
├── DOCUMENTATION_INDEX.md                      # Documentation index
├── PRODUCTION_DEPLOYMENT_CHECKLIST.md          # Production checklist
├── PRODUCTION_IMPLEMENTATION_GUIDE.md          # Production guide
├── PRODUCTION_READY_SUMMARY.md                 # Production summary
├── QUICK_DEPLOYMENT_REFERENCE.md               # Quick reference
├── README.md                                   # Main project README
├── REFACTORING_PLAN.md                         # Refactoring plan
├── RENDER_ENV_SETUP.md                         # Render environment setup
├── RENDER_FINAL_FIX.md                         # Render fixes
├── RENDER_HEALTH_CHECK_FIX.md                  # Health check fixes
├── RENDER_MANUAL_REDEPLOY.md                   # Manual redeploy guide
├── RENDER_SENDGRID_SETUP.md                    # SendGrid setup on Render
├── SCHEDULER_STATUS.md                         # Scheduler status
├── SECURITY_INCIDENT_RESPONSE.md               # Security incident guide
├── SENDGRID_MIGRATION_SUMMARY.md               # SendGrid migration summary
├── SENDGRID_SUCCESS.md                         # SendGrid test results
├── SETUP.md                                    # Initial setup guide
├── START_HERE.md                               # Getting started guide
├── TESTING_GUIDE.md                            # Testing guide
├── TEST_EMAIL_SCHEDULER_NOW.md                 # Email scheduler testing
├── TEST_SCHEDULER.md                           # Scheduler testing
├── TEST_SENDGRID_EMAIL.md                      # SendGrid testing guide
├── UPDATE_SENDER_EMAIL.md                      # Update sender email guide
└── URGENT_SENDGRID_SETUP.md                    # Urgent SendGrid setup
```

---

## 🐳 Docker & Deployment

```
root/
├── docker-compose.yml                          # Multi-container orchestration
├── render.yaml                                 # Render.com deployment config
├── .github/workflows/
│   └── deploy.yml                             # GitHub Actions CI/CD
└── test-sendgrid.sh                           # SendGrid test script
```

---

## 🔑 Key Technologies

### Backend
- **Framework:** Spring Boot 3.2.3
- **Language:** Java 17
- **Database:** PostgreSQL (Neon)
- **ORM:** Hibernate/JPA
- **Security:** Spring Security + JWT
- **Email:** SendGrid API
- **PDF:** iText 5.5.13
- **Rate Limiting:** Bucket4j
- **API Docs:** Swagger/OpenAPI
- **Build:** Maven

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router
- **State:** React Context API

### Deployment
- **Backend:** Render.com (Docker)
- **Frontend:** Vercel
- **Database:** Neon PostgreSQL
- **Email:** SendGrid
- **CI/CD:** GitHub Actions

---

## 📊 Database Schema

### Tables
1. **users** - User accounts (Admin, Agent)
2. **properties** - Property listings
3. **leads** - Customer inquiries
4. **lead_status_history** - Lead status audit trail
5. **contacts** - Contact form submissions

### Relationships
- User (1) → (N) Leads (assigned agent)
- Property (1) → (N) Leads (interested property)
- Lead (1) → (N) LeadStatusHistory (audit trail)

---

## 🚀 Deployment URLs

- **Backend API:** https://realestatecrm-backend-yn5j.onrender.com
- **Frontend:** https://realestatecrms-tau.vercel.app
- **API Docs:** https://realestatecrm-backend-yn5j.onrender.com/swagger-ui.html

---

## 📧 Email Features

### SendGrid Integration
- Contact form emails (admin notification + user confirmation)
- Lead inquiry emails (admin notification + user confirmation)
- Daily property recommendations (9:00 AM)
- HTML email templates with company branding

### Email Templates
- Professional gradient design
- Responsive layout
- WhatsApp integration
- Call-to-action buttons
- Company contact information

---

## 🔐 Security Features

- JWT authentication
- Password encryption (BCrypt)
- Rate limiting (5 login attempts/minute)
- CORS configuration
- Account locking after failed attempts
- Role-based access control (ADMIN, AGENT)

---

## 📈 Production Features

1. **Pagination** - All list endpoints support pagination
2. **Rate Limiting** - Login endpoint protected
3. **Lead Status History** - Complete audit trail
4. **Enhanced Validation** - Input validation on all forms
5. **Property Search** - Advanced filtering
6. **Email Automation** - Daily property recommendations
7. **Docker Support** - Multi-stage builds
8. **Health Checks** - Spring Boot Actuator
9. **PDF Reports** - Lead report generation
10. **Analytics Dashboard** - Real-time statistics

---

## 🎯 Total File Count

- **Backend Java Files:** ~55 files
- **Frontend TypeScript Files:** ~30 files
- **Documentation Files:** ~30 files
- **Configuration Files:** ~20 files

**Total:** ~135+ files

---

**Last Updated:** March 7, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
