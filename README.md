# Real-Time Chat Application — Project Plan & Requirements

**Authors:** Ilyass Bel-Mehdi & Ghita Alaoui

**Date:** October 4, 2025

---

## 1. Executive Summary

This document specifies the requirements, design, technology choices, task breakdown, and an estimated timeline for building a real-time chat application. The goal is to deliver a clean, responsive web chat that supports real-time messaging, emojis, notifications, and persistent chat history.

The plan is written so two developers can collaborate effectively, with clear ownership, acceptance criteria, and time-boxed tasks.

---

## 2. Project Objectives

* Provide instant, low-latency chat between multiple users.
* Offer a simple, modern UI with emoji support and notification indicators.
* Teach/strengthen full‑stack skills: WebSockets, client–server integration, basic deployment.
* Produce a presentable project for portfolio/demo.

---

## 3. Scope

**In scope (MVP):**

* Username-based join (no auth required for MVP)
* Real-time text messaging via WebSockets (Socket.IO)
* Message list UI with timestamps
* Emoji input or picker
* New-message visual indicator and sound notification

**Out of scope (MVP):**

* Full user account system (email/password)
* End-to-end encryption — advanced stretch
* Mobile apps (native) — optional stretch (use responsive web instead)

---

## 4. Functional Requirements

1. User can join a chat room by entering a **username**.
2. User can send and receive messages instantly; each message shows sender, timestamp.
3. Messages broadcast to all connected users in the same room (global room for MVP).
4. Emoji support via an emoji picker or typed emoji characters.
5. Visual notification when a new message arrives and the chat window is unfocused; optional sound.
6. Persist messages to a database and retrieve the last N messages on join.

---

## 5. Non-Functional Requirements

* **Performance:** Typical message roundtrip latency < 200 ms on average local network.
* **Availability:** App should run on a single small server for demos (Heroku/Render/Vercel backend).
* **Scalability:** Design for horizontal scale later (stateless server + message store / Redis) but not required for MVP.
* **Security:** Sanitize user input, avoid XSS when rendering messages.
* **Maintainability:** ESLint + Prettier; clear repo structure and README.

---

## 6. Suggested Technology Stack

**Backend**

* Node.js
* Express.js (HTTP server)
* Socket.IO (real-time communication)
* MongoDB (Atlas) or Firebase for message persistence

**Frontend**

* Option A (recommended for simplicity): React (Create React App / Vite)
* Option B: Vanilla HTML/CSS/JS (faster to prototype)
* Socket.IO client library
* Emoji picker library (e.g., emoji-picker-element or emoji-mart)

**Dev Tools / CI / Hosting**

* Version Control: Git + GitHub
* CI: GitHub Actions 
* Hosting: Vercel or Netlify for frontend, Render/Heroku for backend (or single fullstack deploy on Render)
* Linting/Formatting: ESLint + Prettier

---

## 7. High-Level Architecture

Components:

* **Client (browser):** connects to server via Socket.IO, renders UI, sends/receives messages.
* **Server (Node.js):** accepts Socket.IO connections, handles events (`join`, `message`, `disconnect`), broadcasts messages.
* **Database (optional):** stores messages and retrieves history on join.

Communication flow (MVP):

1. Client connects and emits `join` with username.
2. Server stores socket → username mapping.
3. Client emits `message` events with message payload.
4. Server broadcasts `message` to all connected sockets.
5. Clients render incoming `message` events into the message list.

---

## 8. Data Models (Simple)

**Message**

```json
{
  "id": "uuid",
  "username": "string",
  "text": "string",
  "timestamp": "ISO8601"
}
```

**User** (transient in memory for MVP)

```json
{
  "socketId": "string",
  "username": "string"
}
```

Store messages collection with indexes on timestamp.

---

## 9. Socket & API Events

**Client → Server**

* `join` { username }
* `message` { text }
* `typing` (optional)

**Server → Client**

* `message` { id, username, text, timestamp }
* `user-joined` { username }
* `user-left` { username }
* `history` [ messages ] (if persistence)

---

## 10. UI / UX Requirements

**Screens / Components:**

* **Join Screen:** username input + Join button.
* **Main Chat Screen:** message list (scrollable), input area, send button, emoji button, top bar with room info and connected users count.
* **Notifications:** when document unfocused, show badge count and optional sound.
* **Responsive Layout:** suitable on desktop and mobile widths.

Accessibility: keyboard focus for input, `aria` labels for controls.

---

## 11. Tasks & Estimated Durations

