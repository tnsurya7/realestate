# ⚡ Quick Deployment Reference Card

## 🎯 5-Minute Deployment Checklist

### Step 1: Render Backend (5 min)
```
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Name: realestatecrm-backend
5. Runtime: Java 17
6. Build: mvn clean package
7. Start: java -jar target/backend-0.0.1-SNAPSHOT.jar
8. Add Environment Variables (see below)
9. Click "Create Web Service"
```

**Environment Variables for Render:**
```
DATABASE_URL=postgresql://user:password@host:5432/db
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
JWT_SECRET=your-32-char-secret
ADMIN_EMAIL=admin@realestatecrm.com
ADMIN_PASSWORD=Admin@123
CORS_ALLOWED_ORIGINS=https://realestatecrm.vercel.app
CONTACT_PHONE=9360004968
CONTACT_EMAIL=suryakumar56394@gmail.com
COMPANY_NAME=RealEstate CRM
COMPANY_ADDRESS=Anna Nagar, Chennai – 600040
```

### Step 2: Vercel Frontend (2 min)
```
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import GitHub repository
4. Framework: Vite
5. Build: npm run build
6. Output: dist
7. Add Environment Variables (see below)
8. Click "Deploy"
```

**Environment Variables for Vercel:**
```
VITE_API_URL=https://realestatecrm-api.onrender.com/api
VITE_CONTACT_PHONE=9360004968
VITE_CONTACT_EMAIL=suryakumar56394@gmail.com
VITE_COMPANY_NAME=RealEstate CRM
```

### Step 3: UptimeRobot Monitoring (2 min)
```
1. Go to https://uptimerobot.com
2. Create new HTTP monitor
3. URL: https://realestatecrm-api.onrender.com/api/health
4. Interval: 5 minutes
5. Enable notifications
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Backend | https://realestatecrm-api.onrender.com |
| Frontend | https://realestatecrm.vercel.app |
| Health Check | https://realestatecrm-api.onrender.com/api/health |
| Swagger Docs | https://realestatecrm-api.onrender.com/swagger-ui.html |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Neon Console | https://console.neon.tech |
| UptimeRobot | https://uptimerobot.com |

---

## 🧪 Quick Tests

### Test Backend Health
```bash
curl https://realestatecrm-api.onrender.com/api/health
```

### Test Login
```bash
curl -X POST https://realestatecrm-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestatecrm.com","password":"Admin@123"}'
```

### Test Properties
```bash
curl https://realestatecrm-api.onrender.com/api/properties
```

### Test Frontend
```
Open: https://realestatecrm.vercel.app
```

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files
- ✅ Use environment variables for all secrets
- ✅ JWT secret must be 32+ characters
- ✅ Gmail app password (16 chars, not regular password)
- ✅ CORS restricted to frontend domain only
- ✅ Rate limiting: 5 login attempts per minute

---

## 📊 Architecture

```
Browser → Vercel (Frontend) → Render (Backend) → Neon (Database)
                                    ↓
                            Gmail (Email)
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Render logs, verify DATABASE_URL |
| Frontend can't connect | Verify VITE_API_URL, check CORS settings |
| Email not sending | Verify Gmail app password, check 2FA |
| Scheduler not running | Verify UptimeRobot is pinging health endpoint |
| Rate limiting too strict | Adjust in RateLimitingFilter.java |

---

## 📝 Admin Credentials

```
Email: admin@realestatecrm.com
Password: Admin@123
```

---

## 🎯 Key Endpoints

### Public
- `POST /api/auth/login` - Login
- `GET /api/properties` - List properties
- `POST /api/leads` - Create lead
- `GET /api/health` - Health check

### Admin (Requires ROLE_ADMIN)
- `GET /api/admin/leads` - List leads
- `GET /api/admin/properties` - List properties
- `GET /api/admin/analytics` - Dashboard
- `GET /api/admin/report` - PDF report
- `POST /api/admin/scheduler/trigger-recommendations` - Manual scheduler

---

## ⏱️ Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Backend Deploy | 5 min | ⏳ |
| Frontend Deploy | 2 min | ⏳ |
| Database Setup | 0 min | ✅ (Already done) |
| Email Setup | 0 min | ✅ (Already done) |
| Monitoring Setup | 2 min | ⏳ |
| **Total** | **~10 min** | ⏳ |

---

## 📞 Support

- Render Issues: https://dashboard.render.com (check logs)
- Vercel Issues: https://vercel.com/dashboard (check logs)
- Database Issues: https://console.neon.tech
- Email Issues: https://myaccount.google.com/apppasswords

---

**Last Updated**: March 5, 2026
**Status**: ✅ Ready to Deploy
