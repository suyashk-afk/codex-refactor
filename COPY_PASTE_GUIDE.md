# 📋 Copy-Paste Guide - Just Follow These Steps!

## ✅ Everything is configured! Just do these 3 things:

---

## 🔧 Step 1: Set Environment Variables in Render

1. Go to: https://dashboard.render.com/
2. Click on your **codex-refactor** service
3. Click **Environment** tab on the left
4. Click **Add Environment Variable** button
5. Copy-paste these **one by one**:

### Variable 1:
**Key:**
```
GEMINI_API_KEY
```
**Value:**
```
YOUR_ACTUAL_API_KEY_HERE
```
👉 Get your free API key from: https://aistudio.google.com/app/apikey

### Variable 2:
**Key:**
```
FRONTEND_URL
```
**Value:**
```
https://codex-refactor-mkjd.vercel.app
```

### Variable 3:
**Key:**
```
NODE_ENV
```
**Value:**
```
production
```

6. Click **Save Changes** (this will redeploy your backend)

---

## 🎨 Step 2: Set Environment Variable in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **codex-refactor-mkjd** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left menu
5. Click **Add New** button
6. Copy-paste this:

**Key:**
```
VITE_API_URL
```
**Value:**
```
https://codex-refactor.onrender.com
```

7. Click **Save**
8. Go to **Deployments** tab
9. Click the **...** menu on the latest deployment
10. Click **Redeploy** → **Redeploy**

---

## 🚀 Step 3: Commit and Push (Optional but Recommended)

Open your terminal and run:

```bash
git add .
git commit -m "Configure deployment URLs"
git push
```

This will trigger automatic redeployments with the new configuration.

---

## ✅ That's It!

Wait 5-10 minutes for deployments to complete, then visit:

👉 **https://codex-refactor-mkjd.vercel.app**

Your app should be fully working! 🎉

---

## 🧪 Quick Test

1. Visit https://codex-refactor-mkjd.vercel.app
2. Paste this code:
```javascript
function test() {
  console.log("Hello World");
}
```
3. Click "Analyze Code"
4. You should see quality score and analysis!

---

## 🐛 If Something's Wrong

### CORS Error?
- Make sure `FRONTEND_URL` in Render is exactly: `https://codex-refactor-mkjd.vercel.app`
- No spaces, no trailing slash
- Redeploy in Render after fixing

### API Not Working?
- Make sure `VITE_API_URL` in Vercel is exactly: `https://codex-refactor.onrender.com`
- Redeploy in Vercel after fixing

### Mr. Smith Not Working?
- Make sure you added your real `GEMINI_API_KEY` in Render
- Get it from: https://aistudio.google.com/app/apikey

---

## 📞 Your URLs

- **Live App:** https://codex-refactor-mkjd.vercel.app
- **Backend API:** https://codex-refactor.onrender.com
- **Render Dashboard:** https://dashboard.render.com/
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**That's all! Your app is ready to go! 🚀**
