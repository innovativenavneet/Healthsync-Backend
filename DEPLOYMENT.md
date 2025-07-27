# 🚀 HealthSync Backend Deployment Guide

## **Option 1: Render (Recommended)**

### **Step 1: Prepare Your Repository**

1. **Push your code to GitHub** (make sure `.env` files are in `.gitignore`)
2. **Create a MongoDB Atlas cluster** (free tier available)

### **Step 2: Deploy on Render**

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `healthsync-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### **Step 3: Set Environment Variables**

In Render dashboard, go to your service → Environment → Add Environment Variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthsync
JWT_SECRET_KEY=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
NODE_ENV=production
```

### **Step 4: Deploy**

Click "Create Web Service" and wait for deployment.

---

## **Option 2: Railway**

### **Step 1: Deploy on Railway**

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

---

## **Option 3: Heroku**

### **Step 1: Prepare for Heroku**

1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: npm start
   ```

### **Step 2: Deploy**

```bash
heroku create healthsync-backend
git push heroku main
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET_KEY=your_jwt_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_password
heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
heroku config:set NODE_ENV=production
```

---

## **Environment Variables Setup**

### **1. MongoDB Atlas (Database)**

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/healthsync
   ```

### **2. Gmail App Password (Email)**

1. Enable 2-factor authentication on Gmail
2. Generate app password:
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"

### **3. JWT Secret Key**

Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **4. Google OAuth (Optional)**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable Google+ API
4. Create OAuth 2.0 credentials

---

## **Security Checklist**

✅ **Environment variables are NOT in GitHub**
✅ **MongoDB connection string is secure**
✅ **JWT secret is strong and unique**
✅ **Email credentials are app passwords**
✅ **CORS is configured for production**
✅ **All sensitive files are in .gitignore**

---

## **Testing Your Live API**

After deployment, test your endpoints:

```bash
# Health check
curl https://your-app-name.onrender.com/health

# Signup
curl -X POST https://your-app-name.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password","role":"doctor"}'
```

---

## **Custom Domain (Optional)**

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **Configure DNS** to point to your Render/Heroku URL
3. **Update CORS** in server.js with your domain
4. **Add SSL certificate** (automatic on Render/Heroku)

---

## **Monitoring & Maintenance**

1. **Set up logging** (Render provides logs)
2. **Monitor performance** (Render dashboard)
3. **Set up alerts** for downtime
4. **Regular backups** of MongoDB data

---

## **Troubleshooting**

### **Common Issues:**

1. **Environment variables not working**
   - Check spelling in deployment platform
   - Restart the service after adding variables

2. **MongoDB connection failed**
   - Verify connection string
   - Check IP whitelist in MongoDB Atlas

3. **Email not sending**
   - Verify Gmail app password
   - Check if 2FA is enabled

4. **CORS errors**
   - Update CORS origins in server.js
   - Add your frontend domain

---

## **Production Checklist**

- [ ] Environment variables set
- [ ] MongoDB Atlas configured
- [ ] Gmail app password set
- [ ] JWT secret generated
- [ ] CORS configured
- [ ] Health check endpoint working
- [ ] All API endpoints tested
- [ ] SSL certificate active
- [ ] Monitoring set up
- [ ] Backup strategy in place

Your HealthSync backend will be live and secure! 🎉 