# NCPOR Polar Expedition Logistics & Asset Management System

### Problem Statement 62 — Smart India Hackathon 2026

A professional web application prototype for managing scientific polar expeditions, cargo tracking, base inventory, personnel health status, and emergency response across India's Antarctic (*Maitri*, *Bharati*) and Arctic (*Himadri*, *IndARC*) stations.

---

## 🌐 Live Demo

| Component | Platform | Link |
| --------- | -------- | ---- |
| **Frontend** | Vercel | [polar-expedition-system-dusky.vercel.app](https://polar-expedition-system-dusky.vercel.app/login) |
| **Backend API** | Render | [polar-expedition-system.onrender.com](https://polar-expedition-system.onrender.com/) |

> ⏳ **Note:** The backend runs on Render's free tier and sleeps after a period of inactivity. The first request may take 30–60 seconds to wake it up. If login seems slow, please wait a moment and try again.

---

## 🔐 Demo Credentials

| Role | Email | Password |
| ---- | ----- | -------- |
| **Mission Commander** | `commander@ncpor.in` | `password123` |
| **Logistics Officer** | `logistics@ncpor.in` | `password123` |
| **Field Personnel** | `personnel@ncpor.in` | `password123` |

> These are demo accounts for evaluation only, with sample data.

---

## 🎯 Core Features

1. **🔐 Authentication & Role Access**
   - JWT-based authentication with persistent session storage.
   - Role-based access for Commander, Logistics Officer, and Field Personnel.

2. **🎛️ Central Command Dashboard**
   - Real-time KPI tiles: Active Missions, Crew Deployed, Cargo in Transit, Active Incidents.
   - High-priority emergency broadcast banners and live activity feed.

3. **🗺️ Expedition Planning & Management**
   - Full CRUD for polar scientific campaigns (Antarctic / Arctic).
   - Destination stations: *Maitri*, *Bharati*, *Himadri*, *IndARC*.
   - Search, status filtering, team size, and mission scope.

4. **👥 Personnel & Medical Readiness**
   - Crew directory with specialties (Glaciologists, Meteorologists, Engineers, Doctors).
   - Medical clearance tracking: `Fit`, `Under Observation`, `Medical Leave`.
   - Next-of-kin emergency contact details.

5. **📦 Cargo & Supply Chain Tracking**
   - Consignment tracking with weight, category, and origin-to-destination routes.
   - One-click status updates: `Pending` → `In Transit` → `Delivered` → `Lost`.

6. **🗄️ Inventory & Base Stores**
   - Stock levels for cold-weather gear, fuel, emergency rations, and scientific sensors.
   - Automatic **Low Stock Warnings** below safety thresholds.

7. **🚨 Emergency Response & Incident Command**
   - One-click **SOS distress broadcast** for blizzards, medical emergencies, power failures, and SATCOM loss.
   - Incident resolution logging with corrective measures.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, Lucide Icons, Axios
- **Backend:** Node.js, Express.js, JWT, bcryptjs
- **Database:** SQLite (Node built-in `DatabaseSync`)
- **Design:** Polar dark command-center aesthetic (`#0B1120`, `#111827`, `#38BDF8`)

---

## ☁️ Deployment

- **Frontend** is deployed on **Vercel** (root directory: `frontend/`).
- **Backend** is deployed on **Render** (root directory: `backend/`).
- Environment variables are configured in each platform's dashboard. See `.env.example` for the required keys.

---

## 📁 Project Structure

```
polar-expedition-system/
├── backend/      # Express API, auth, SQLite database
├── frontend/     # React + Vite client
└── .env.example  # Required environment variables
```

---

*This is a prototype developed for Smart India Hackathon 2026. Data and station names are structured to demonstrate contextual relevance for Indian polar research programs.*
