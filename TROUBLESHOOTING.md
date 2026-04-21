# 🆘 Troubleshooting Guide

## Common Issues and Solutions

### 1. Cannot Start Backend Server

**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
cd server
npm install
```

---

### 2. MongoDB Connection Error

**Error:** 
```
MongoDB connection failed
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution Option A: Use MongoDB Locally**
- Download MongoDB: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Verify in .env: `MONGODB_URI=mongodb://localhost:27017/smart_notes_ai`

**Solution Option B: Use MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Copy connection string
5. Update in .env:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_notes_ai
   ```

**Check if running:**
- Windows: Look for MongoDB service in Services
- Or run: `mongosh` in terminal

---

### 3. Gemini API Error

**Error:**
```
Error: 401 Unauthorized
Error: Invalid API key
```

**Solution:**
1. Check your Gemini quota and limits in Google AI Studio
2. Get a new API key: https://aistudio.google.com/app/apikey
3. Update in server/.env:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Restart backend server

**Note:** Gemini has its own rate limits and quotas depending on your Google AI Studio setup.

---

### 4. CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Make sure backend is running on port 5000
- Check frontend .env: `REACT_APP_API_URL=http://localhost:5000`
- Backend already has CORS enabled in `server.js`
- Restart both frontend and backend

---

### 5. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Windows PowerShell:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with number)
taskkill /PID 12345 /F

# Or just use different port
# For backend, change PORT in .env
# For frontend, set PORT=3001 before npm start
```

---

### 6. "Cannot find module" after npm install

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Delete and reinstall
cd server
rm -r node_modules
npm install

# Same for frontend
cd ../client
rm -r node_modules
npm install
```

---

### 7. Frontend Shows Blank Page

**Error:** Browser shows blank or white screen

**Solution:**
1. Open DevTools (F12) → Console tab
2. Check for error messages
3. Make sure backend is running (check terminal)
4. Check that REACT_APP_API_URL is correct
5. Try clearing browser cache (Ctrl+Shift+Delete)
6. Restart both servers

---

### 8. File Upload Not Working

**Error:**
```
Failed to upload file
File upload error
```

**Solution:**
- Check file size (max 10MB)
- Only .pdf and .txt files allowed
- Check that `uploads/` folder exists in `server/`
- Check file permissions
- Restart backend

---

### 9. AI Response Takes Too Long

**Error:** Spinner keeps spinning, no response after 30+ seconds

**Solution:**
- Gemini API might be slow
- Check internet connection
- Check API key is valid
- Try shorter text input
- Check Google AI Studio or Gemini service status

---

### 10. "npm: command not found"

**Error:**
```
npm: command not found
```

**Solution:**
- Node.js not installed
- Download from: https://nodejs.org/ (use LTS version)
- Install and restart PowerShell
- Verify: `npm --version`

---

### 11. Text/PDF Not Being Processed

**Error:** Sent text but got empty summary

**Solution:**
1. Check text is not empty
2. Check text length (at least 20 characters)
3. Check Gemini API key is valid
4. Check MongoDB connection
5. Try with different text

---

### 12. Quiz Generated Empty

**Error:** Quiz button shows but no questions

**Solution:**
- Gemini might not have returned clean JSON
- Try shorter text
- Try different text content
- Check API response in browser DevTools (Network tab)

---

### 13. Cannot Download/Copy Summary

**Error:** Copy button doesn't work or download fails

**Solution:**
- This is a browser security feature
- Try different browser
- Check browser permissions
- Right-click and "Save As" instead

---

### 14. "ENOENT: no such file or directory"

**Error:**
```
Error: ENOENT: no such file or directory, open 'uploads/...'
```

**Solution:**
```bash
# Create uploads folder manually
mkdir server/uploads

# Or it will auto-create on first file upload
```

---

### 15. Terminal Shows Chinese/Garbled Text

**Error:** Terminal output is unreadable characters

**Solution:**
- Change PowerShell encoding:
  ```powershell
  chcp 65001
  ```
- Or use Git Bash instead of PowerShell

---

## Quick Restart Guide

If nothing works, do a complete restart:

```bash
# Terminal 1: Stop everything (Ctrl+C)
# Terminal 2: Stop everything (Ctrl+C)

# Delete all node_modules
cd server
rm -r node_modules
cd ../client
rm -r node_modules

# Reinstall
cd server
npm install
npm start

# In new terminal
cd client
npm install
npm start
```

---

## Debugging Steps

1. **Check Error Message**
   - Read it carefully
   - Google the exact error

2. **Check Console**
   - Backend: Terminal where you ran `npm start`
   - Frontend: Browser DevTools (F12)

3. **Check Network**
   - Browser DevTools → Network tab
   - Look for red requests
   - Check response body

4. **Check Files**
   - Do all files exist?
   - Is .env in correct locations?
   - Do .env files have required variables?

5. **Check Ports**
   - Is port 3000 free?
   - Is port 5000 free?
   - Is MongoDB port 27017 free?

6. **Check Connections**
   - Can backend reach MongoDB?
   - Can frontend reach backend?
   - Can backend reach Gemini?

---

## Get Help

1. **Read Error Message Carefully** - It usually says what's wrong
2. **Google the Error** - Likely someone faced it before
3. **Check Configuration** - .env files and ports
4. **Check Network** - Are all services running?
5. **Restart Everything** - Turn it off and on again
6. **Review Code** - Look for typos or missing files

---

## Report a Bug

If you find a bug:
1. Write down exact steps to reproduce
2. Share the error message
3. Share terminal output
4. Share browser console errors
5. Share your code

---

**Remember: Most errors are typos or missing setup steps!**

Check:
✅ .env files exist and have values
✅ MongoDB is running
✅ Backend is on port 5000
✅ Frontend is on port 3000
✅ API key is valid
✅ All npm packages installed

Good luck! 🍀
