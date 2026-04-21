# Project Folder Structure

## Complete Directory Tree

```
ai_notes/
│
├── README.md                    # Main documentation
├── QUICKSTART.md               # Quick start guide for beginners
│
├── server/                     # Backend (Node.js + Express)
│   ├── package.json            # Dependencies and scripts
│   ├── server.js               # Main server file
│   ├── .env                    # Environment variables (CREATE THIS)
│   ├── .env.example            # Example env file
│   ├── .gitignore              # Git ignore rules
│   │
│   ├── models/
│   │   └── Note.js             # MongoDB Note schema
│   │
│   ├── routes/
│   │   └── noteRoutes.js       # API endpoints
│   │
│   ├── uploads/                # Folder for uploaded files (auto-created)
│   │
│   └── node_modules/           # Dependencies (auto-created)
│
└── client/                     # Frontend (React)
    ├── package.json            # Dependencies and scripts
    ├── .env                    # Environment variables
    ├── .env.example            # Example env file
    ├── .gitignore              # Git ignore rules
    │
    ├── public/
    │   └── index.html          # HTML template
    │
    ├── src/
    │   ├── index.js            # React entry point
    │   ├── index.css           # Global styles
    │   ├── App.js              # Main App component
    │   │
    │   └── components/         # Reusable React components
    │       ├── NoteInput.js            # Input form component
    │       ├── SummaryDisplay.js       # Summary display component
    │       ├── ExplanationDisplay.js   # Explanation display component
    │       └── QuizDisplay.js          # Quiz component
    │
    └── node_modules/           # Dependencies (auto-created)
```

## File Descriptions

### Backend Files

| File | Purpose |
|------|---------|
| `server.js` | Main Express server, handles middleware and connects to DB |
| `models/Note.js` | MongoDB schema for storing notes and AI responses |
| `routes/noteRoutes.js` | API endpoints for summarize, explain, quiz operations |
| `.env` | Stores sensitive data (API keys, DB URI) - CREATE THIS |
| `package.json` | Lists all npm dependencies and scripts |

### Frontend Files

| File | Purpose |
|------|---------|
| `src/App.js` | Main React component, handles state and routing |
| `src/index.js` | Entry point for React app |
| `src/index.css` | Global CSS and animations |
| `components/NoteInput.js` | Component for text input and file upload |
| `components/SummaryDisplay.js` | Displays summarized content |
| `components/ExplanationDisplay.js` | Displays simple explanation |
| `components/QuizDisplay.js` | Displays and handles quiz |
| `public/index.html` | HTML template (includes Tailwind CSS link) |
| `.env` | Frontend configuration (API URL) |

## What Gets Created When You Run It

After running `npm install` and starting the app:

```
server/
├── node_modules/               # 1000+ dependency files
└── uploads/                    # Uploaded PDFs stored here

client/
└── node_modules/               # 1000+ dependency files
```

These folders are ignored in `.gitignore` so they won't be committed to git.

## Environment Variables to Create

### server/.env
```
MONGODB_URI=mongodb://localhost:27017/smart_notes_ai
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### client/.env
```
REACT_APP_API_URL=http://localhost:5000
```

## Port Information

- **Frontend**: http://localhost:3000 (React app)
- **Backend API**: http://localhost:5000 (Express server)
- **MongoDB**: localhost:27017 (Database)

## Key Technologies Used

| Component | Technology |
|-----------|------------|
| Server | Node.js + Express |
| Database | MongoDB |
| Frontend | React + Tailwind CSS |
| File Upload | Multer |
| API Calls | Axios |
| PDF Reading | pdf-parse |
| AI | Gemini API |

## How Data Flows

```
User Input (Text/PDF)
    ↓
React Component (Frontend)
    ↓
Axios HTTP Request to Backend
    ↓
Express API Route (server)
    ↓
PDF/Text Processing
    ↓
Gemini API Call
    ↓
Save to MongoDB
    ↓
Send Response back to Frontend
    ↓
Display Result
```

## Notes

- `.env` files are NOT included in version control (see .gitignore)
- `node_modules/` is NOT included in version control
- `uploads/` folder stores temporary uploaded files
- All API keys should be kept SECRET and never committed

---

For more details, see README.md and QUICKSTART.md
