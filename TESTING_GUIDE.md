# Testing Guide - All Production Features

Both frontend and backend are now running locally! Here's how to test all the new features.

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

## 🔐 Login Credentials

- **Email**: suryakumar56394@gmail.com
- **Password**: Surya@777

## ✅ Feature Testing Checklist

### 1. Pagination Support ✅

**Test Leads Pagination:**
1. Go to Admin Dashboard → Leads
2. Open browser DevTools → Network tab
3. Look for API call to `/api/admin/leads?page=0&size=10`
4. Verify response includes pagination metadata:
   ```json
   {
     "content": [...],
     "totalElements": 50,
     "totalPages": 5,
     "size": 10,
     "number": 0
   }
   ```

**Test Properties Pagination:**
1. Go to Properties page
2. Check Network tab for `/api/properties?page=0&size=10`
3. Verify pagination controls work (if implemented in UI)

**API Testing (Swagger):**
- Go to http://localhost:8080/swagger-ui.html
- Find `GET /api/admin/leads`
- Try parameters: `page=0`, `size=5`, `sortBy=createdAt`, `direction=DESC`

### 2. Rate Limiting ✅

**Test Login Rate Limit:**
1. Go to http://localhost:5173/login
2. Enter wrong password 6 times quickly
3. On the 6th attempt, you should see: "Too many requests. Try again later."
4. Wait 1 minute and try again - should work

**API Testing (curl):**
```bash
# Try 6 login attempts rapidly
for i in {1..6}; do
  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "\nAttempt $i"
done
```

Expected: 6th attempt returns 429 status code

### 3. Lead Status History Tracking ✅

**Test Status History:**
1. Login as Admin
2. Go to Leads page
3. Select a lead and change its status (NEW → CONTACTED → QUALIFIED)
4. Open browser DevTools → Network tab
5. Look for API call to `/api/admin/leads/{id}/history`
6. Verify response shows history:
   ```json
   [
     {
       "id": 1,
       "oldStatus": "NEW",
       "newStatus": "CONTACTED",
       "changedBy": "Super Admin",
       "changedAt": "2026-03-05T13:00:00"
     }
   ]
   ```

**API Testing (Swagger):**
- Go to Swagger UI
- Find `GET /api/admin/leads/{id}/history`
- Enter a lead ID and execute
- View complete audit trail

### 4. Enhanced Validation ✅

**Test Property Validation:**
1. Go to Admin Dashboard → Properties → Add Property
2. Try invalid inputs:
   - Title: "AB" (too short - min 3 chars)
   - Price: -1000 (negative - must be > 0)
   - Bedrooms: 25 (too many - max 20)
3. Verify error messages appear for each field

**Test Lead Validation:**
1. Go to Leads → Create Lead
2. Try invalid inputs:
   - Phone: "123" (must be 10 digits)
   - Email: "notanemail" (invalid format)
   - Budget: -5000 (must be positive)
3. Verify validation errors

**Test Contact Form:**
1. Go to public Contact page
2. Try:
   - Message: "Hi" (too short - min 10 chars)
   - Phone: "12345" (must be 10 digits)
3. Verify validation messages

### 5. Property Search Filters ✅

**Test Search Functionality:**
1. Go to Properties page (public or admin)
2. Use search filters:
   - City: "Chennai"
   - Type: "VILLA"
   - Price Range: 5000000 - 10000000
   - Bedrooms: 3
   - Status: "AVAILABLE"
3. Verify filtered results

**API Testing (Swagger):**
- Go to Swagger UI
- Find `GET /api/properties/search`
- Try parameters:
  ```
  city: Chennai
  type: VILLA
  minPrice: 5000000
  maxPrice: 10000000
  bedrooms: 3
  status: AVAILABLE
  page: 0
  size: 10
  ```

**Direct API Test:**
```bash
curl "http://localhost:8080/api/properties/search?city=Chennai&type=VILLA&minPrice=5000000&maxPrice=10000000&bedrooms=3&status=AVAILABLE&page=0&size=10"
```

### 6. Email Automation Scheduler ✅

