# 🔄 Render Manual Redeploy Required

## ⚠️ Current Status

- ✅ Code fixed and committed to GitHub
- ✅ SecurityConfig allows `/actuator/health`
- ❌ Render hasn't redeployed yet (still running old code)

---

## 🔧 Why 403 Error

The old deployment is still running without the security fix.

---

## 🚀 Fix: Manual Redeploy on Render

### Step 1: Go to Render Dashboard
```
https://dashboard.render.com
```

### Step 2: Click on realestatecrm-backend

### Step 3: Click "Manual Deploy" Button
- Look for the blue "Manual Deploy" button
- Click it
- Select branch: `main`
- Click "Deploy"

### Step 4: Wait for Deployment
- Watch the logs
- Should take 5-10 minutes
- Look for: "Started RealEstateCrmApplication"

---

## 🧪 Test After Redeploy

```bash
curl https://realestatecrm-backend-yn5j.onrender.com/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

---

## 📊 What Changed

**Before** (old code):
```
/actuator/health → 403 Forbidden
```

**After** (new code):
```
/actuator/health → 200 OK {"status":"UP"}
```

---

## ✅ Code Changes Made

In `SecurityConfig.java`:
```java
.requestMatchers("/actuator/health").permitAll()
```

This allows the health endpoint without JWT.

---

**Status**: Code ready, waiting for Render redeploy
**Action**: Click Manual Deploy on Render dashboard
