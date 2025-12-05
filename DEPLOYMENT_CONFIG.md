# 🚀 Your Deployment Configuration

## ✅ URLs Configured

- **Backend (Render):** https://codex-refactor.onrender.com
- **Frontend (Vercel):** https://codex-refactor-mkjd.vercel.app

---

## 📋 Environment Variables to Set

### 🔧 Render Backend Environment Variables

Go to your Render dashboard → Your service → Environment tab

Add these variables:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
FRONTEND_URL=https://codex-refactor-mkjd.vercel.app
NODE_ENV=production
```

**Important:** Replace `your_actual_gemini_api_key_here` with your real Gemini API key from https://aistudio.google.com/app/apikey

---

### 🎨 Vercel Frontend Environment Variables

Go to your Vercel dashboard → Your project → Settings → Environment Variables

Add this variable:

```
VITE_API_URL=https://codex-refactor.onrender.com
```

---

## ✅ What's Already Done

I've configured your code with the correct URLs:

1. ✅ Updated `frontend/.env.production` with your Render URL
2. ✅ Created `frontend/.env.local` for local development
3. ✅ Backend CORS already configured to accept your Vercel domain
4. ✅ Frontend API calls already configured to use environment variables

---

## 🔄 Next Steps

### Step 1: Set Environment Variables in Render

1. Go to https://dashboard.render.com/
2. Click on your `codex-refactor` service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable from the list above
6. Click **Save Changes** (this will trigger a redeploy)

### Step 2: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Click on your `codex-refactor-mkjd` project
3. Go to **Settings** → **Environment Variables**
4. Add the `VITE_API_URL` variable
5. Click **Save**
6. Go to **Deployments** tab
7. Click the **...** menu on the latest deployment
8. Click **Redeploy** (to apply the new environment variable)

### Step 3: Commit and Push Changes

The environment files I created need to be committed:

```bash
git add frontend/.env.local frontend/.env.production DEPLOYMENT_CONFIG.md
git commit -m "Configure deployment URLs for Render and Vercel"
git push
```

This will trigger automatic redeployments on both Render and Vercel.

### Step 4: Test Your Live App

1. Wait for both deployments to complete (5-10 minutes)
2. Visit https://codex-refactor-mkjd.vercel.app
3. Try analyzing some code
4. Check browser console for any errors
5. If you see CORS errors, double-check the environment variables

---

## 🧪 Testing Checklist

Visit https://codex-refactor-mkjd.vercel.app and test:

- [ ] Page loads without errors
- [ ] Paste code and click "Analyze Code"
- [ ] Analysis results appear
- [ ] Mr. Smith analysis appears
- [ ] Click "Suggest Refactors"
- [ ] Refactoring suggestions appear
- [ ] Try repository analysis
- [ ] Try time machine feature
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### If you see CORS errors:

1. Check that `FRONTEND_URL` in Render is exactly: `https://codex-refactor-mkjd.vercel.app`
2. No trailing slash!
3. After changing, manually redeploy in Render dashboard

### If API calls fail:

1. Check that `VITE_API_URL` in Vercel is exactly: `https://codex-refactor.onrender.com`
2. After changing, redeploy in Vercel dashboard
3. Check Render logs for backend errors

### If Gemini AI doesn't work:

1. Make sure you added `GEMINI_API_KEY` in Render
2. Get a free key from: https://aistudio.google.com/app/apikey
3. Redeploy after adding the key

---

## 📞 Quick Reference

**Your URLs:**
- Live App: https://codex-refactor-mkjd.vercel.app
- Backend API: https://codex-refactor.onrender.com
- Render Dashboard: https://dashboard.render.com/
- Vercel Dashboard: https://vercel.com/dashboard

**Environment Variables:**

Render:
```
GEMINI_API_KEY=<your_key>
FRONTEND_URL=https://codex-refactor-mkjd.vercel.app
NODE_ENV=production
```

Vercel:
```
VITE_API_URL=https://codex-refactor.onrender.com
```

---

## ✨ You're Almost Done!

Just set those environment variables in Render and Vercel, then your app will be fully live! 🎉
