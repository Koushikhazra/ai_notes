# Smart Notes AI - MERN Stack Application

A full-stack web application that uses AI to summarize, explain, and generate quiz questions from your notes.

## 📋 Features

✅ **Summarize** - Get concise bullet points from your content  
✅ **Simple Explanation** - Understand complex topics in simple terms  
✅ **Generate Quiz** - Create multiple-choice questions to test your knowledge  
✅ **PDF Upload** - Upload PDF files directly  
✅ **Text Input** - Paste text directly into the app  
✅ **History** - View all your previous notes and results  
✅ **Clean UI** - Beautiful, responsive design with Tailwind CSS  

## 🏗️ Project Structure

```
ai_notes/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB schemas
│   │   └── Note.js
│   ├── routes/            # API endpoints
│   │   └── noteRoutes.js
│   ├── uploads/           # Uploaded files storage
│   ├── package.json
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── .gitignore
│
└── client/                # Frontend (React)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/    # React components
    │   │   ├── NoteInput.js
    │   │   ├── SummaryDisplay.js
    │   │   ├── ExplanationDisplay.js
    │   │   └── QuizDisplay.js
    │   ├── App.js         # Main App component
    │   ├── index.js       # Entry point
    │   ├── index.css      # Styles
    ├── package.json
    ├── .gitignore
    └── .env
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Axios (API calls)
- Tailwind CSS (Styling)

**Backend:**
- Node.js + Express
- MongoDB (Database)
- Multer (File upload)
- PDF-Parse (PDF extraction)
- Axios (Gemini API calls)

**AI:**
- Gemini API

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- Gemini API key

### Step 1: Clone or Download the Project

```bash
# Navigate to the project directory
cd ai_notes
```

### Step 2: Setup Backend

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file with your keys
# Edit .env file:
# MONGODB_URI=mongodb://localhost:27017/smart_notes_ai
# PORT=5000
# GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-2.5-flash

# Start the server
npm start
# Or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
# In a new terminal, navigate to client folder
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will automatically open on `http://localhost:3000`

## 🔑 Getting API Keys

### Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign up or login
3. Create an API key
4. Create a new API key
5. Copy it and paste in server/.env

### MongoDB Setup

**Option A: Local MongoDB**
- Download MongoDB Community from https://www.mongodb.com/try/download/community
- Install and run MongoDB
- Use `mongodb://localhost:27017/smart_notes_ai` in .env

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a cluster
- Get connection string
- Paste it in .env

## 🚀 How to Use

1. **Start Backend** (Terminal 1)
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd client
   npm start
   ```

3. **Open Browser**
   - Go to http://localhost:3000
   - You should see the Smart Notes AI app

4. **Use the App**
   - Paste text or upload a PDF
   - Click "Summarize", "Explain Simply", or "Generate Quiz"
   - View results and download if needed

## 📝 API Endpoints

### POST /api/notes/summarize
- Summarizes the input text
- Input: `text` (string) or `file` (PDF/TXT)
- Output: `summary` (string)

### POST /api/notes/explain
- Explains content in simple terms
- Input: `text` (string) or `file` (PDF/TXT)
- Output: `explanation` (string)

### POST /api/notes/quiz
- Generates quiz questions
- Input: `text` (string) or `file` (PDF/TXT)
- Output: `quiz` (array of questions)

### GET /api/notes
- Get all notes history
- Output: Array of all notes

### GET /api/notes/:id
- Get specific note by ID
- Output: Single note object

## 🎨 UI Features

- **Modern Design** - Clean and intuitive interface
- **Responsive** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - Easy to add dark theme
- **Loading Indicator** - Shows spinner while processing
- **Copy & Download** - Save results locally
- **Tab Navigation** - Switch between different sections

## ⚡ Common Issues & Solutions

### "Cannot find module" error
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### "MongoDB connection error"
- Check if MongoDB is running
- Verify connection string in .env
- For Atlas: Whitelist your IP address

### "Gemini API error"
- Check if API key is valid
- Check if you hit your Gemini quota/rate limit
- Verify GEMINI_API_KEY in .env

### CORS errors
- Ensure backend is running on port 5000
- Frontend should connect to http://localhost:5000

### File upload not working
- Check if `/server/uploads` folder exists
- Ensure file size is less than 10MB
- Only .pdf and .txt files are supported

## 🎓 Learning Path

This project teaches:
1. **React Basics** - Components, State, Props
2. **API Integration** - Axios, REST APIs
3. **File Handling** - PDF extraction, Multer
4. **Express Server** - Routing, Middleware
5. **MongoDB** - Schemas, CRUD operations
6. **AI Integration** - Gemini API usage
7. **Frontend Design** - Tailwind CSS styling

## 📚 Next Steps (Optional Features)

- Add user authentication (JWT)
- Add dark mode toggle
- Add note categories/tags
- Add sharing functionality
- Add export to PDF
- Add image recognition
- Deploy to Heroku/Vercel

## 🤝 Contributing

Feel free to fork this project and add your own features!

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Beginners

1. **Start Simple** - Try with short text first
2. **Check Console** - Open browser DevTools to see errors
3. **Read Logs** - Terminal output helps debug issues
4. **Ask Questions** - Comment your code to understand better
5. **Experiment** - Try different inputs to see how it works

## 🆘 Need Help?

- Check the error messages carefully
- Google the error message
- Check MongoDB/Express documentation
- Review your .env file for typos
- Restart the servers

---

**Happy Learning! 🎉**
