# 🚀 RealEstateCRM Production Deployment Checklist

## Project Overview
- **Frontend**: React 18 + Vite → Vercel
- **Backend**: Java 17 + Spring Boot 3 → Render
- **Database**: PostgreSQL (Neon)
- **Email**: Gmail SMTP
- **Monitoring**: UptimeRobot

---

## ✅ PHASE 1: FRONTEND CONFIGURATION

### 1.1 Environment Variables
**File**: `frontend/.env.production`
```env
VITE_API_URL=https://realestatecrm-api.onrender.com/api
VITE_CONTACT_PHONE=9360004968
VITE_CONTACT_EMAIL=suryakumar56394@gmail.com
VITE_COMPANY_NAME=RealEstate CRM
```

### 1.2 Axios Configuration
**File**: `frontend/src/services/api.ts`
- ✅ Base URL from environment variable
- ✅ JWT token in Authorization header
- ✅ Error handling with 401 redirect to login
- ✅ Loading states on all API calls

### 1.3 Vercel Deployment
**Steps**:
1. Connect GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://realestatecrm-api.onrender.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`

---

## ✅ PHASE 2: BACKEND CONFIGURATION

### 2.1 Application Properties
**File**: `backend/src/main/resources/application.properties`
```properties
# Server
server.port=${PORT:8080}

# Database
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# JWT
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=https://realestatecrm.vercel.app

# Logging
logging.level.root=INFO
logging.level.com.realestatecrm=DEBUG
```

