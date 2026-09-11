# NCPOR Polar Expedition Logistics & Asset Management System
### Problem Statement 62 — Smart India Hackathon 2026

An **offline-first**, professional web application prototype built for managing scientific polar expeditions, cargo tracking, base inventory, personnel health status, and emergency response across India's Antarctic (*Maitri*, *Bharati*) and Arctic (*Himadri*, *IndARC*) stations.

---

## ❄️ Quick Start (Run Locally)

### 1. Start Backend Server
Open a terminal in `polar-expedition-system/server`:
```bash
cd server
npm start
```
*The server will run on `http://localhost:5000` and automatically initialize the local SQLite database with realistic NCPOR expedition data.*

### 2. Start Frontend App
Open a second terminal in `polar-expedition-system/client`:
```bash
cd client
npm run dev
```
*Open your browser at **`http://localhost:5173`**.*

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Mission Commander** | `commander@ncpor.in` | `password123` |
| **Logistics Officer** | `logistics@ncpor.in` | `password123` |
| **Field Personnel** | `personnel@ncpor.in` | `password123` |

---

## 🎯 Core Features Built in the MVP

1. **🔐 Authentication & Role Access:**
   - JWT-based authentication with local persistent session storage.
2. **🎛️ Central Command Dashboard:**
   - Real-time KPI summary tiles (Active Missions, Crew Deployed, Cargo in Transit, Active Incidents).
   - High-priority emergency broadcast banners and live activity feeds.
3. **🗺️ Expedition Planning & Management:**
   - Full CRUD for polar scientific campaigns (Antarctic / Arctic).
   - Destination stations (*Maitri*, *Bharati*, *Himadri*, *IndARC*).
   - Search, status filtering, team size, and mission scopes.
4. **👥 Personnel & Medical Readiness:**
   - Complete crew directory with specialties (Glaciologists, Meteorologists, Engineers, Doctors).
   - Medical clearance tracking (`Fit`, `Under Observation`, `Medical Leave`).
   - Next-of-kin emergency contact details.
5. **📦 Cargo & Supply Chain Tracking:**
   - Consignment tracking with weight, category, and origin-to-destination routes.
   - One-click inline status updates (`Pending` → `In Transit` → `Delivered` → `Lost`).
6. **🗄️ Inventory & Base Stores:**
   - Real-time stock levels for extreme cold-weather suits, fuel, emergency rations, and scientific sensors.
   - Automatic **Low Stock Warnings** when quantity drops below safety thresholds.
7. **🚨 Emergency Response & Incident Command:**
   - One-click **SOS distress broadcast** for blizzards, medical emergencies, power failures, and SATCOM loss.
   - Incident resolution logging with corrective measure documentation.

---

## 🛠️ Technology Stack (100% Offline-First)

- **Frontend:** React 18, Vite, Tailwind CSS, React Router DOM, Lucide Icons, Axios.
- **Backend:** Node.js, Express.js, JWT, bcryptjs.
- **Database:** SQLite (built-in Node `DatabaseSync` — zero external database servers required).
- **Design:** Polar dark command-center aesthetic (`#0B1120`, `#111827`, `#38BDF8`).

---

*Note: This is a prototype system developed for Smart India Hackathon 2026. Data and station names are structured to demonstrate contextual relevance for Indian polar research programs.*
