# Pathfinder — AI Career Roadmap Generator

Pathfinder is an **AI-powered learning path generator** that helps users design personalized, goal-based career roadmaps with interactive visualizations.

Built with **Next.js 16**, **Node.js**, and **Google Gemini AI** enhanced with **Supermemory** for contextual learning, it creates structured learning plans based on user goals, available time, and effort — with real-time progress tracking through interactive flowchart visualizations.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure login/register with JWT (access + refresh tokens)
  - NextAuth.js integration with credential-based authentication
  - Passwords hashed with bcrypt

- 🧠 **AI Roadmap Generation (Gemini API + Supermemory)**
  - Generate personalized learning paths using Google Gemini 2.5 Flash
  - **Supermemory integration** maintains context across path regenerations
  - Regenerate paths with feedback that builds on previous iterations
  - AI remembers your preferences, feedback, and learning style
  - Each roadmap includes 5-8 checkpoints with durations & descriptions
  - Feasibility score (0-100) based on timeframe and goal complexity
  - Context-aware generation that improves with each interaction

- 📍 **Interactive Checkpoint Management**
  - Visual flowchart representation using React Flow
  - Add, edit, delete, and reorder checkpoints manually
  - Mark checkpoints as complete/incomplete with visual feedback
  - AI-generated checkpoints with smart ordering
  - Detailed checkpoint modal with task breakdown

- 📊 **Path Progress Tracking**
  - Real-time completion percentage calculation
  - Progress bars on dashboard and path detail views
  - Track completion across checkpoints and sub-tasks
  - Visual progress indicators with theme-aware styling

- 🎨 **Modern UI/UX**
  - Dark/Light theme support with smooth transitions
  - Responsive design for mobile and desktop
  - Glassmorphism effects and smooth animations
  - Custom fonts (Playfair Display, Inter)
  - Tailwind CSS with custom color schemes

- 🔄 **Path Management**
  - View all paths in a grid layout on dashboard
  - Regenerate paths with custom feedback
  - Delete paths with confirmation modal
  - Edit timeframes and descriptions

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| **Authentication** | NextAuth.js v5 (Credentials Provider) |
| **State Management** | React Hooks + Context API |
| **Visualizations** | React Flow (Interactive Flowcharts) |
| **Theme System** | next-themes with custom provider |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Integration** | Google Gemini API (gemini-2.5-flash) |
| **Memory Layer** | Supermemory (Context Retention) |
| **Auth Backend** | JWT (Access + Refresh Tokens) |
| **Password Security** | bcrypt |
| **API Communication** | Fetch API with JWT bearer tokens |
| **Version Control** | Git & GitHub |

---

## 🧠 Supermemory Integration

**Supermemory** acts as a persistent memory layer for Gemini AI, enabling:

### Context Retention Across Regenerations
- Stores previous path structures and user feedback
- Maintains conversation history for each user's learning journey
- Remembers user preferences and learning patterns

### Smart Path Regeneration
When you regenerate a path, Supermemory provides Gemini with:
- Your original goal and timeframe
- Previous checkpoint structures
- Your feedback on what worked/didn't work
- Context about your learning style and preferences

### Example Flow
```
1. User generates initial path → Supermemory stores context
2. User provides feedback: "Too focused on theory, need more projects"
3. Regeneration → Gemini receives Supermemory context + feedback
4. AI adjusts: More project-based checkpoints while maintaining structure
5. New context stored → Future regenerations get even smarter
```

### Benefits
- **Personalized Learning**: Each regeneration better understands your needs
- **Consistent Quality**: AI maintains coherence across multiple iterations
- **Iterative Improvement**: Paths get better with each feedback cycle
- **Memory Persistence**: Context survives across sessions

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
│   │   │   ├── ai.service.js
│   │   │   └── supermemory.service.js
│   │   ├── utils/
│   │   │   └── generateTokens.js
│   │   └── server.js
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── app/
│   │   ├── (landing)/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   ├── create-path/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── path/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── providers.tsx
│   ├── components/
│   │   ├── flow/
│   │   │   └── CheckpointNode.tsx
│   │   ├── AnimatedSection.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── featuresData.ts
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
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
- Supermemory API key (for context retention)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Evilstein-debug/pathfinder.git
cd pathfinder/backend

