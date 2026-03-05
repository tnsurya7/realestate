# Test Email Scheduler Right Now

You just created a lead! Let's test if the email scheduler sends property recommendations.

## Quick Test Steps

### Step 1: Verify the Lead is in Database

The lead you just created should have:
- **Status**: NEW
- **Email**: The email you entered
- **Budget**: The budget you specified (if any)

### Step 2: Trigger the Scheduler Manually

**Using Swagger UI:**
1. Open: http://localhost:8080/swagger-ui.html
2. Click on **"Admin Controller"** to expand
3. Find: `POST /api/admin/scheduler/trigger-recommendations`
4. Click **"Try it out"**
5. Click **"Execute"**

**Using cURL:**
```bash
# First, login to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourcompany.com","password":"YourPassword"}'

# Copy the token from response, then:
curl -X POST http://localhost:8080/api/admin/scheduler/trigger-recommendations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 3: Check Backend Logs

Watch the backend terminal for output like:

```
INFO: Manual trigger requested for property recommendations
INFO: Starting daily property recommendation email scheduler
INFO: Found 1 NEW leads for recommendations
INFO: Sent 3 property recommendations to: customer@email.com
INFO: Property recommendation scheduler completed - Sent: 1, Skipped: 0
```

### Step 4: Check Email Inbox

Check the email address you used when creating the lead. You should receive an email with:

**Subject**: 🏡 Property Recommendations Just for You - RealEstate CRM

**Content**:
- Personalized greeting with your name
- Up to 3 property cards showing:
  - Property title
  - Location
  - Price
  - Description
  - Bedrooms, bathrooms, area
- Call-to-action buttons (Phone & WhatsApp)
- Company contact information

## What Happens Next?

### Automatic Daily Execution

Tomorrow at **9:00 AM**, the scheduler will run automatically and:

1. Find all NEW leads (including the one you just created)
2. Check if they already received an email today
3. If not, send property recommendations
4. Update `lastEmailSentDate` to today

### Preventing Duplicate Emails

The scheduler is smart:
- ✅ Sends email once per day maximum
- ✅ Checks `lastEmailSentDate` field
- ✅ Skips leads that already got email today
- ✅ Only targets leads with status "NEW"

### Email Matching Logic

The scheduler finds properties based on:
- **If lead has budget**: Properties with `price <= lead.budget`
- **If no budget**: Latest 3 available properties
- **Status filter**: Only `AVAILABLE` properties
- **Limit**: Maximum 3 properties per email

## Troubleshooting

### No Email Received?

**Check 1: Lead Status**
```sql
SELECT * FROM leads WHERE status = 'NEW';
```
Make sure your lead has status "NEW"

**Check 2: Available Properties**
```sql
SELECT * FROM properties WHERE status = 'AVAILABLE';
```
Make sure there are properties to recommend

**Check 3: Email Configuration**
```bash
# Check backend/.env
cat backend/.env | grep MAIL_
```
Verify Gmail SMTP credentials are correct

**Check 4: Backend Logs**
Look for errors in the backend terminal:
```
grep -i "email\|recommendation" backend/logs/application.log
```

### Email Sent Multiple Times?

This shouldn't happen because:
- Scheduler checks `lastEmailSentDate`
- Only sends if date is not today
- Updates timestamp after sending

If it happens, check:
```sql
SELECT id, customer_email, last_email_sent_date 
FROM leads 
WHERE status = 'NEW';
```

## Example Email Template

```
┌─────────────────────────────────────────┐
│  🏡 Property Recommendations            │
│  Handpicked properties matching your    │
│  preferences                            │
└─────────────────────────────────────────┘

Hi John Doe!

We found some amazing properties that match 
your budget and preferences.

┌─────────────────────────────────────────┐
│ Premium 4BHK Villa in ECR               │
│ 📍 Chennai, East Coast Road            │
│ ₹1,75,00,000                           │
│ Beautiful sea-side villa...             │
│ 🛏️ 4 Bedrooms | 🚿 4 Bathrooms        │
│ 📐 3200 sq ft                          │
└─────────────────────────────────────────┘

[More properties...]

Interested in any of these properties?
Contact us for more details or to schedule 
a viewing!

[📞 Call Us]  [💬 WhatsApp]

---
RealEstate CRM
Anna Nagar, Chennai – 600040
suryakumar56394@gmail.com | +91 9360004968
```

## Scheduler Configuration

**Current Settings:**
- **Schedule**: Daily at 9:00 AM (cron: `0 0 9 * * ?`)
- **Target**: Leads with status = "NEW"
- **Limit**: 3 properties per email
- **Duplicate Prevention**: Checks `lastEmailSentDate`

**To Change Schedule:**
Edit `PropertyRecommendationScheduler.java`:
```java
@Scheduled(cron = "0 0 9 * * ?")  // Change this
```

**Common Cron Expressions:**
- `0 0 9 * * ?` - Daily at 9:00 AM (current)
- `0 0 */6 * * ?` - Every 6 hours
- `0 0 9 * * MON-FRI` - Weekdays only at 9:00 AM
- `0 */30 * * * ?` - Every 30 minutes (for testing)

## Summary

✅ Lead saved in database with status "NEW"
✅ Scheduler will automatically send recommendations tomorrow at 9 AM
✅ You can test it right now using the manual trigger endpoint
✅ Email will contain up to 3 matching properties
✅ Duplicate emails are prevented automatically

**Test it now using Swagger UI!** 🚀