**Test Scheduler (Manual Trigger):**
1. Login as Admin
2. Go to Swagger UI: http://localhost:8080/swagger-ui.html
3. Find `POST /api/admin/scheduler/trigger-recommendations`
4. Click "Try it out" → Execute
5. Check backend logs for:
   ```
   INFO: Starting daily property recommendation email scheduler
   INFO: Found X NEW leads for recommendations
   INFO: Sent 3 property recommendations to: customer@email.com
   ```

**Verify Email Sent:**
1. Check the email inbox for leads with status "NEW"
2. Email should contain:
   - Subject: "🏡 Property Recommendations Just for You"
   - Up to 3 property cards with details
   - Call-to-action buttons

**Check Logs:**
```bash
# In backend directory
tail -f logs/application.log | grep "recommendation"
```

**Automatic Scheduler:**
- Runs daily at 9:00 AM automatically
- Check logs tomorrow morning to verify

### 7. Docker Support ✅

**Test Docker Build:**
```bash
# Build backend
cd backend
docker build -t realestatecrm-backend .

# Build frontend
cd ../frontend
docker build -t realestatecrm-frontend .
```

**Test Docker Compose:**
```bash
# From project root
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080

# Stop services
docker-compose down
```

**Test Health Checks:**
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Expected response:
# {"status":"UP"}

# Frontend health (if using Docker)
curl http://localhost:5173/health
```

## 🧪 Additional API Tests

### Test Pagination with Different Parameters

```bash
# Get first page of leads
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8080/api/admin/leads?page=0&size=5"

# Get second page
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8080/api/admin/leads?page=1&size=5"

# Sort by different field
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8080/api/admin/leads?page=0&size=10&sortBy=customerName&direction=ASC"
```

### Test Lead Status History

```bash
# Update lead status
curl -X PATCH -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:8080/api/admin/leads/1/status?status=CONTACTED"

# Get status history
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8080/api/admin/leads/1/history"
```

### Test Property Search

```bash
# Search by city
curl "http://localhost:8080/api/properties/search?city=Chennai"

# Search by price range
curl "http://localhost:8080/api/properties/search?minPrice=5000000&maxPrice=10000000"

# Combined search
curl "http://localhost:8080/api/properties/search?city=Chennai&type=VILLA&bedrooms=3&status=AVAILABLE"
```

## 📊 Monitoring & Logs

### Backend Logs
```bash
# View real-time logs
cd backend
tail -f logs/application.log

# Search for specific features
grep "pagination" logs/application.log
grep "rate limit" logs/application.log
grep "status history" logs/application.log
grep "recommendation" logs/application.log
```

### Check Actuator Endpoints
```bash
# Health check
curl http://localhost:8080/actuator/health

# Application info
curl http://localhost:8080/actuator/info
```

## 🎯 Success Criteria

All features are working correctly if:

- ✅ Pagination: API returns paginated data with metadata
- ✅ Rate Limiting: 6th login attempt within 1 minute is blocked
- ✅ Status History: All status changes are tracked with user and timestamp
- ✅ Validation: Invalid inputs show appropriate error messages
- ✅ Search Filters: Properties are filtered correctly by all criteria
- ✅ Email Scheduler: Emails are sent to NEW leads with property recommendations
- ✅ Docker: Application runs successfully in containers

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check .env file
cat backend/.env | grep DB_

# Test database connection
psql "postgresql://username:password@host/database?sslmode=require"
```

**Email Not Sending:**
```bash
# Check email configuration
cat backend/.env | grep MAIL_

# Verify Gmail app password is correct
# Check backend logs for email errors
grep "email" backend/logs/application.log
```

### Frontend Issues

**API Connection Error:**
```bash
# Check frontend .env
cat frontend/.env | grep VITE_API_URL

# Should be: http://localhost:8080/api
```

**CORS Error:**
- Check backend application.properties
- Verify `app.cors.allowed-origins` includes http://localhost:5173

## 📝 Notes

- All features are production-ready and tested
- Rate limiting uses in-memory cache (resets on server restart)
- Email scheduler runs at 9:00 AM daily (configurable in PropertyRecommendationScheduler)
- Status history is automatically tracked on every status change
- Docker images use multi-stage builds for optimization
- Health checks ensure services are running correctly

## 🎉 Enjoy Testing!

All 7 production features are now live and ready to test. If you encounter any issues, check the logs and verify environment variables are correctly configured.
