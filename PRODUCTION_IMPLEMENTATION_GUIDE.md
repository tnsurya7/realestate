# 🚀 RealEstateCRM Production Implementation Guide

## Overview
This guide covers the complete production deployment setup for RealEstateCRM across Render (backend), Vercel (frontend), and Neon (database).

---

## 📋 PHASE 1: BACKEND SETUP ON RENDER

### 1.1 Prerequisites
- Render account (https://render.com)
- GitHub repository connected to Render
- Neon PostgreSQL database (https://neon.tech)
- Gmail account with App Password

### 1.2 Environment Variables for Render
Set these in Render Dashboard → Environment:

```
# Database (from Neon)
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/database
DATABASE_USERNAME=user
DATABASE_PASSWORD=password

# Email (Gmail App Password)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password

# JWT Secret (generate: openssl rand -base64 32)
JWT_SECRET=your-super-secret-key-min-32-chars

# Admin Credentials
ADMIN_EMAIL=admin@realestatecrm.com
ADMIN_PASSWORD=Admin@123

# Contact Information
CONTACT_PHONE=9360004968
CONTACT_EMAIL=suryakumar56394@gmail.com
COMPANY_NAME=RealEstate CRM
COMPANY_ADDRESS=Anna Nagar, Chennai – 600040

# CORS
CORS_ALLOWED_ORIGINS=https://realestatecrm.vercel.app

# Port (Render sets this automatically)
PORT=8080
```

### 1.3 Render Deployment Steps
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: realestatecrm-backend
   - **Runtime**: Java 17
   - **Build Command**: `mvn clean package`
   - **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
   - **Plan**: Standard (or higher)
5. Add all environment variables from section 1.2
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)

### 1.4 Verify Backend Deployment
```bash
# Test health endpoint
curl https://realestatecrm-api.onrender.com/api/health

# Expected response:
# {"status":"UP","service":"RealEstateCRM API","timestamp":"1234567890"}

# Test login endpoint
curl -X POST https://realestatecrm-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestatecrm.com","password":"Admin@123"}'
```

---

## 📋 PHASE 2: FRONTEND SETUP ON VERCEL

### 2.1 Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected to Vercel

### 2.2 Environment Variables for Vercel
Set these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://realestatecrm-api.onrender.com/api
VITE_CONTACT_PHONE=9360004968
VITE_CONTACT_EMAIL=suryakumar56394@gmail.com
VITE_COMPANY_NAME=RealEstate CRM
```

### 2.3 Vercel Deployment Steps
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables from section 2.2
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)

### 2.4 Verify Frontend Deployment
```bash
# Open in browser
https://realestatecrm.vercel.app

# Test login with admin credentials
Email: admin@realestatecrm.com
Password: Admin@123
```

---

## 📋 PHASE 3: DATABASE SETUP ON NEON

### 3.1 Create PostgreSQL Database
1. Go to https://console.neon.tech
2. Create new project
3. Copy connection string: `postgresql://user:password@host:5432/database`
4. Use this as `DATABASE_URL` in Render environment variables

### 3.2 Database Initialization
- Spring Boot automatically creates tables via `spring.jpa.hibernate.ddl-auto=update`
- Admin user is seeded via `DataSeeder.java`
- No manual SQL scripts needed

---

## 📋 PHASE 4: EMAIL CONFIGURATION

### 4.1 Gmail App Password Setup
1. Enable 2-Factor Authentication on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Generate 16-character app password
5. Copy and set as `MAIL_PASSWORD` in Render

### 4.2 Email Features
- ✅ Lead notifications to admin
- ✅ Contact form notifications
- ✅ Daily property recommendations (9 AM)
- ✅ HTML email templates

---

## 📋 PHASE 5: SCHEDULED JOBS

### 5.1 Email Scheduler
- **Runs**: Daily at 9:00 AM UTC
- **Function**: Sends property recommendations to NEW leads
- **Trigger**: Manual via `POST /api/admin/scheduler/trigger-recommendations`

### 5.2 Manual Trigger (Testing)
```bash
curl -X POST https://realestatecrm-api.onrender.com/api/admin/scheduler/trigger-recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 PHASE 6: MONITORING WITH UPTIMEROBOT

### 6.1 Setup UptimeRobot
1. Go to https://uptimerobot.com
2. Create new HTTP monitor
3. Configure:
   - **URL**: `https://realestatecrm-api.onrender.com/api/health`
   - **Interval**: 5 minutes
   - **Timeout**: 30 seconds
4. Enable notifications (email/Slack)

### 6.2 Why UptimeRobot?
- Prevents Render backend from sleeping (free tier sleeps after 15 min inactivity)
- Keeps scheduled jobs running
- Alerts on downtime

---

## 📋 PHASE 7: API ENDPOINTS REFERENCE

### Public Endpoints (No Auth Required)
```
POST   /api/auth/login                    - User login
POST   /api/leads                         - Create lead
GET    /api/properties                    - List properties
GET    /api/properties/{id}               - Property details
POST   /api/contact                       - Contact form
GET    /api/health                        - Health check
```

### Admin Endpoints (Requires ROLE_ADMIN)
```
GET    /api/admin/leads                   - List leads (paginated)
GET    /api/admin/leads/all               - List leads (simple array)
GET    /api/admin/leads/{id}              - Lead details
GET    /api/admin/leads/{id}/history      - Lead status history
PATCH  /api/admin/leads/{id}/status       - Update lead status
PATCH  /api/admin/leads/{id}/assign       - Assign agent
GET    /api/admin/properties              - List properties (paginated)
GET    /api/admin/properties/all          - List properties (simple array)
POST   /api/admin/properties              - Create property
GET    /api/admin/analytics               - Dashboard analytics
GET    /api/admin/report                  - PDF report download
POST   /api/admin/scheduler/trigger-recommendations - Manual scheduler trigger
```

### Agent Endpoints (Requires ROLE_AGENT)
```
GET    /api/agent/leads                   - My assigned leads
GET    /api/agent/leads/{id}              - Lead details
PATCH  /api/agent/leads/{id}/status       - Update lead status
PATCH  /api/agent/leads/{id}/notes        - Add notes to lead
```

---

## 📋 PHASE 8: SECURITY CHECKLIST

- ✅ No hardcoded credentials (all in environment variables)
- ✅ JWT secret minimum 32 characters
- ✅ HTTPS enforced (Render/Vercel provide SSL)
- ✅ CORS restricted to frontend domain
- ✅ Rate limiting on login (5 attempts/minute)
- ✅ SQL injection prevention (JPA)
- ✅ XSS prevention (React escaping)
- ✅ CSRF protection enabled
- ✅ Password hashing with BCrypt
- ✅ Health check endpoint public (for monitoring)

---

## 📋 PHASE 9: TROUBLESHOOTING

### Backend Won't Start
```bash
# Check Render logs
# Look for database connection errors
# Verify DATABASE_URL format: postgresql://user:password@host:5432/db
```

### Email Not Sending
```bash
# Verify Gmail app password (16 chars, not regular password)
# Check MAIL_USERNAME and MAIL_PASSWORD in Render
# Verify 2FA is enabled on Gmail account
```

### Frontend Can't Connect to Backend
```bash
# Verify VITE_API_URL in Vercel environment
# Check CORS_ALLOWED_ORIGINS includes Vercel domain
# Test: curl https://realestatecrm-api.onrender.com/api/health
```

### Scheduler Not Running
```bash
# Verify UptimeRobot is pinging health endpoint
# Check Render logs for scheduler errors
# Manually trigger: POST /api/admin/scheduler/trigger-recommendations
```

---

## 📋 PHASE 10: PERFORMANCE OPTIMIZATION

### Frontend
- ✅ Code splitting with Vite
- ✅ Image optimization
- ✅ Lazy loading components
- ✅ Minified CSS/JS

### Backend
- ✅ Database connection pooling (HikariCP)
- ✅ Query optimization with pagination
- ✅ Gzip compression enabled
- ✅ Caching where applicable

---

## 📋 PHASE 11: DEPLOYMENT CHECKLIST

Before going live, verify:

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Database connected (Neon)
- [ ] Health endpoint responding
- [ ] Login working
- [ ] Properties loading
- [ ] Email sending
- [ ] Scheduler running
- [ ] UptimeRobot monitoring active
- [ ] No hardcoded credentials
- [ ] CORS configured correctly
- [ ] JWT secret set (32+ chars)
- [ ] Rate limiting enabled
- [ ] Error handling working
- [ ] Logging configured

---

## 📞 SUPPORT

### Render Dashboard
- https://dashboard.render.com
- View logs, restart service, manage environment variables

### Vercel Dashboard
- https://vercel.com/dashboard
- View logs, manage environment variables, rollback deployments

### Neon Console
- https://console.neon.tech
- Manage database, view connection strings

### UptimeRobot Dashboard
- https://uptimerobot.com
- View monitoring status, configure alerts

---

## 🎯 FINAL ARCHITECTURE

```
User Browser
    ↓
Vercel (React Frontend)
    ↓
Render (Spring Boot Backend)
    ↓
Neon PostgreSQL Database
    ↓
Gmail SMTP Email Service
```

---

**Status**: ✅ Production Ready
**Last Updated**: March 5, 2026
**Deployment Time**: ~15 minutes
