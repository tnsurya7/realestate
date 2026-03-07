#!/bin/bash

# SendGrid Email Test Script
# This script tests the SendGrid email integration on Render

echo "========================================="
echo "SendGrid Email Test Script"
echo "========================================="
echo ""

# Configuration
BACKEND_URL="https://realestatecrm-backend-yn5j.onrender.com"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-your_password}"
TEST_EMAIL="${TEST_EMAIL:-test@example.com}"

echo "NOTE: Set environment variables before running:"
echo "  export ADMIN_EMAIL='your_admin_email@example.com'"
echo "  export ADMIN_PASSWORD='your_password'"
echo "  export TEST_EMAIL='recipient@example.com'"
echo ""

echo "Step 1: Logging in as admin..."
echo ""

# Login and get token
LOGIN_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${ADMIN_EMAIL}\", \"password\": \"${ADMIN_PASSWORD}\"}")

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed! Response:"
    echo "$LOGIN_RESPONSE"
    echo ""
    echo "Possible reasons:"
    echo "1. Backend is not running"
    echo "2. Wrong credentials"
    echo "3. Database connection issue"
    exit 1
fi

echo "✅ Login successful!"
echo "Token: ${TOKEN:0:20}..."
echo ""

echo "Step 2: Sending test email to ${TEST_EMAIL}..."
echo ""

# Send test email
EMAIL_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/admin/test-email?to=${TEST_EMAIL}" \
  -H "Authorization: Bearer ${TOKEN}")

echo "Response:"
echo "$EMAIL_RESPONSE"
echo ""

# Check if email was sent successfully
if echo "$EMAIL_RESPONSE" | grep -q '"success":true'; then
    echo "========================================="
    echo "✅ SUCCESS! Test email sent!"
    echo "========================================="
    echo ""
    echo "Next steps:"
    echo "1. Check inbox: ${TEST_EMAIL}"
    echo "2. Check spam folder if not in inbox"
    echo "3. Email subject: '🔔 New Contact Form Submission - RealEstate CRM'"
    echo ""
    echo "If you received the email, SendGrid is working correctly!"
else
    echo "========================================="
    echo "❌ FAILED! Email not sent!"
    echo "========================================="
    echo ""
    echo "Troubleshooting:"
    echo "1. Check Render logs: https://dashboard.render.com/"
    echo "2. Verify SENDGRID_API_KEY is set in Render"
    echo "3. Verify MAIL_FROM is set in Render"
    echo "4. Check SendGrid dashboard for errors"
fi

echo ""
echo "========================================="
echo "Additional Tests"
echo "========================================="
echo ""

echo "Test contact form on frontend:"
echo "URL: https://realestatecrms-tau.vercel.app/contact"
echo ""

echo "Test lead form on frontend:"
echo "URL: https://realestatecrms-tau.vercel.app/properties"
echo ""

echo "Trigger daily automation:"
echo "curl -X POST '${BACKEND_URL}/api/admin/scheduler/trigger-recommendations' \\"
echo "  -H 'Authorization: Bearer ${TOKEN}'"
echo ""
