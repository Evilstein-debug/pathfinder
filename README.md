# 🧭 PathFinder — AI Career Roadmap Generator

PathFinder is an **AI-powered learning path generator** that helps users design personalized, goal-based career roadmaps.

Built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Gemini AI**, it creates structured learning plans based on user goals, available time, and effort — and lets them **track progress** with interactive checkpoints.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure login/register with JWT (access + refresh tokens)
  - Passwords hashed with bcrypt

- 🧠 **AI Roadmap Generation (Gemini API)**
  - Generate personalized learning paths (e.g., "Full Stack Developer in 6 months")
  - Each roadmap includes multiple checkpoints with durations & descriptions
  - Feasibility score based on timeframe and goal complexity

- 📍 **Checkpoint Management**
  - Add, edit, delete, and reorder checkpoints manually
  - Mark checkpoints as complete/incomplete
  - AI-generated checkpoints with smart ordering

- 📊 **Path Progress Tracking**
  - Track completion percentage
  - View time estimates and milestone details
  - Monitor learning journey across multiple paths

- 🌐 **RESTful API**
  - Clean, documented routes for easy frontend integration

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS |
| **State Management** | Zustand |
| **Data Visualization** | Recharts / React Flow |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Integration** | Google Gemini API (gemini-1.5-flash) |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **Password Security** | bcrypt |
| **API Testing** | Postman |
| **Version Control** | Git & GitHub |

---

## 🗂️ Project Structure

```
pathfinder/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── path.controller.js
│   │   │   ├── checkpoint.controller.js
│   │   │   └── ai.controller.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── path.model.js
│   │   │   └── checkpoint.model.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── pathRoutes.js
│   │   │   ├── checkpointRoutes.js
│   │   │   └── aiRoutes.js
│   │   ├── services/
│   │   │   └── gemini.service.js
│   │   ├── utils/
│   │   │   └── generateTokens.js
│   │   └── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── store/
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── package.json
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Google Gemini API key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Evilstein-debug/pathfinder.git
cd pathfinder/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your environment variables
MONGODB_URI=your_mongodb_connection_string
PORT=8000
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=..
REFRESH_TOKEN_EXPIRY=..
GEMINI_API_KEY=your_gemini_api_key

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/refresh           # Refresh access token
POST   /api/auth/logout            # Logout user (Protected)
```

### AI Path Generation
```
POST   /api/ai/generate-path       # Generate AI-powered path (Protected)
POST   /api/ai/regenerate-path/:id # Regenerate existing path (Protected)
```

### Path Management
```
GET    /api/paths/all              # Get all user paths (Protected)
GET    /api/paths/details/:id      # Get single path (Protected)
PUT    /api/paths/update/:id       # Update path (Protected)
DELETE /api/paths/delete/:id       # Delete path (Protected)
```

### Checkpoint Management
```
GET    /api/checkpoints/:pathId              # Get all checkpoints for a path (Protected)
POST   /api/checkpoints/:pathId/add          # Add checkpoint (Protected)
PUT    /api/checkpoints/update/:checkpointId # Update checkpoint (Protected)
PATCH  /api/checkpoints/toggle/:checkpointId # Toggle completion (Protected)
DELETE /api/checkpoints/delete/:checkpointId # Delete checkpoint (Protected)
PUT    /api/checkpoints/:pathId/reorder      # Reorder checkpoints (Protected)
```

---

## 🤖 AI Generation Example

**Request:**
```json
POST /api/ai/generate-path
{
  "goalType": "shortTerm",
  "timeframe": 6,
  "userGoalDescription": "I want to become a frontend developer"
}
```

**Response:**
```json
{
  "message": "AI-generated path created successfully",
  "path": {
    "title": "Frontend Developer Path",
    "goalType": "shortTerm",
    "timeframe": 6,
    "feasibilityScore": 85,
    "checkpoints": [
      {
        "title": "HTML & CSS Fundamentals",
        "description": "Master semantic HTML5 and modern CSS...",
        "duration": "3 weeks",
        "order": 1
      }
      // ... more checkpoints
    ]
  }
}
```

---

## 🔐 Security Features

- JWT-based authentication with access/refresh token rotation
- Bcrypt password hashing
- Protected routes with authentication middleware
- CORS configuration
- Environment variable protection

---

## 🚧 Roadmap

- [ ] Frontend development (Next.js + TypeScript)
- [ ] Interactive roadmap visualization (React Flow)
- [ ] Progress analytics dashboard (Recharts)
- [ ] Email notifications for milestone reminders
- [ ] Social sharing of completed paths
- [ ] Community path templates
- [ ] Mobile responsive design

---

## 👨‍💻 Author

**Tejas Pathak**
- GitHub: [@Evilstein-debug](https://github.com/Evilstein-debug)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/tejas-pathak-8b289a283/)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Google Gemini API for AI-powered path generation
- MongoDB Atlas for database hosting
- The MERN stack community