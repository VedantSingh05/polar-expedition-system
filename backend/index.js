const path = require('path');
const fs = require('fs');

// Load environment variables (backend/.env or parent .env)
const localEnv = path.resolve(__dirname, '.env');
const parentEnv = path.resolve(__dirname, '../.env');
if (fs.existsSync(localEnv)) {
  require('dotenv').config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  require('dotenv').config({ path: parentEnv });
} else {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/database');
const { seedIfEmpty } = require('./db/seed');

const app = express();

// Allow local dev + the live Vercel site (+ optional FRONTEND_URL env var)
const allowedOrigins = [
  'http://localhost:5173',
  'https://polar-expedition-system-dusky.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // no origin = curl/Postman/server-to-server; allow it
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());

// Root + health check (for uptime pingers)
app.get('/', (req, res) => res.send('NCPOR Polar Command API is running'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Initialize DB
initDB();
seedIfEmpty();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/api/expeditions', require('./routes/expeditions.routes'));
app.use('/api/personnel', require('./routes/personnel.routes'));
app.use('/api/cargo', require('./routes/cargo.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/emergency', require('./routes/emergency.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  _   _  ____ ____   ___  ____  
 | \\ | |/ ___|  _ \\ / _ \\|  _ \\ 
 |  \\| | |   | |_) | | | | |_) |
 | |\\  | |___|  __/| |_| |  _ < 
 |_| \\_|\\____|_|    \\___/|_| \\_\\
                                
NCPOR POLAR COMMAND — Server running on port ${PORT}`);
});
