# RealEstate CRM - Setup Guide

## Prerequisites

- **Java 17 or 21** (for backend)
- **Node.js 18+** (for frontend)
- **Maven** (for backend build)
- **PostgreSQL Database** (Neon DB recommended)
- **Gmail Account** (for email notifications)

## 1. Database Setup

### Using Neon DB (Recommended)

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string
4. Note down: Database URL, Username, and Password

## 2. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Copy the 16-character password (remove spaces)

## 3. Backend Configuration

1. Navigate to `backend/` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and fill in your credentials:
   ```env
   # Database Configuration
   DB_URL=jdbc:postgresql://your-neon-url/dbname?sslmode=require
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password

   # Admin User (First login credentials)
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=YourSecurePassword@123
   ADMIN_NAME=Admin Name

   # Email Configuration (Gmail)
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-gmail-app-password

   # Contact Information (Displayed on website)
   CONTACT_PHONE=1234567890
   CONTACT_EMAIL=contact@yourcompany.com
   COMPANY_NAME=Your Company Name
   COMPANY_ADDRESS=Your Company Address
   ```

4. Build and run the backend:
   ```bash
   # If using Java 21
   export JAVA_HOME=$(/usr/libexec/java_home -v 21)
   
   # Build
   mvn clean install
   
   # Run
   mvn spring-boot:run
   ```

   Or use the provided script:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

5. Backend will start on `http://localhost:8080`

## 4. Frontend Configuration

1. Navigate to `frontend/` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

5. Frontend will start on `http://localhost:5173`

## 5. First Time Login

1. Open `http://localhost:5173/login`
2. Use the credentials from your `.env` file:
   - Email: Value of `ADMIN_EMAIL`
   - Password: Value of `ADMIN_PASSWORD`

## 6. Testing Email Functionality

### Contact Form
1. Go to `http://localhost:5173/contact`
2. Fill and submit the form
3. Check two emails:
   - Admin email (MAIL_USERNAME) receives notification
   - Sender receives confirmation

### Lead Form
1. Browse properties at `http://localhost:5173/properties`
2. Click on any property
3. Click "I'm Interested" and fill the form
4. Check two emails:
   - Admin receives lead notification with property details
   - Sender receives confirmation with property info

## 7. Password Requirements

When creating agents, passwords must contain:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (@$!%*?&)

Example valid password: `Agent@123`

## 8. API Documentation

Once the backend is running, access Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## 9. Production Deployment

### Backend (Render/Railway/Heroku)
1. Set all environment variables from `.env` in your hosting platform
2. Deploy the backend
3. Note the production URL

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to your production backend URL
2. Deploy the frontend

### Database
- Neon DB works great for production (serverless PostgreSQL)
- No additional configuration needed

## 10. Security Checklist

✅ `.env` files are in `.gitignore`
✅ Never commit `.env` files to Git
✅ Use strong passwords for ADMIN_PASSWORD
✅ Keep Gmail app password secure
✅ Use environment variables in production
✅ Enable HTTPS in production

## 11. Troubleshooting

### Backend won't start
- Check Java version: `java -version`
- Verify database connection in `.env`
- Check if port 8080 is available

### Email not sending
- Verify Gmail app password (no spaces)
- Check if 2FA is enabled on Gmail
- Verify MAIL_USERNAME and MAIL_PASSWORD in `.env`

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check VITE_API_URL in frontend `.env`
- Check browser console for CORS errors

### Database connection failed
- Verify DB_URL, DB_USERNAME, DB_PASSWORD
- Check if database is accessible
- Ensure SSL mode is correct for your database

## 12. Support

For issues or questions:
- Check the main README.md
- Review application logs
- Verify all environment variables are set correctly

## 13. Development Tips

- Backend auto-reloads on code changes with Spring Boot DevTools
- Frontend hot-reloads automatically with Vite
- Use Swagger UI for API testing
- Check backend logs for detailed error messages
