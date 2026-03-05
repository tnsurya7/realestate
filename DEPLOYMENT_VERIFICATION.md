# 🔍 Production Deployment Verification Guide

## Quick Verification Checklist

### Step 1: Backend Health Check
```bash
# Test health endpoint
curl https://realestatecrm-api.onrender.com/api/health

# Expected: {"status":"UP","service":"RealEstateCRM API","timestamp":"..."}
```

### Step 2: Frontend Access
```bash
# Open in browser
https://realestatecrm.vercel.app

# Should load without errors
```

### Step 3: Authentication Test
```bash
# Login with admin credentials
curl -X POST https://realestatecrm-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@realestatecrm.com",
    "password":"Admin@123"
  }'

# Expected: JWT token in response
```

### Step 4: Properties API
```bash
# Get properties list
curl https://realestatecrm-api.onrender.com/api/properties

# Expected: Array of properties
```

### Step 5: Admin Dashboard
```bash
# Get analytics (requires JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://realestatecrm-api.onrender.com/api/admin/analytics

# Expected: Analytics data
```

### Step 6: Email Scheduler
```bash
# Trigger scheduler manually (requires JWT token)
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://realestatecrm-api.onrender.com/api/admin/scheduler/trigger-recommendations

# Expected: Emails sent to NEW leads
```

### Step 7: Rate Limiting
```bash
# Test rate limiting (5 attempts per minute)
for i in {1..6}; do
  curl -X POST https://realestatecrm-api.onrender.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "Attempt $i"
done

# 6th attempt should return 429 Too Many Requests
```

### Step 8: CORS Test
```bash
# Test CORS from frontend domain
curl -H "Origin: https://realestatecrm.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://realestatecrm-api.onrender.com/api/properties

# Expected: CORS headers in response
```

---

## Environment Variables Verification

### Render Backend
Verify these are set in Render Dashboard:
- [ ] DATABASE_URL
- [ ] DATABASE_USERNAME
- [ ] DATABASE_PASSWORD
- [ ] MAIL_USERNAME
- [ ] MAIL_PASSWORD
- [ ] JWT_SECRET
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD
- [ ] CORS_ALLOWED_ORIGINS

### Vercel Frontend
Verify these are set in Vercel Dashboard:
- [ ] VITE_API_URL=https://realestatecrm-api.onrender.com/api
- [ ] VITE_CONTACT_PHONE
- [ ] VITE_CONTACT_EMAIL
- [ ] VITE_COMPANY_NAME

---

## Common Issues & Solutions

### Issue: Backend returns 502 Bad Gateway
**Solution**: 
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Verify all required environment variables are set
- Restart the service

### Issue: Frontend can't connect to backend
**Solution**:
- Verify VITE_API_URL in Vercel
- Check CORS_ALLOWED_ORIGINS includes Vercel domain
- Test health endpoint: `curl https://realestatecrm-api.onrender.com/api/health`

### Issue: Email not sending
**Solution**:
- Verify Gmail app password (16 chars)
- Check 2FA is enabled on Gmail
- Verify MAIL_USERNAME and MAIL_PASSWORD in Render
- Check spam folder

### Issue: Scheduler not running
**Solution**:
- Verify UptimeRobot is pinging health endpoint
- Check Render logs for scheduler errors
- Manually trigger: `POST /api/admin/scheduler/trigger-recommendations`

### Issue: Rate limiting too strict
**Solution**:
- Current: 5 login attempts per minute per IP
- Adjust in `RateLimitingFilter.java` if needed
- Redeploy to Render

---

## Performance Monitoring

### Check Response Times
```bash
# Measure API response time
time curl https://realestatecrm-api.onrender.com/api/properties

# Should be < 500ms
```

### Monitor Database
- Go to Neon Console
- Check connection count
- Monitor query performance

### Monitor Frontend
- Open DevTools (F12)
- Check Network tab
- Monitor bundle size

---

## Security Verification

- [ ] No hardcoded credentials in code
- [ ] All secrets in environment variables
- [ ] HTTPS enforced (Render/Vercel provide SSL)
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting enabled
- [ ] JWT secret is 32+ characters
- [ ] Health endpoint is public
- [ ] Admin endpoints require ROLE_ADMIN
- [ ] Agent endpoints require ROLE_AGENT

---

## Rollback Plan

If deployment fails:

### Rollback Backend (Render)
1. Go to Render Dashboard
2. Click on service
3. Go to "Deploys"
4. Click "Redeploy" on previous successful deployment

### Rollback Frontend (Vercel)
1. Go to Vercel Dashboard
2. Click on project
3. Go to "Deployments"
4. Click "Promote to Production" on previous deployment

---

## Post-Deployment Tasks

- [ ] Setup UptimeRobot monitoring
- [ ] Configure email alerts
- [ ] Setup Slack notifications
- [ ] Document admin credentials (secure location)
- [ ] Create backup of database
- [ ] Setup database backups (Neon)
- [ ] Monitor logs for errors
- [ ] Test all critical workflows
- [ ] Announce to users

---

**Last Updated**: March 5, 2026
