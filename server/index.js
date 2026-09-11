require('dotenv').config({ path: '../.env' }); // or just config() if .env is in server root
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/database');
const { seedIfEmpty } = require('./db/seed');
const { db } = require('./db/database'); // to pass to seed

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://polar-expedition-system.vercel.app'
  ]
}));
app.use(express.json());

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
// skip assets route as per priority instructions

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
