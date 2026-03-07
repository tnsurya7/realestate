# Render SendGrid Environment Variables Setup

## URGENT: Add These Environment Variables to Render

The backend deployment will fail without these environment variables!

### Step-by-Step Instructions

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com/
   - Login with your account

2. **Select Your Backend Service**
   - Click on "realestatecrm-backend-yn5j" (or your backend service name)

3. **Go to Environment Tab**
   - Click "Environment" in the left sidebar

4. **Add SendGrid Environment Variables**
   
   Click "Add Environment Variable" and add these TWO variables:

 
5. **Save Changes**
   - Click "Save Changes" button
   - Render will automatically redeploy your service

6. **Wait for Deployment**
   - Go to "Logs" tab
   - Wait for deployment to complete (usually 2-5 minutes)
   - Look for "Started RealEstateCrmApplication" message

7. **Verify Deployment**
   - Check if service is "Live" (green status)
   - URL: https://realestatecrm-backend-yn5j.onrender.com/api/properties

## After Deployment: Test SendGrid Email

Follow the instructions in `TEST_SENDGRID_EMAIL.md` to test email sending.

### Quick Test Command

## Important Notes

- **DO NOT commit .env file to Git** - It contains sensitive credentials
- The `.env` file is only for local development
- Render uses environment variables from the dashboard
- SendGrid API key is sensitive - keep it secure
- If email doesn't work, check Render logs for errors

## Troubleshooting

### Deployment Failed
- Check Render logs for error messages
- Verify environment variables are set correctly
- Ensure no typos in variable names or values

### Email Not Sending
- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid
- Look for errors in Render logs
- Test with curl command above

### 401 Unauthorized Error
- SendGrid API key is invalid or expired
- Generate new API key from SendGrid dashboard

### 403 Forbidden Error
- Sender email not verified in SendGrid
- Go to SendGrid > Settings > Sender Authentication
- Verify your sender email

## Current Environment Variables on Render

After adding SendGrid variables, you should have:

## Next Steps

1. ✅ Code pushed to GitHub
2. ⏳ Add environment variables to Render (DO THIS NOW!)
3. ⏳ Wait for Render deployment
4. ⏳ Test email sending
5. ⏳ Verify contact form works
6. ⏳ Verify lead form works
7. ⏳ Test daily automation

**ACTION REQUIRED: Add the environment variables to Render NOW!**
