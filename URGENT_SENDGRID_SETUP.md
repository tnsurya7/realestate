# URGENT: Add SendGrid Environment Variables to Render

## Current Status
✅ Code deployed to Render
❌ SendGrid environment variables NOT set (causing email errors)

## What You Need to Do NOW

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com/
2. Login with your account
3. Click on your backend service: **realestatecrm-backend-yn5j**

### Step 2: Add Environment Variables
1. Click **"Environment"** in the left sidebar
2. Click **"Add Environment Variable"** button

### Step 3: Add These TWO Variables

**Variable 1:**
- Key: `SENDGRID_API_KEY`
- Value: (paste your SendGrid API key from your .env file)

**Variable 2:**
- Key: `MAIL_FROM`
- Value: (paste your sender email from your .env file)

### Step 4: Save and Wait
1. Click **"Save Changes"**
2. Render will automatically redeploy (takes 2-5 minutes)
3. Wait for status to show "Live" (green)

### Step 5: Test Email Again
After deployment completes, run this command:

```bash
# Login
curl -s -X POST https://realestatecrm-backend-yn5j.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "YOUR_ADMIN_EMAIL", "password": "YOUR_PASSWORD"}' | python3 -m json.tool

# Copy the token, then test email
curl -s -X POST "https://realestatecrm-backend-yn5j.onrender.com/api/admin/test-email?to=YOUR_EMAIL" \
  -H "Authorization: Bearer YOUR_TOKEN" | python3 -m json.tool
```

## Expected Success Response
```json
{
    "success": true,
    "message": "Email sent",
    "data": "Test email sent successfully to YOUR_EMAIL. Check inbox and spam folder.",
    "timestamp": "2026-03-07T..."
}
```

## If You See Error
The error means SendGrid environment variables are missing. You MUST add them to Render dashboard.

## Where to Find Your Credentials
Check your local `backend/.env` file for:
- `SENDGRID_API_KEY=...`
- `MAIL_FROM=...`

Copy those values to Render dashboard.

## After Success
Once email test works:
1. ✅ Contact form will send emails
2. ✅ Lead form will send emails
3. ✅ Daily automation will send property recommendations at 9 AM

**DO THIS NOW to complete the SendGrid migration!**
