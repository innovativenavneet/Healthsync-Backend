# 🗄️ MongoDB Atlas Setup Guide

## **Step 1: Create MongoDB Atlas Account**

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

## **Step 2: Create Cluster**

1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

## **Step 3: Set Up Database Access**

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

## **Step 4: Set Up Network Access**

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## **Step 5: Get Connection String**

1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

## **Step 6: Update Your Environment**

Replace the placeholder in your `config/.env`:

```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/healthsync
```

**Replace:**
- `your_username` with your database username
- `your_password` with your database password
- `cluster.mongodb.net` with your actual cluster URL

## **Example Connection String:**

```
MONGO_URI=mongodb+srv://healthsync_user:MyPassword123@cluster0.abc123.mongodb.net/healthsync
```

## **Step 7: Test Connection**

Restart your server and you should see:
```
✅ Connected to MongoDB
```

## **Troubleshooting:**

### **Connection Failed:**
- Check username/password
- Verify IP whitelist includes your IP
- Ensure cluster is running

### **Authentication Failed:**
- Make sure database user has correct permissions
- Check if password has special characters (URL encode if needed)

### **Network Error:**
- Add your IP to Network Access
- Or use "Allow Access from Anywhere" for development

## **Security Notes:**

- **Never commit** your connection string to GitHub
- Use **strong passwords** for database users
- In production, **whitelist specific IPs** only
- Consider using **environment-specific** databases

Your MongoDB Atlas is now ready! 🎉 