# Update Sender Email to suryakumar56394@gmail.com

## Changes Made Locally

✅ Updated `backend/.env`:
- `MAIL_FROM=suryakumar56394@gmail.com` (was kirouses3@gmail.com)
- `COMPANY_ADDRESS=Erode, 638102, Tamil Nadu, India` (was Anna Nagar, Chennai)

## IMPORTANT: Update Render Environment Variables

You need to update the `MAIL_FROM` variable on Render:

### Step 1: Verify Sender Email in SendGrid

**CRITICAL:** Before changing, you MUST verify `suryakumar56394@gmail.com` in SendGrid!

1. Go to SendGrid: https://app.sendgrid.com/
2. Click **Settings** → **Sender Authentication**
3. Click **Verify a Single Sender**
4. Add email: `suryakumar56394@gmail.com`
5. Check your inbox for verification email
6. Click the verification link
7. Wait for "Verified" status

### Step 2: Update Render Environment Variable

1. Go to Render Dashboard: https://dashboard.render.com/
2. Click on **realestatecrm-backend-yn5j**
3. Click **Environment** in left sidebar
4. Find `MAIL_FROM` variable
5. Change value from `kirouses3@gmail.com` to `suryakumar56394@gmail.com`
6. Also update `COMPANY_ADDRESS` to `Erode, 638102, Tamil Nadu, India`
7. Click **Save Changes**
8. Wait for automatic redeployment (2-5 minutes)

### Step 3: Test After Deployment


Check your inbox - the email should now show:
- **From:** suryakumar56394@gmail.com (instead of kirouses3@gmail.com)
- **Address:** Erode, 638102, Tamil Nadu, India

## Why Verify Sender Email?

SendGrid requires sender email verification to prevent spam. If you don't verify:
- ❌ Emails will fail with 403 Forbidden error
- ❌ "Sender email not verified" error in logs

## Current Status

- ✅ Local `.env` updated
- ⏳ Sender email needs verification in SendGrid
- ⏳ Render environment variable needs update
- ⏳ Test after deployment

## Troubleshooting

### 403 Forbidden Error
- Sender email not verified in SendGrid
- Go to SendGrid → Settings → Sender Authentication
- Verify suryakumar56394@gmail.com

### Email Still Shows Old Sender
- Render environment variable not updated
- Check Render dashboard → Environment tab
- Ensure `MAIL_FROM=suryakumar56394@gmail.com`

## Next Steps

1. ✅ Verify `suryakumar56394@gmail.com` in SendGrid (DO THIS FIRST!)
2. ✅ Update `MAIL_FROM` in Render dashboard
3. ✅ Update `COMPANY_ADDRESS` in Render dashboard
4. ✅ Wait for redeployment
5. ✅ Test email sending
6. ✅ Commit changes to Git

**DO NOT skip sender verification - emails will fail without it!**
