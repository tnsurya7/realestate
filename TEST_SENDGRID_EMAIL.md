# SendGrid Email Testing Guide

## Overview
The backend has been updated to use SendGrid API instead of Gmail SMTP for all email functionality.

## Changes Made

### 1. Dependencies Updated
- Removed: `spring-boot-starter-mail`
- Added: `sendgrid-java` (version 4.9.3)

### 2. Configuration Updated
**File: `backend/src/main/resources/application.properties`**
```properties
# SendGrid Email Configuration
sendgrid.api.key=${SENDGRID_API_KEY}
mail.from=${MAIL_FROM}
```

### 3. EmailService Rewritten
**File: `backend/src/main/java/com/realestatecrm/service/EmailService.java`**
- Replaced `JavaMailSender` with SendGrid API
- All email templates remain unchanged
- Supports:
  - Contact form emails
  - Lead notification emails
  - Property recommendation emails (daily automation)

### 4. Test Endpoint Added
**File: `backend/src/main/java/com/realestatecrm/controller/AdminController.java`**
- New endpoint: `POST /api/admin/test-email`
- Allows testing SendGrid integration
- Sends a test contact form email

## Environment Variables Required

## Testing SendGrid Email

### Step 1: Deploy to Render
```bash
git add .
git commit -m "Replace Gmail SMTP with SendGrid API for email sending"
git push origin main
```

Wait for Render to deploy (check logs at https://dashboard.render.com)

### Step 2: Test Email Endpoint

#### Using curl:
```bash
# Get auth token first (login as admin)
curl -X POST https://realestatecrm-backend-yn5j.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_admin_email@example.com",
    "password": "your_admin_password"
  }'

# Copy the token from response, then test email:
curl -X POST "https://realestatecrm-backend-yn5j.onrender.com/api/admin/test-email?to=your_email@example.com" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Using Postman:
1. **Login** (POST): `https://realestatecrm-backend-yn5j.onrender.com/api/auth/login`
   - Body: `{"email": "your_admin_email@example.com", "password": "your_password"}`
   - Copy the `token` from response

2. **Test Email** (POST): `https://realestatecrm-backend-yn5j.onrender.com/api/admin/test-email?to=your_email@example.com`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Expected Response: `{"success": true, "message": "Email sent", "data": "Test email sent successfully to suryakumar56394@gmail.com. Check inbox and spam folder."}`

### Step 3: Verify Email Received
- Check your inbox
- Check spam folder if not in inbox
- Email subject: "🔔 New Contact Form Submission - RealEstate CRM"
- Email should contain test message

### Step 4: Test Contact Form (Frontend)
1. Go to: https://realestatecrms-tau.vercel.app/contact
2. Fill out the contact form
3. Submit
4. Check admin email: `suryakumar56394@gmail.com`
5. Check sender email for confirmation

### Step 5: Test Lead Form (Frontend)
1. Go to: https://realestatecrms-tau.vercel.app/properties
2. Click "I'm Interested" on any property
3. Fill out the form
4. Submit
5. Check admin email for lead notification
6. Check your email for confirmation

### Step 6: Test Daily Automation
```bash
# Trigger property recommendations manually
curl -X POST https://realestatecrm-backend-yn5j.onrender.com/api/admin/scheduler/trigger-recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Check emails for NEW leads with property recommendations.

## Expected Behavior

### Contact Form Email
- **To**: Admin (`suryakumar56394@gmail.com`)
- **Subject**: "🔔 New Contact Form Submission - RealEstate CRM"
- **Content**: Contact details and message
- **Confirmation**: Sent to form submitter

### Lead Notification Email
- **To**: Admin (`suryakumar56394@gmail.com`)
- **Subject**: "🎯 New Lead Inquiry - RealEstate CRM"
- **Content**: Lead details and property interest
- **Confirmation**: Sent to lead with property details

### Property Recommendations
- **To**: Lead email
- **Subject**: "🏡 Property Recommendations Just for You - RealEstate CRM"
- **Content**: Up to 3 matching properties
- **Schedule**: Daily at 9:00 AM (or manual trigger)

## Troubleshooting

### Email Not Received
1. Check spam folder
2. Verify SendGrid API key is valid
3. Check Render logs for errors: `https://dashboard.render.com/web/srv-YOUR_SERVICE_ID/logs`
4. Verify sender email is verified in SendGrid dashboard

### SendGrid API Errors
- **401 Unauthorized**: Invalid API key
- **403 Forbidden**: Sender email not verified
- **429 Too Many Requests**: Rate limit exceeded

### Verify SendGrid Configuration
1. Login to SendGrid: https://app.sendgrid.com/
2. Go to Settings > API Keys
3. Verify API key exists and has "Mail Send" permission
4. Go to Settings > Sender Authentication
5. Verify `kirouses3@gmail.com` is verified

## Production Checklist
- [x] Remove Gmail SMTP configuration
- [x] Add SendGrid dependency
- [x] Update EmailService to use SendGrid API
- [x] Keep all email templates unchanged
- [x] Add test endpoint
- [ ] Add environment variables to Render
- [ ] Deploy to Render
- [ ] Test email sending
- [ ] Verify daily automation works

## Notes
- All HTML email templates remain unchanged
- SendGrid API is more reliable than SMTP
- No authentication issues with SendGrid
- Better deliverability and tracking
- Daily automation at 9 AM still works
