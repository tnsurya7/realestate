# 🔧 Render Environment Variables Setup

## ✅ Backend Build Successful!

Your Docker build passed. Now we just need to add the missing environment variables.

---

## 📋 Environment Variables to Add to Render

Go to: **Render Dashboard → realestatecrm-backend → Environment**

Add these 12 variables:

### Database Configuration (3 variables)
```
DB_URL=jdbc:postgresql://ep-muddy-band-a153s2x2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channelBinding=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_QUJrvbdZH54G
```

### Email Configuration (2 variables)
```
MAIL_USERNAME=suryakumar56394@gmail.com
MAIL_PASSWORD=dhzrepymrheybspc
```

### JWT & Admin (3 variables)
```
JWT_SECRET=AKTfVwhJZfNp4gJ3mQgTKXRXzdFnZ7mMeyEw74PrWaE=
ADMIN_EMAIL=suryakumar56394@gmail.com
ADMIN_PASSWORD=Surya@777
```

### CORS & Contact (4 variables)
```
CORS_ALLOWED_ORIGINS=https://realestatecrm.vercel.app
CONTACT_PHONE=9360004968
CONTACT_EMAIL=suryakumar56394@gmail.com
COMPANY_NAME=RealEstate CRM
```

---

## 🚀 Steps to Add Variables

1. Go to Render Dashboard
2. Click on **realestatecrm-backend**
3. Click **Environment** tab
4. Click **Add Environment Variable**
5. For each variable:
   - **NAME**: (e.g., `DB_URL`)
   - **VALUE**: (paste value from above)
   - Click **Add**
6. Repeat for all 12 variables

---

## ✅ After Adding Variables

1. Click **Manual Deploy**
2. Wait 5-10 minutes for rebuild
3. Check logs for success

Expected logs:
```
HikariPool-1 - Starting...
Connected to PostgreSQL
Tomcat started on port 8080
Started RealEstateCrmApplication
```

---

## 🧪 Test After Deploy

```bash
# Test health endpoint
curl https://realestatecrm-backend-yn5j.onrender.com/api/health

# Expected response:
# {"status":"UP","service":"RealEstateCRM API","timestamp":"..."}
```

---

## 📊 Deployment Status

| Step | Status |
|------|--------|
| Docker build | ✅ Success |
| Spring Boot compile | ✅ Success |
| Jar build | ✅ Success |
| Container start | ✅ Success |
| Database connection | ⏳ Pending (add env vars) |

---

## 🎯 Next After Backend Works

1. ✅ Backend deployed to Render
2. ⏳ Add environment variables
3. ⏳ Deploy frontend to Vercel
4. ⏳ Setup UptimeRobot monitoring

---

**Status**: Backend ready, just need env variables
**Time to fix**: 2 minutes