### 2.2 Security Configuration
- ✅ JWT authentication enabled
- ✅ Role-based access control (ADMIN, AGENT)
- ✅ Public endpoints: /api/auth/login, /api/leads, /api/properties
- ✅ Protected endpoints: /api/admin/**, /api/agent/**
- ✅ Rate limiting on login endpoint (5 requests/minute)

### 2.3 Render Deployment
**Build Command**:
```bash
mvn clean package
```

**Start Command**:
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Environment Variables** (Set in Render Dashboard):
```
DATABASE_URL=postgresql://user:password@host:5432/database
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=8080
```

---

## ✅ PHASE 3: EMAIL CONFIGURATION

### 3.1 Gmail SMTP Setup
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password (16 characters)
3. Set environment variables:
   - `MAIL_USERNAME=your-email@gmail.com`
   - `MAIL_PASSWORD=your-app-password`

### 3.2 Email Features
- ✅ Lead notification email to admin
- ✅ Contact form notification
- ✅ Lead confirmation email to customer
- ✅ Daily property recommendations (9 AM)
- ✅ HTML email templates

---

## ✅ PHASE 4: SCHEDULED JOBS

### 4.1 Email Scheduler
- ✅ Runs daily at 9:00 AM
- ✅ Sends property recommendations to NEW leads
- ✅ Prevents duplicate emails (checks lastEmailSentDate)
- ✅ Matches properties within lead budget

### 4.2 Configuration
```java
@EnableScheduling
@Scheduled(cron = "0 0 9 * * ?")
public void sendDailyPropertyRecommendations() {
    // Implementation
}
```

---

## ✅ PHASE 5: HEALTH CHECK ENDPOINT

### 5.1 Endpoint
```
GET /api/health
Response: {"status":"UP"}
```

### 5.2 UptimeRobot Configuration
- **URL**: `https://realestatecrm-api.onrender.com/api/health`
- **Interval**: 5 minutes
- **Purpose**: Prevent Render backend from sleeping

---

## ✅ PHASE 6: API ENDPOINTS VERIFICATION

### Public Endpoints
- ✅ `POST /api/auth/login` - User authentication
- ✅ `POST /api/leads` - Create lead
- ✅ `GET /api/properties` - List properties
- ✅ `GET /api/properties/{id}` - Property details
- ✅ `POST /api/contact` - Contact form

### Admin Endpoints
- ✅ `GET /api/admin/leads` - List leads (paginated)
- ✅ `GET /api/admin/properties` - List properties (paginated)
- ✅ `GET /api/admin/analytics` - Dashboard analytics
- ✅ `GET /api/admin/report` - PDF report download
- ✅ `POST /api/admin/scheduler/trigger-recommendations` - Manual scheduler trigger

### Agent Endpoints
- ✅ `GET /api/agent/leads` - My assigned leads
- ✅ `PATCH /api/agent/leads/{id}/status` - Update lead status

---

## ✅ PHASE 7: DOCKER CONFIGURATION

### 7.1 Backend Dockerfile
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
```

### 7.2 Build & Run
```bash
# Build
docker build -t realestatecrm-backend .

# Run
docker run -p 8080:8080 \
  -e DATABASE_URL=postgresql://... \
  -e MAIL_USERNAME=... \
  -e MAIL_PASSWORD=... \
  -e JWT_SECRET=... \
  realestatecrm-backend
```

---

## ✅ PHASE 8: CI/CD PIPELINE

### 8.1 GitHub Actions Workflow
**File**: `.github/workflows/deploy.yml`
- ✅ Trigger on push to main
- ✅ Build backend with Maven
- ✅ Run tests
- ✅ Deploy to Render (optional)

---

## ✅ PHASE 9: SECURITY CHECKLIST

- ✅ No hardcoded credentials
- ✅ All secrets in environment variables
- ✅ JWT secret minimum 32 characters
- ✅ HTTPS enforced in production
- ✅ CORS restricted to frontend domain
- ✅ Rate limiting on sensitive endpoints
- ✅ SQL injection prevention (JPA)
- ✅ XSS prevention (React escaping)
- ✅ CSRF protection enabled
- ✅ Password hashing with BCrypt

---

## ✅ PHASE 10: MONITORING & LOGGING

### 10.1 Logging Configuration
- ✅ SLF4J + Logback
- ✅ INFO level for production
- ✅ DEBUG level for application code
- ✅ Error tracking and alerting

### 10.2 UptimeRobot Monitoring
- ✅ Health check every 5 minutes
- ✅ Alert on downtime
- ✅ Prevent Render sleep

---

## ✅ PHASE 11: PERFORMANCE OPTIMIZATION

### 11.1 Frontend
- ✅ Code splitting with Vite
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ Minified CSS/JS

### 11.2 Backend
- ✅ Database connection pooling (HikariCP)
- ✅ Query optimization with pagination
- ✅ Caching where applicable
- ✅ Gzip compression enabled

---

## ✅ PHASE 12: ERROR HANDLING

### 12.1 Global Exception Handler
- ✅ Consistent error response format
- ✅ Proper HTTP status codes
- ✅ User-friendly error messages
- ✅ Logging of errors

### 12.2 Frontend Error Handling
- ✅ Toast notifications for errors
- ✅ 401 redirect to login
- ✅ Network error handling
- ✅ Validation error display

---

## 📋 DEPLOYMENT STEPS

### Step 1: Prepare Backend
```bash
cd backend
mvn clean package
```

### Step 2: Deploy to Render
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variables
4. Build command: `mvn clean package`
5. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
6. Deploy

### Step 3: Deploy Frontend to Vercel
1. Connect GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://realestatecrm-api.onrender.com/api`
3. Deploy

### Step 4: Setup UptimeRobot
1. Create HTTP monitor
2. URL: `https://realestatecrm-api.onrender.com/api/health`
3. Interval: 5 minutes
4. Enable notifications

### Step 5: Verify Deployment
```bash
# Test backend
curl https://realestatecrm-api.onrender.com/api/health

# Test frontend
open https://realestatecrm.vercel.app

# Test login
curl -X POST https://realestatecrm-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## 🔍 FINAL VERIFICATION CHECKLIST

- [ ] Frontend environment variables set
- [ ] Backend application.properties configured
- [ ] Database connection working
- [ ] Email SMTP configured
- [ ] JWT secret set (32+ characters)
- [ ] CORS configured for frontend domain
- [ ] Health check endpoint working
- [ ] All API endpoints tested
- [ ] Error handling working
- [ ] Logging configured
- [ ] Rate limiting enabled
- [ ] Docker image builds successfully
- [ ] GitHub Actions workflow configured
- [ ] UptimeRobot monitoring active
- [ ] SSL/HTTPS enforced
- [ ] No hardcoded credentials
- [ ] Scheduled jobs running
- [ ] Email sending working
- [ ] PDF report generation working
- [ ] Analytics dashboard loading

---

## 📞 SUPPORT

If deployment fails:
1. Check Render logs: `https://dashboard.render.com`
2. Check Vercel logs: `https://vercel.com/dashboard`
3. Verify environment variables are set correctly
4. Check database connection
5. Verify email credentials
6. Check JWT secret format

---

**Status**: ✅ Ready for Production Deployment
**Last Updated**: March 5, 2026
