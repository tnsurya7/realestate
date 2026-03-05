# 🚨 Security Incident Response - SMTP Credentials Exposed

## Incident Summary

**Date**: March 5, 2026  
**Severity**: HIGH  
**Type**: Exposed SMTP credentials in Git history  
**Status**: MITIGATED

## What Happened

Gmail SMTP app password was accidentally included in `SCHEDULER_STATUS.md` documentation file and committed to the public GitHub repository.

**Exposed in commit**: `dcd05ed`  
**File**: `SCHEDULER_STATUS.md`  
**Detection**: GitGuardian automated scan

## Immediate Actions Taken

### 1. ✅ Removed Credentials from Documentation
- Sanitized `SCHEDULER_STATUS.md`
- Sanitized `TESTING_GUIDE.md`
- Sanitized `TEST_SCHEDULER.md`
- Replaced real credentials with placeholder examples

### 2. ⚠️ REQUIRED: Revoke Exposed Gmail App Password

**YOU MUST DO THIS NOW:**

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with: suryakumar56394@gmail.com
3. Find the app password (likely named "RealEstate CRM" or similar)
4. Click "Remove" to revoke it immediately
5. Generate a NEW app password
6. Update `backend/.env` with the new password:
   ```env
   MAIL_PASSWORD=your-new-app-password-here
   ```
7. Restart the backend server

### 3. ✅ Updated .gitignore

Verified `.env` files are properly ignored:
```
backend/.env
frontend/.env
.env
.env.local
.env.production
```

## Git History Cleanup (Optional but Recommended)

The exposed password exists in Git history. To completely remove it:

### Option 1: BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/tnsurya7/realestate.git

# Remove the password from all history
bfg --replace-text passwords.txt realestate.git

# Force push (WARNING: This rewrites history)
cd realestate.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### Option 2: git filter-branch

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch SCHEDULER_STATUS.md" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**⚠️ WARNING**: Both options rewrite Git history. Coordinate with team members!

## Prevention Measures

### 1. ✅ Environment Variables Only

**NEVER commit:**
- Passwords
- API keys
- Database credentials
- JWT secrets
- Email passwords

**ALWAYS use:**
- `.env` files (gitignored)
- Environment variables
- Secret management services (AWS Secrets Manager, HashiCorp Vault)

### 2. ✅ Pre-commit Hooks

Install git-secrets to prevent future leaks:

```bash
# Install git-secrets
brew install git-secrets  # macOS

# Setup for this repo
cd /path/to/realestate
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'MAIL_PASSWORD=.*'
git secrets --add 'DB_PASSWORD=.*'
git secrets --add 'JWT_SECRET=.*'
```

### 3. ✅ Documentation Best Practices

When writing documentation:
- Use placeholder values: `your-password-here`
- Use environment variable references: `${MAIL_PASSWORD}`
- Never copy-paste from actual `.env` files
- Review before committing

### 4. ✅ GitHub Secret Scanning

Enable GitHub's secret scanning:
1. Go to: https://github.com/tnsurya7/realestate/settings/security_analysis
2. Enable "Secret scanning"
3. Enable "Push protection"

## Verification Checklist

- [x] Removed credentials from all documentation files
- [x] Verified `.env` files are in `.gitignore`
- [ ] **CRITICAL**: Revoked exposed Gmail app password
- [ ] **CRITICAL**: Generated new Gmail app password
- [ ] **CRITICAL**: Updated `backend/.env` with new password
- [ ] Restarted backend server with new credentials
- [ ] Tested email functionality works with new password
- [ ] (Optional) Cleaned Git history with BFG or filter-branch
- [ ] (Optional) Installed git-secrets for prevention
- [ ] (Optional) Enabled GitHub secret scanning

## Testing After Remediation

After revoking and updating the password:

```bash
# 1. Update backend/.env with new password
nano backend/.env

# 2. Restart backend
cd backend
./start.sh

# 3. Test email functionality
curl -X POST http://localhost:8080/api/admin/scheduler/trigger-recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Check logs for successful email send
tail -f backend/logs/application.log | grep -i "email"
```

## Lessons Learned

1. **Never include real credentials in documentation** - Always use placeholders
2. **Review commits before pushing** - Check for sensitive data
3. **Use automated scanning** - GitGuardian, git-secrets, GitHub scanning
4. **Rotate credentials regularly** - Even without exposure
5. **Principle of least privilege** - Use app-specific passwords

## Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [GitGuardian Documentation](https://docs.gitguardian.com/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-secrets](https://github.com/awslabs/git-secrets)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## Contact

If you have questions about this incident or need help with remediation:
- Review this document
- Check `.env.example` for proper configuration
- Ensure all secrets are in `.env` files (gitignored)

---

**Status**: Credentials removed from repository. **ACTION REQUIRED**: Revoke and rotate the exposed Gmail app password immediately.
