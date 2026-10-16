# Gautam Pandey — Portfolio

A personal portfolio with a **Node.js + Express backend** and a **vanilla HTML/CSS/JS frontend** (no build step).

## Features
- Hero with typing animation, terminal card, animated impact counters
- About, Skills, Experience timeline, filterable Projects, Freelance services, Awards & Education
- Contact section with email, phone, WhatsApp, LinkedIn, GitHub, LeetCode and a contact form
- Dark / light theme, fully responsive, scroll-reveal animations, downloadable résumé
- Backend: `POST /api/contact` with validation, honeypot spam filter, rate limiting (5 / 15 min per IP),
  storage in `data/messages.json` or MongoDB, and optional email notification via SMTP (Gmail works)
- `GET /api/messages` (Bearer `ADMIN_TOKEN`) to read your inbox, `GET /api/health` for uptime checks
- Security headers (Helmet + CSP), gzip compression, Dockerfile for deployment

## Run locally
1. Install Node.js 18+ from https://nodejs.org
2. In this folder:
   ```bash
   npm install
   copy .env.example .env
   npm start
   ```
3. Open http://localhost:3000

## Edit content
All text, links, skills, experience and projects live in [`public/js/profile.js`](public/js/profile.js).
**Set your LeetCode URL** in `links.leetcode`.

## Get emails for new messages
In `.env`, set `SMTP_PASS` to a Gmail **App Password** (Google Account → Security → 2-Step Verification → App passwords).
Without it, messages are still saved to `data/messages.json`.

## Read messages
```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:3000/api/messages
```

## Deploy (free options)
- **Render / Railway**: new Web Service from your GitHub repo, build `npm install`, start `npm start`, add the `.env` values as environment variables.
  Use `MONGODB_URI` (MongoDB Atlas free tier) so messages survive redeploys.
- **Docker**: `docker build -t portfolio . && docker run -p 3000:3000 --env-file .env portfolio`
- **Static only (Netlify / Vercel / GitHub Pages)**: deploy the `public/` folder. The contact form then falls back to opening the visitor's email app.
