# Test Email Scheduler

## Quick Test via Swagger UI

1. **Open Swagger UI**: http://localhost:8080/swagger-ui.html

2. **Find the Admin Controller** section

3. **Locate**: `POST /api/admin/scheduler/trigger-recommendations`

4. **Click "Try it out"** → **Execute**

5. **Check Response**:
   ```json
   {
     "success": true,
     "message": "Property recommendation scheduler triggered successfully. Check logs for details.",
     "data": "Scheduler triggered"
   }
   ```

6. **Check Backend Logs** for output like:
   ```
   INFO: Manual trigger requested for property recommendations
   INFO: Starting daily property recommendation email scheduler
   INFO: Found X NEW leads for recommendations
   INFO: Sent 3 property recommendations to: customer@email.com
   ```

## Test via cURL

```bash
# Get JWT token first (login)
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourcompany.com","password":"YourPassword"}' \
  | jq -r '.data.token')

# Trigger scheduler
curl -X POST http://localhost:8080/api/admin/scheduler/trigger-recommendations \
  -H "Authorization: Bearer $TOKEN"
```

## Automatic Execution

The scheduler runs automatically every day at **9:00 AM** (configured with cron expression: `0 0 9 * * ?`)

### What it does:
1. Finds all leads with status "NEW"
2. For each lead, finds up to 3 matching properties within their budget
3. Sends a personalized HTML email with property recommendations
4. Updates `lastEmailSentDate` to prevent duplicate emails
5. Skips leads that already received an email today

## Verify Email Sent

Check the email inbox for leads with status "NEW". The email will have:
- **Subject**: 🏡 Property Recommendations Just for You - RealEstate CRM
- **Content**: Up to 3 property cards with details
- **Call-to-action**: Phone and WhatsApp buttons

## Scheduler Configuration

**Current Settings:**
- **Cron Expression**: `0 0 9 * * ?` (9:00 AM daily)
- **Target Leads**: Status = NEW
- **Properties per Email**: Maximum 3
- **Duplicate Prevention**: Checks `lastEmailSentDate`

**To Change Schedule:**
Edit `PropertyRecommendationScheduler.java`:
```java
@Scheduled(cron = "0 0 9 * * ?")  // Change this cron expression
```

**Common Cron Expressions:**
- `0 0 9 * * ?` - Daily at 9:00 AM
- `0 0 */6 * * ?` - Every 6 hours
- `0 0 9 * * MON-FRI` - Weekdays at 9:00 AM
- `0 */30 * * * ?` - Every 30 minutes (for testing)

## Testing Tips

1. **Create Test Leads**: Add leads with status "NEW" and a budget
2. **Add Properties**: Ensure properties exist within the lead's budget
3. **Trigger Manually**: Use the API endpoint to test immediately
4. **Check Logs**: Monitor backend logs for scheduler execution
5. **Verify Email**: Check the email inbox for the recommendation email

## Troubleshooting

**No emails sent?**
- Check if there are leads with status "NEW"
- Verify properties exist within lead budgets
- Check email configuration in `.env` file
- Look for errors in backend logs

**Emails sent multiple times?**
- Check `lastEmailSentDate` field in database
- Verify scheduler is not running multiple times
- Check for duplicate scheduler beans

**Scheduler not running?**
- Verify `@EnableScheduling` is present in `RealEstateCrmApplication.java`
- Check Spring Boot logs for scheduler initialization
- Ensure `PropertyRecommendationScheduler` is a `@Component`
