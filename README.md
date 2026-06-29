# HireHub — AI-Powered Job Portal

A full-stack MERN job portal with **AI résumé↔job matching**, online **payments**, and separate workspaces for candidates, recruiters, and admins. Built with a premium dark UI.

> **Live demo:** https://hirehub-umber.vercel.app
> _(Backend on Render free tier — the first request after ~15 min idle may take 30–60s to wake.)_

---

## ✨ Features

### Candidates
- Browse & search jobs, save favourites, one-click apply
- **AI auto-apply** — scans open roles and auto-applies to good matches (on/off + match threshold)
- Interactive **résumé builder** with multiple templates + PDF export
- Profile with skills, experience, and résumé upload

### Recruiters
- Post & manage jobs, view applicants
- **AI smart-shortlist** — rank applicants by how well their résumé matches the role
- Analytics dashboard (applicants per job, status breakdown)
- Company profile management

### Admins
- Platform analytics, user management (roles, verify, activate)
- Job moderation, company management, verification queue

### Platform
- JWT auth with three roles (candidate / recruiter / admin)
- **Razorpay** payments for Pro/Enterprise plans
- Transactional email (contact form → support inbox)
- Cloudinary uploads (résumés, images), notifications

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router 7, Recharts, Motion |
| Backend | Node.js, Express 4, MongoDB (Mongoose) |
| AI | Google Gemini (with a free keyword-scorer fallback) |
| Payments | Razorpay |
| Media / Email | Cloudinary, Nodemailer |

---

## 🚀 Getting Started (local)

### Prerequisites
- Node.js 18+
- A MongoDB connection string (MongoDB Atlas free tier works great)

### 1. Clone
```bash
git clone https://github.com/hercules5564/hirehub.git
cd hirehub
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env      # then fill in your values
npm run dev               # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

> If `MONGO_URI` is left blank, the backend falls back to an in-memory database (data resets on restart) and auto-seeds demo data — handy for a quick spin-up.

### Demo accounts (seeded)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@hirehub.com` | `admin123` |
| Recruiter | `priya@example.com` | `password123` |
| Candidate | `ananya@example.com` | `password123` |

---

## 🔑 Environment Variables

**Backend** (`backend/.env`) — see [`backend/.env.example`](backend/.env.example):

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET`, `JWT_EXPIRE`, `JWT_COOKIE_EXPIRE` | Auth tokens |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | File uploads |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | AI matching (optional — falls back to keyword scorer) |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Payments (optional — disabled if unset) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_EMAIL` / `SMTP_PASSWORD` / `SUPPORT_EMAIL` | Contact email (optional) |
| `FRONTEND_URL` | Allowed CORS origin |

**Frontend** (`frontend/.env`):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://your-backend.onrender.com/api`) |

---

## ☁️ Deployment

- **Frontend → Vercel** — root directory `frontend`, set `VITE_API_URL` to your backend URL. SPA routing handled by [`frontend/vercel.json`](frontend/vercel.json).
- **Backend → Render** — root directory `backend`, build `npm install`, start `npm start`, and set all backend env vars.
- **Database → MongoDB Atlas** — allow access from anywhere (`0.0.0.0/0`) so the host can connect.

> Never commit `.env` — it's gitignored. Set secrets in each host's dashboard.

---

## 📄 License

For educational / portfolio use.
