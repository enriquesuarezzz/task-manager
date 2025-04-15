# 🧠 Task manager — Full Stack

A full-stack task management app with drag-and-drop features, task creation/editing, and real-time state syncing. Built with **Next.js (Frontend)** and **Node.js + MongoDB (Backend)**.


## 🚀 Features

- 📋 Create, edit, and delete tasks
- 🏷️ Organize tasks by status: Pending, Ongoing, Done
- 🖱️ Drag and drop tasks between columns
- 📅 Set task details including due dates and priority
- 🎨 Clean UI with Tailwind CSS
- 🔄 Frontend and backend integration via REST API

---

## 🛠 Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- @hello-pangea/dnd

### Backend
- Node.js
- Express
- MongoDB (with Mongoose)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

---

## 📁 Repository Structure

The project is split into two separate repositories:

- **Frontend Repo**: https://github.com/enriquesuarezzz/task-manager
- **Backend Repo**: https://github.com/enriquesuarezzz/task-manager-api

---

## ⚙️ Setup Instructions

### 🔷 Frontend (Next.js)

```bash
git clone https://github.com/enriquesuarezzz/task-manager.git
cd task-manager
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000/api
```

Run development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

### 🔶 Backend (Node.js + MongoDB)

```bash
git clone https://github.com/enriquesuarezzz/task-manager-api.git
cd task-manager-api
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI='paste_your_mongo_uri'
```

Start the server:

```bash
node server.mjs
```

The backend API will be available at `http://localhost:5000/api`

