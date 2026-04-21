# ⚡ Quick Start Guide - Smart Notes AI

## For Windows Users

### Step 1: Install MongoDB (Skip if using MongoDB Atlas)

```
Download: https://www.mongodb.com/try/download/community
Run installer and follow instructions
Or use MongoDB Compass (GUI tool)
```

### Step 2: Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign up and login
3. Go to API keys → Create new secret key
4. Copy the key (you'll use this in .env)

### Step 3: Setup Backend

```bash
# Open PowerShell in the ai_notes folder
cd server

# Install packages
npm install

# Create .env file (or copy .env.example)
# Edit .env and add your Gemini API key and MongoDB URI

# Start backend server
npm start
# You should see: "Server running on port 5000"
# And: "MongoDB connected"
```

### Step 4: Setup Frontend

```bash
# Open another PowerShell window in ai_notes folder
cd client

# Install packages
npm install

# Start frontend
npm start
# Browser will open at http://localhost:3000
```

### Step 5: Test the App

1. Go to http://localhost:3000
2. Paste some text or upload a PDF
3. Click "Summarize" button
4. Wait for AI response
5. See the summary appear

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
# Delete and reinstall
rmdir node_modules /s /q
npm install
```

### Error: "MongoDB connection failed"
- Check if MongoDB is running (look for MongoDB service)
- Or use MongoDB Atlas (cloud)
- Update MONGODB_URI in .env

### Error: "Invalid API Key"
- Go to https://aistudio.google.com/app/apikey
- Create a new API key
- Update GEMINI_API_KEY in .env

### Error: "CORS error"
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check if firewall is blocking ports

## 📁 Important Files to Edit

1. **server/.env** - Add your API keys here
2. **client/.env** - Backend URL (usually stays the same)

## ✅ Quick Checklist

- [ ] Node.js installed
- [ ] MongoDB installed or have Atlas account
- [ ] Gemini API key ready
- [ ] Backend dependencies installed (npm install in server/)
- [ ] Frontend dependencies installed (npm install in client/)
- [ ] .env files created in both server/ and client/
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] App loads at http://localhost:3000

## 🎯 First Test

Try this text to test:

"JavaScript is a programming language used for web development. It runs in browsers and allows websites to be interactive. You can use JavaScript to create animations, validate forms, and make dynamic web pages."

Expected:
- Summary: Bullet points about JavaScript
- Explanation: Simple explanation for beginners
- Quiz: 5 multiple choice questions

## 🚀 Next Steps

1. Read the main README.md for full documentation
2. Explore the code to understand how it works
3. Try adding new features like:
   - User authentication
   - Save notes to favorites
   - Dark mode
   - Download results as PDF

## 📞 Still Having Issues?

1. Check the exact error message in console
2. Google the error message
3. Check if ports 3000 and 5000 are not in use
4. Restart both servers

---

Good luck! 🎉