> **Assumption:** two developers working in parallel. Durations are ranges; actual time depends on experience.

### Phase A — Project Setup

1. **Project init, repo, basic README** — *Owner: Both* — **0.5–1 day**

   * Initialize Git repo, add .gitignore, README, initial branches.

2. **Basic server skeleton (Express + Socket.IO)** — *Owner: Backend* — **1–2 days**

   * Create `server.js`, basic `join`/`message` handlers, local test script.

3. **Basic frontend skeleton** — *Owner: Frontend* — **1–2 days**

   * Create initial UI, connect Socket.IO client to server, simple send/receive flow.

---

### Phase B — Core Features (MVP)

4. **Real-time messaging (end-to-end)** — *Owner: Backend + Frontend* — **3–5 days**

   * Backend: broadcast logic, message object format.
   * Frontend: message list rendering, timestamp formatting, auto-scroll.

5. **User join/leave notifications** — *Owner: Backend* — **0.5–1 day**

   * Emit `user-joined` / `user-left` events; frontend shows small system messages.

6. **Emoji support & input** — *Owner: Frontend* — **1–3 days**

   * Integrate emoji picker and ensure messages send emoji characters correctly.

7. **Notifications (visual / sound)** — *Owner: Frontend* — **0.5–1 day**

   * Document hidden detection, badge count, sound asset.

---

### Phase C — Persistence, Polishing & Deployment (Optional)

8. **Message persistence & history** — *Owner: Backend* — **2–4 days**

   * Add MongoDB or Firebase integration; return last N messages on join.

9. **Styling, responsive layout, and accessibility fixes** — *Owner: Frontend* — **1–3 days**

10. **Testing, end-to-end integration, and bug fixes** — *Owner: Both* — **2–4 days**

11. **CI / CD & Deployment** — *Owner: Backend (deploy) + Frontend (deploy)* — **1–2 days**

12. **Buffer and polish (bug fixes / docs)** — *Owner: Both* — **2–5 days**

---

## 12. Example Timeline (Compact view)

* Days 0–1: Project init, repo, server skeleton, frontend skeleton. (0.5–2 days)
* Days 2–6: Implement real-time messaging, join/leave, basic UI. (3–5 days)
* Days 7–9: Emoji picker, notifications, polish UI. (1–3 days)
* Days 10–13: Optional DB persistence + history, integration tests. (2–4 days)
* Days 14–16: Deploy, final QA, documentation, buffer for fixes. (2–5 days)

Total MVP estimate: **~1.5–3 weeks** depending on optional features and experience.

---

## 13. Task Ownership (Example Split)

**Backend Lead **

* Server skeleton, Socket.IO events, broadcasting logic.
* (Optional) DB integration for persistence.
* Setup backend deployment and environment variables.

**Frontend Lead **

* UI design and message rendering.
* Emoji integration, notifications, responsive styles.
* Connect frontend to deployed backend.

**Joint Responsibilities**

* Code reviews (pull requests), integration testing, writing README and demo script.

---

## 14. Deliverables & Acceptance Criteria

**Deliverables**

* Working repo with `backend/` and `frontend/` folders.
* README containing setup & run instructions.
* Demo video or live demo link.

**Acceptance Criteria (MVP)**

* Two or more clients can exchange messages in real-time.
* Messages display username and time; UI auto-scrolls on new message.
* Emoji can be sent and displayed correctly.
* New message indicator appears when window is unfocused.

---

## 15. Collaboration & Workflow

* Branching: `main` (protected), `develop` (optional), `feature/<name>` for each task.
* Pull Request: include description, screenshots (if UI), assign reviewer.
* Code review: at least one approving review before merge.
* Commit messages: follow Conventional Commits (short prefix + description).
* Issue tracking: use GitHub Issues or project board for tasks.

---

## 16. Testing Strategy

* Manual local testing with 2+ browser windows.
* Unit tests for utility functions (timestamp formatting, input sanitization).
* E2E tests (optional) with Cypress or Playwright for basic send/receive flow.

---

## 17. Deployment & Environment

**Environment variables** (example):

* `PORT` — server port
* `MONGO_URI` — database connection string (if used)
* `NODE_ENV` — development/production

---

## 18. Project Signoff

Project is considered complete when MVP acceptance criteria are met, and documentation contains setup + run + contribution instructions.

---

## Appendix A — Recommended Repo Structure

```
chat-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── controllers/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       └── styles/
├── .gitignore
└── README.md
```

---