# Install dependencies
npm install

# Create .env file with the following variables:
MONGODB_URI=your_mongodb_connection_string
PORT=8000
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=__m
REFRESH_TOKEN_EXPIRY=__d
GEMINI_API_KEY=your_gemini_api_key
SUPERMEMORY_API_KEY=your_supermemory_api_key

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

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
                                   # Body: { goalType, timeframe, userGoalDescription }
                                   # Context stored in Supermemory automatically
POST   /api/ai/regenerate-path/:id # Regenerate existing path (Protected)
                                   # Body: { timeframe?, userGoalDescription, feedback? }
                                   # Retrieves context from Supermemory for continuity
```

### Path Management
```
GET    /api/paths/all              # Get all user paths (Protected)
GET    /api/paths/details/:id      # Get single path with checkpoints (Protected)
PUT    /api/paths/update/:id       # Update path metadata (Protected)
DELETE /api/paths/delete/:id       # Delete path and checkpoints (Protected)
```

### Checkpoint Management
```
GET    /api/checkpoints/:pathId              # Get all checkpoints for a path (Protected)
POST   /api/checkpoints/:pathId/add          # Add checkpoint (Protected)
PUT    /api/checkpoints/update/:checkpointId # Update checkpoint (Protected)
PATCH  /api/checkpoints/toggle/:checkpointId # Toggle completion status (Protected)
DELETE /api/checkpoints/delete/:checkpointId # Delete checkpoint (Protected)
PUT    /api/checkpoints/:pathId/reorder      # Reorder checkpoints (Protected)
```

**Note:** All protected routes require `Authorization: Bearer <access_token>` header.

---

## 🤖 AI Generation Example

**Initial Generation Request:**
```json
POST /api/ai/generate-path
Authorization: Bearer <your_access_token>

{
  "goalType": "shortTerm",
  "timeframe": 6,
  "userGoalDescription": "I want to become a frontend developer with React expertise"
}
```

**Response:**
```json
{
  "message": "AI-generated path created successfully",
  "path": {
    "_id": "path_123",
    "title": "Frontend Developer Path",
    "goalType": "shortTerm",
    "timeframe": 6,
    "feasibilityScore": 85,
    "feasibilityReason": "6 months provides adequate time for mastering fundamentals...",
    "userGoalDescription": "I want to become a frontend developer with React expertise",
    "checkpoints": [
      {
        "_id": "cp_1",
        "title": "HTML & CSS Fundamentals",
        "description": "Master semantic HTML5 and modern CSS including Flexbox and Grid...",
        "duration": "3 weeks",
        "order": 1,
        "completed": false
      }
      // ... 4-7 more checkpoints
    ],
    "createdAt": "2025-11-30T...",
    "updatedAt": "2025-11-30T..."
  }
}
```

**Regeneration Request (with Supermemory context):**
```json
POST /api/ai/regenerate-path/path_123
Authorization: Bearer <your_access_token>

