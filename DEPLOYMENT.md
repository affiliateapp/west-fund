# 🌐 DEPLOYMENT GUIDE - West Fund Banking App

Complete guide to deploy your banking app to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Netlify/Vercel account (frontend)
- Render/Railway account (backend)

---

## Part 1: MongoDB Atlas Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Sign up with email or Google

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0 Sandbox)
3. Select Cloud Provider & Region (choose closest to you)
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `westfund`
5. Password: Generate secure password or create your own
6. **SAVE THIS PASSWORD!** You'll need it
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `westfund`

Example:
```
mongodb+srv://westfund:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/westfund?retryWrites=true&w=majority
```

**SAVE THIS CONNECTION STRING!**

---

## Part 2: Backend Deployment (Render.com)

### Why Render?
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Easy environment variables
- ✅ Built-in SSL

### Step 1: Prepare Backend
1. Make sure you have a GitHub repository
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: west-fund-backend
   - **Region**: Choose closest to you
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=super-secret-jwt-key-change-this-12345678
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.netlify.app
```

**IMPORTANT**: 
- Use your MongoDB Atlas connection string
- Generate a strong JWT_SECRET
- You'll update FRONTEND_URL after deploying frontend

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://west-fund-backend.onrender.com`
4. **SAVE THIS URL!** This is your API_URL

### Step 6: Seed Database (First Time Only)
1. Go to your backend dashboard on Render
2. Click "Shell" tab
3. Run: `npm run seed`
4. Wait for success message

---

## Part 3: Frontend Deployment (Netlify)

### Why Netlify?
- ✅ Free tier with generous bandwidth
- ✅ Automatic builds from Git
- ✅ Free SSL
- ✅ Easy custom domains

### Alternative: Vercel
Same features as Netlify, choose whichever you prefer. Steps are similar.

### Step 1: Create Netlify Account
1. Go to https://www.netlify.com
2. Sign up with GitHub
3. Authorize Netlify

### Step 2: New Site from Git
1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub"
3. Select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

### Step 3: Environment Variables
Before deploying, click "Show advanced" → "New variable"

Add:
```
REACT_APP_API_URL=https://west-fund-backend.onrender.com/api
```

Replace with your actual Render backend URL!

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for build (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://random-name-12345.netlify.app`

### Step 5: Custom Domain (Optional)
1. Click "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (if you have one)
4. Follow DNS configuration steps

---

## Part 4: Connect Backend and Frontend

### Step 1: Update Backend FRONTEND_URL
1. Go to Render dashboard
2. Select your backend service
3. Go to "Environment"
4. Update `FRONTEND_URL` with your Netlify URL
5. Save changes (will trigger redeploy)

### Step 2: Test the Application
1. Visit your Netlify URL
2. Click "Sign Up"
3. Create an account
4. Login and test features

---

## Part 5: Post-Deployment Checklist

- [ ] Can access the website
- [ ] Can sign up new user
- [ ] Can login
- [ ] Dashboard loads correctly
- [ ] Can transfer money
- [ ] Can deposit funds
- [ ] Transactions show in history
- [ ] Admin login works
- [ ] Admin can view users
- [ ] Admin can manage users

---

## Alternative: Railway.app (Backend)

If you prefer Railway over Render:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as Render)
6. Deploy!

Railway pros:
- ✅ $5 free credit per month
- ✅ Faster deployment
- ✅ Better UI
- ⚠️ Credit card required (but free tier available)

---

## Alternative: Vercel (Frontend)

If you prefer Vercel over Netlify:

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add environment variable: `REACT_APP_API_URL`
6. Deploy!

---

## Troubleshooting Deployment

### Backend Issues

**"Application failed to start"**
- Check Build Logs in Render
- Verify all environment variables are set
- Make sure MONGODB_URI is correct
- Check package.json scripts

**"Cannot connect to MongoDB"**
- Verify MongoDB Atlas connection string
- Check Network Access in Atlas (0.0.0.0/0)
- Verify database user credentials

**"CORS errors"**
- Update FRONTEND_URL in backend environment variables
- Make sure it matches your Netlify URL exactly
- Redeploy backend after changing

### Frontend Issues

**"Cannot connect to API"**
- Verify REACT_APP_API_URL is correct
- Make sure it includes `/api` at the end
- Check Network tab in browser DevTools
- Verify backend is running

**"Build failed"**
- Check Build Logs in Netlify
- Make sure package.json has all dependencies
- Try building locally first: `npm run build`

**"White screen"**
- Check browser console for errors
- Verify REACT_APP_API_URL environment variable
- Clear cache and hard reload (Ctrl+Shift+R)

### Database Issues

**"Authentication failed"**
- Verify database user password in connection string
- Check Database Access in MongoDB Atlas
- Make sure user has Read/Write permissions

**"Connection timeout"**
- Check Network Access in Atlas
- Verify IP address is whitelisted (0.0.0.0/0)

---

## Monitoring & Maintenance

### Check Application Health

**Backend Health Check**
```
GET https://your-backend-url.onrender.com/api/health
```
Should return: `{"success": true, "message": "West Fund API is running"}`

### View Logs

**Render:**
- Go to dashboard → Select service → "Logs" tab

**Netlify:**
- Go to site → "Deploys" → Click deploy → "Deploy log"

### Update Application

**Auto-deploy (Recommended):**
1. Make changes locally
2. Commit and push to GitHub
3. Render and Netlify auto-deploy

**Manual deploy:**
- Render: Click "Manual Deploy" → "Deploy latest commit"
- Netlify: Click "Trigger deploy" → "Deploy site"

---

## Cost Breakdown

### Free Tier Limits

**MongoDB Atlas Free (M0):**
- 512 MB storage
- Shared RAM
- Perfect for demo/small apps

**Render Free:**
- 750 hours/month
- Sleeps after 15 min inactivity
- Wakes on request (30 sec delay)

**Netlify Free:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Perfect for demo apps

### When You'll Need to Upgrade

- **Traffic > 10,000 visitors/month** → Upgrade Netlify
- **Database > 512 MB** → Upgrade MongoDB Atlas
- **Need 24/7 uptime** → Upgrade Render (backend stays awake)

### Paid Tier Pricing

- MongoDB Atlas: $0.08/hr (M10) ≈ $57/month
- Render: $7/month (no sleep)
- Netlify Pro: $19/month
- **Total**: ~$80-100/month for production

---

## Security Checklist

Before going live:

- [ ] Change JWT_SECRET to strong random string
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB Atlas audit logs
- [ ] Set up proper CORS origins (not *)
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Backup database regularly
- [ ] Monitor for suspicious activity

---

## Custom Domain Setup

### For Netlify (Frontend)

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Netlify: "Domain settings" → "Add custom domain"
3. Enter your domain (e.g., westfund.com)
4. Update DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
5. Wait for DNS propagation (up to 48 hours)
6. Netlify auto-provisions SSL

### For Render (Backend)

Custom domains on Render require paid plan ($7/month)

---

## Success! 🎉

Your West Fund banking app is now live!

**Share these URLs:**
- Frontend: https://your-site.netlify.app
- Backend API: https://your-backend.onrender.com/api
- Admin login: admin@westfund.com / admin123

**Next steps:**
1. Test all features
2. Monitor logs for errors
3. Share with friends/portfolio
4. Add to your resume/GitHub

**Remember**: This is a demo app. Always include disclaimer about no real transactions!

---

Need help? Check main README.md or Render/Netlify documentation.
