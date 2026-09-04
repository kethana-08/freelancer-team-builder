# Freelancer Team Builder — Intelligent Squad Assembly & Workspace Platform

**Freelancer Team Builder** is an intelligent full-stack MERN platform that helps clients specify project requirements, assign priorities to required skills, and automatically formulate optimized, synchronized squads of freelancers using a multi-attribute optimization engine. Once formed, the project seamlessly transitions into a collaborative workspace with interactive Kanban tasks, real-time Socket.IO chat, file repositories, milestone escrow releases, and audit logs.

---

## 🌟 Key Highlights & Capabilities

### 1. Intelligent Team Matching Engine
- **Priority-Weighted Multi-Attribute Scoring**: High (3.0x), Medium (2.0x), and Low (1.0x) weights for each required skill.
- **Synergy Maximization**: Evaluates skill coverage across candidates to find optimal complements (e.g. Lead Fullstack + UI/UX Designer + Cloud DevOps) rather than redundant duplicates.
- **3 Curated Team Presets**:
  1. **Balanced Recommendation (Best Match)**: Maximizes composite skill coverage, verified ratings, chemistry, and budget compliance.
  2. **Budget Optimized (Cost Saver)**: Minimizes combined hourly spend while guaranteeing baseline proficiency across all required competencies.
  3. **Elite Velocity Squad (Top Tier)**: Assembles top-rated senior veterans for mission-critical, rapid-delivery sprints.
- **Explainability & Radar Comparison**: Visual Recharts radar charts comparing project requirements vs squad coverage, with highlighted pros (✓) and potential warnings (⚠).

### 2. Dedicated 8-Tab Project Workspace
- **Overview**: Sprint completion bar, financial escrow tracker, squad roster, next milestone deliverable.
- **Tasks (Kanban)**: Backlog, Todo, In Progress, In Review, Done columns with subtasks checklists, priority badges, and comment threads.
- **Team**: Squad roster, individual rates, contributions, member removals and invite extensions.
- **Live Chat**: Real-time Socket.IO project channel with typing indicators and member presence.
- **Files**: Centralized asset repository with file type icons, uploader tags, and download links.
- **Milestones & Escrow**: Phase-based deliverables, deliverable submission notes/URLs by freelancers, and client payment approvals.
- **Activity Feed**: Real-time chronological audit trail of all project events.
- **Settings**: Project configurations, staging URLs, GitHub repository links, and project status toggles.

### 3. Role Portals
- **Client**: Project wizard with priority selector, matching reviews, team invitations, and milestone approvals.
- **Freelancer**: Rich skill matrix with proficiency sliders (0-100%), portfolio projects, GitHub profile stats, and invitation inbox.
- **Admin**: Platform oversight, user suspension/reactivation, project moderation, and skill taxonomy editor.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
> **Note on Database**: The server includes an **automatic in-memory MongoDB fallback** (`mongodb-memory-server`) with automatic seed data. If a local MongoDB instance is not running, it gracefully boots an embedded instance automatically.

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## 🔑 1-Click Demo Accounts

Use the **1-Click Demo Switcher** in the top navigation bar or log in directly with any of these pre-seeded accounts:

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Client** | Mark Sterling | `client@teambuilder.io` | `Password123!` |
| **Freelancer** | Alex Rivera (Fullstack) | `alex@teambuilder.io` | `Password123!` |
| **Freelancer** | Sarah Chen (UI/UX) | `sarah@teambuilder.io` | `Password123!` |
| **Freelancer** | Marcus Vance (DevOps) | `marcus@teambuilder.io` | `Password123!` |

---

## 📁 Project Structure

```
freelancer-team-builder/
├── server/
│   ├── src/
│   │   ├── config/             # DB connection & Cloudinary setup
│   │   ├── controllers/        # Auth, User, Project, Matching, Task, Chat, Milestone, Admin
│   │   ├── middleware/         # JWT Auth, Role RBAC, Multer upload, Central Error Handler
│   │   ├── models/             # User, Project, Task, Message, Milestone, File, Invitation, Skill, Activity
│   │   ├── routes/             # Express API endpoints
│   │   ├── services/           # Matching Engine & Socket.IO Handler
│   │   ├── utils/              # Seed data & JWT generator
│   │   └── server.js           # Server entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Badge, Modal, Avatar, ProgressBar
│   │   │   ├── matching/       # RadarSkillChart, SkillPrioritySelector, TeamRecommendationCard
│   │   │   ├── workspace/      # OverviewTab, TasksTab, TeamTab, ChatTab, FilesTab, MilestonesTab, ActivityTab, SettingsTab
│   │   │   └── layout/         # Navbar with Demo Switcher, Footer, ProtectedRoute
│   │   ├── context/            # AuthContext, SocketContext, ToastContext
│   │   ├── pages/              # Landing, Login, Register, ClientDashboard, CreateProject, TeamMatchResult,
│   │   │                       # FreelancerDashboard, FreelancerProfile, FreelancersDirectory, ProjectWorkspace, AdminDashboard
│   │   ├── services/           # Axios API services
│   │   ├── App.jsx             # React Router v6 mapping
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```
