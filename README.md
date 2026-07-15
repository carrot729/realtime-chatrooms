# RealTime chatrooms 🚀

A real-time chat room platform built with **React, Node.js, Express, Socket.IO, and MongoDB**. Users can create rooms, join with a unique code, chat instantly with others, and see live online activity.

## ✨ Features

* 🔐 Unique client-based user system
* 🏠 Create and manage chat rooms
* 🔑 Join rooms using generated room codes
* 💬 Real-time messaging with Socket.IO
* 👥 Live online user count
* 💾 Persistent message storage with MongoDB
* 🔄 Message history loading after refresh
* ⚡ Instant updates without page refresh
* 🎨 Modern responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Zustand
* Socket.IO Client
* Vite

### Backend

* Node.js
* Express.js
* TypeScript
* Socket.IO
* MongoDB
* Mongoose

---

## 📸 Preview

https://github.com/user-attachments/assets/09fe5060-6a02-4e99-ab44-f539f96e2163 


---

## 🏗️ Architecture

```
SyncRoom

├── Client (React)
│   ├── Room UI
│   ├── Zustand State Management
│   └── Socket.IO Client
│
└── Server (Express)
    ├── REST API
    ├── Socket.IO Server
    ├── MongoDB Database
    └── Message Persistence
```

---

## 🔄 How It Works

1. User receives a unique client ID stored locally.
2. Users can create a room or join an existing room using a code.
3. When entering a room:

   * Username is created if needed.
   * User joins the Socket.IO room.
   * Previous messages are loaded from MongoDB.
4. New messages are:

   * Saved in MongoDB.
   * Broadcast instantly to everyone in the room.

---


## 🚀 Running Locally

### Clone repository

```bash
git clone https://github.com/DefNotArham/realtime-chatrooms/tree/main
cd project-name
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Start server:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

---

## 🧪 Future Improvements

* 🔒 User authentication
* 📎 File sharing
* 😀 Emoji reactions
* 🔔 Notifications
* 🟢 Typing indicators
* 🛡️ Message moderation
* 📱 Mobile app version

---

## 👨‍💻 Author

**Arham Kabir**

Backend Developer focused on building scalable APIs and real-time applications.

---

## 📄 License

This project is licensed under the MIT License.
