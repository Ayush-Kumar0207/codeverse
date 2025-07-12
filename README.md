# ⚡ CodeVerse – Real-Time Collaborative IDE with AI Assistance

[![Vercel Status](https://img.shields.io/badge/frontend-Vercel-black)](https://vercel.com) [![Render Status](https://img.shields.io/badge/backend-Render-blue)](https://render.com) [![MongoDB Atlas](https://img.shields.io/badge/database-MongoDB%20Atlas-green)](https://www.mongodb.com/atlas) [![MIT License](https://img.shields.io/badge/license-MIT-lightgrey)](#license)

> A modern, cloud-based platform for real-time collaborative coding, live code execution, version control, and AI-powered code suggestions.

## 🔗 Live Demo

🌐 [Try CodeVerse Live](https://codeverse-rho.vercel.app)

## 📂 Overview

CodeVerse is a feature-rich, web-based IDE designed for developers, students, and teams. It supports real-time collaborative coding, secure code execution, and AI-driven suggestions, all within an intuitive browser-based interface.

## ✨ Features

- 🧑‍💻 **Real-Time Collaboration**: Edit code simultaneously with teammates using Socket.IO.
- ⚙️ **Multi-File Projects**: Supports HTML/CSS/JS, Python, C, C++, Java, and Markdown.
- 💡 **AI Code Suggestions**: Powered by OpenAI and Ollama (CodeLlama) for intelligent code completion.
- 🗂️ **Version History**: Track and revert changes with MongoDB-backed snapshots.
- 🔐 **Secure Authentication**: GitHub OAuth and JWT for user access.
- 🧪 **Live Code Execution**: Run code in secure Docker containers.
- 📄 **Markdown Editor**: Write and preview Markdown with real-time rendering.
- 🌐 **HTML Preview**: View HTML/CSS/JS output instantly in the browser.
- 💬 **Live Chat**: Communicate with collaborators in real-time.
- 🧱 **Monaco Editor**: Syntax highlighting and IntelliSense for all supported languages.

## 🚀 Tech Stack

| Category            | Technologies                                    |
|---------------------|-------------------------------------------------|
| **Frontend**        | Next.js (App Router), React, Tailwind CSS, Monaco Editor |
| **Backend**         | Node.js, Express.js, Mongoose                   |
| **Database**        | MongoDB (Atlas)                                |
| **Real-Time**       | Socket.IO                                      |
| **AI Integration**  | OpenAI GPT / Codex, Ollama (CodeLlama)         |
| **Code Execution**  | Docker containers, Language Compilers          |
| **Authentication**  | GitHub OAuth, JWT                              |
| **Deployment**      | Vercel (frontend), Render (backend), MongoDB Atlas |

## 📸 Screenshots

| Editor | Live Preview 1 | Live Preview 2 |
|--------|----------------|----------------|
| ![Editor](https://github.com/user-attachments/assets/6fbc1676-8ef4-4d3c-9951-9445d502bc23) | ![Live Preview 1](https://github.com/user-attachments/assets/5feee449-79b8-4586-9ac7-97ea8bd1c127) | ![Live Preview 2](https://github.com/user-attachments/assets/1a351f39-5cc2-47a4-84ed-8f603da61b9f) |

| Code Execution & Version Control | Readme Support | Profile & Saved Codes | Home Page | Live Chat & AI |
|----------------------------------|----------------|-----------------------|-----------|----------------|
| ![Code Execution & Version Control](https://github.com/user-attachments/assets/72087c35-b741-407a-b424-9db42c24e2c5) | ![Readme Support](https://github.com/user-attachments/assets/9d447b51-0302-45ee-a64d-5a316e470588) | ![Profile & Saved Codes](https://github.com/user-attachments/assets/6a78161e-daf2-4754-b016-ec860703232d) | ![Home Page](https://github.com/user-attachments/assets/a957492e-4b9e-4289-ad46-fb63b7aba427) | ![Live Chat & AI](https://github.com/user-attachments/assets/a7d8ad2f-28c9-470f-9361-44297c897481) |

## 🧰 Installation (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/codeverse.git
cd codeverse
```

### 2. Start Backend

```bash
cd server
npm install
# Create a .env file with the required variables
npm start
```

### 3. Start Frontend

```bash
cd client
npm install
npm run dev
```

### 4. Environment Variables

**`/server/.env`**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GITHUB_CALLBACK_URL=https://your-backend.com/api/auth/github/callback
```

**`/client/.env.local` (optional)**
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.com
```

## 🧪 Supported Languages

- JavaScript (.js)
- Python (.py)
- C (.c)
- C++ (.cpp)
- Java (.java)
- HTML/CSS/JS (.html, .css, .js)
- Markdown (.md)

## 📚 How It Works

- **Real-Time Sync**: Socket.IO ensures code changes are instantly shared across users in a room.
- **Secure Execution**: Docker containers isolate and execute code for each language.
- **AI Suggestions**: OpenAI and Ollama APIs provide context-aware code completions.
- **Dynamic Editor**: Monaco Editor adapts syntax highlighting based on file type.
- **Data Storage**: MongoDB stores user data, projects, and version history.
- **Authentication**: GitHub OAuth and JWT ensure secure access.

## 📦 Deployment

### Frontend (Vercel)
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Backend (Render)
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

## 💡 Future Improvements

- 🧑‍🤝‍🧑 Public project sharing and discovery
- 🧩 Plugin system for custom extensions
- 📈 Collaborative DSA challenges with leaderboards
- 🎯 Integrated linting and testing tools
- 💾 GitHub integration for direct code commits

## 🤝 Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request. Report bugs or suggest features via GitHub Issues.

## 📄 License

MIT License © 2025 [Ayush Kumar]

## 🧑‍💻 Built by

[Ayush Kumar]

---

### ✅ Next Steps

1. Replace placeholders:
   - `your-username` in the GitHub link
   - `your_mongodb_connection_string`, `your_session_secret`, etc.
   - Screenshot URLs with your actual image links
2. Add `.env` files for backend and frontend as needed.
3. Optionally, include badges for Vercel, Render, or MongoDB Atlas.