{
  "timeframe": 6,
  "userGoalDescription": "I want to become a frontend developer with React expertise",
  "feedback": "The path is too theory-heavy. I need more hands-on projects and real-world applications."
}
```

**Regeneration Response:**
```json
{
  "message": "Path regenerated successfully",
  "path": {
    "_id": "path_123",
    "title": "Frontend Developer Path (Project-Focused)",
    "feasibilityScore": 88,
    "checkpoints": [
      {
        "title": "HTML & CSS - Build a Portfolio Landing Page",
        "description": "Learn by building: Create a responsive portfolio with modern CSS...",
        "duration": "2 weeks"
      },
      {
        "title": "JavaScript Fundamentals - Interactive Calculator",
        "description": "Master JS basics by building a functional calculator app...",
        "duration": "3 weeks"
      }
      // ... more project-based checkpoints
    ]
  }
}
```

**Note:** Supermemory ensures the regenerated path:
- Remembers the original structure and learning objectives
- Incorporates the feedback about needing more projects
- Maintains appropriate difficulty progression
- Keeps the timeframe and feasibility considerations

---

## 🎯 Key Features Explained

### Supermemory Context Flow
```
┌─────────────────┐
│ User Generates  │
│   First Path    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supermemory    │◄──── Stores: Goal, Timeframe,
│    Stores       │      Original Checkpoints
│    Context      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ User Provides   │
│    Feedback     │──────► "Too theoretical"
└────────┬────────┘      "Need more projects"
         │
         ▼
┌─────────────────┐
│   Regenerate    │
│      Path       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Gemini AI    │◄──── Retrieves context from
│   + Context     │      Supermemory + Feedback
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Improved Path  │
│  with Projects  │
└─────────────────┘
```

### Progress Calculation
The dashboard displays accurate completion percentages by:
1. Checking for explicit progress fields from the API
2. Computing progress from checkpoint completion status
3. Aggregating sub-task completion when available
4. Normalizing values to 0-100% range

### Theme System
- Automatic dark/light theme detection
- Manual theme switching with persistent storage
- Theme-aware components throughout the app
- Smooth transitions between themes

### Interactive Flowchart
- React Flow-powered visualization
- Custom checkpoint nodes with completion status
- Visual connections between checkpoints
- Click to view detailed checkpoint information
- Toggle completion directly from flowchart

### Path Regeneration with Memory
- **Context Preservation**: Supermemory maintains full conversation history
- **Smart Improvements**: AI builds on previous iterations instead of starting fresh
- **Feedback Loop**: Each regeneration gets smarter with accumulated context
- **Consistency**: Maintains learning objectives while incorporating changes

---

## 🔐 Security Features

- JWT-based authentication with access/refresh token rotation
- NextAuth.js credential provider integration
- Bcrypt password hashing (10 salt rounds)
- Protected API routes with middleware
- Secure HTTP-only cookie handling
- CORS configuration for frontend-backend communication
- Environment variable protection
- Supermemory data isolation per user

---

## 🚧 Current Status & Roadmap

### ✅ Completed
- [x] User authentication (register/login/logout)
- [x] AI path generation with Gemini API
- [x] **Supermemory integration for context retention**
- [x] Path regeneration with feedback and memory
- [x] Interactive flowchart visualization
- [x] Checkpoint management (CRUD operations)
- [x] Progress tracking and dashboard
- [x] Dark/Light theme support
- [x] Responsive design
- [x] Path deletion with confirmation

### 🔄 In Progress
- [ ] Enhanced Supermemory analytics (learning pattern insights)
- [ ] Email notifications for milestone reminders
- [ ] Advanced analytics dashboard with charts
- [ ] Social sharing of completed paths
- [ ] Community path templates

### 🎯 Future Enhancements
- [ ] Supermemory-powered learning style recommendations
- [ ] AI-suggested path adjustments based on progress patterns
- [ ] Collaborative paths (team learning)
- [ ] Path duplication/templates
- [ ] Export paths to PDF/Markdown
- [ ] Integration with learning platforms
- [ ] Gamification features (badges, streaks)
- [ ] Advanced memory analytics dashboard

---

## 👨‍💻 Author

**Tejas Pathak**
- GitHub: [@Evilstein-debug](https://github.com/Evilstein-debug)
- LinkedIn: [Tejas Pathak](https://www.linkedin.com/in/tejas-pathak-8b289a283/)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Google Gemini API for AI-powered path generation
- Supermemory for intelligent context retention and memory management
- MongoDB Atlas for database hosting
- Vercel for Next.js framework
- React Flow for interactive visualizations
- The MERN stack community

---

**Built with ❤️ by Tejas Pathak**