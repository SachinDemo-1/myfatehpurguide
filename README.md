# 🏛️ Fatehpur Sikri Expert Guide — Booking Website v2.0

Full-stack tourist guide booking platform with user auth, notifications, payment tracking, review system and owner dashboard.

---

## ✅ Prerequisites

Install **Node.js v16+** from https://nodejs.org (choose LTS)

Check it works:
```
node --version
npm --version
```

---

## 🚀 Setup (One Time)

### Step 1 — Install Backend
Open Terminal / Command Prompt:
```bash
cd fatehpur-guide\backend
npm install
```

### Step 2 — Install Frontend
Open a **second** Terminal:
```bash
cd fatehpur-guide\frontend
npm install
```
> ⚠️ This takes 3–5 minutes first time. Please wait.

---

## ▶️ Running the Website

Keep **both terminals open at the same time**.

### Terminal 1 — Backend:
```bash
cd fatehpur-guide\backend
node server.js
```
✅ You'll see: `Server on http://localhost:5000`

### Terminal 2 — Frontend:
```bash
cd fatehpur-guide\frontend
npm start
```
Browser opens at **http://localhost:3000** automatically.

---

## 🌐 Pages

| Page | URL |
|------|-----|
| Home | http://localhost:3000 |
| Register | http://localhost:3000/register |
| Login | http://localhost:3000/login |
| Book Tour | http://localhost:3000/book |
| My Bookings | http://localhost:3000/my-bookings |
| **Owner Login** | http://localhost:3000/owner/login |
| **Owner Dashboard** | http://localhost:3000/owner/dashboard |

---

## 🔑 Owner Credentials
```
Username: admin
Password: guide@sikri123
```

---

## ✨ Features

### Customer Side
- Register / Login with email & password
- Book tours in 3 steps
- Real-time notifications (bell icon) when booking is confirmed
- My Bookings page — see status, payment info
- Leave reviews after completed tours

### Owner Dashboard (5 Tabs)
1. **All Bookings** — full table, search, filter, click for details
2. **Pending** — quick view of unconfirmed bookings
3. **Tour History** — all completed tours archive
4. **Payments** — record Cash/UPI/Card payments per booking
5. **Reviews** — manage all guest reviews

### Owner Actions
- ✅ Confirm booking → user gets notification instantly
- 🏆 Mark completed → user gets notification + review prompt
- 💰 Record payment (method + amount + notes)
- 🗑️ Delete bookings or reviews

---

## 🎨 Theme
- Deep Teal + Gold color scheme
- Fully animated with scroll-reveal, floating elements, counters
- Photo gallery of Fatehpur Sikri monuments
- Guide celebrity photos section
- Live reviews from API

---

## ⚙️ Tech Stack
- **Backend**: Node.js + Express (port 5000)
- **Frontend**: React 18 (port 3000)
- **Auth**: JWT tokens
- **Storage**: In-memory (data resets on server restart)
