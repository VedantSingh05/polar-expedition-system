CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('commander', 'logistics_officer', 'field_personnel')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expeditions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  zone TEXT NOT NULL CHECK(zone IN ('antarctic', 'arctic')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK(status IN ('planning', 'active', 'completed', 'aborted')),
  commander_id INTEGER REFERENCES users(id),
  description TEXT,
  team_size INTEGER DEFAULT 0,
  current_location TEXT DEFAULT 'Base Camp',
  risk_level TEXT DEFAULT 'moderate' CHECK(risk_level IN ('low', 'moderate', 'high', 'severe')),
  last_checkin DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personnel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  role_title TEXT NOT NULL,
  expedition_id INTEGER REFERENCES expeditions(id),
  skills TEXT,
  health_status TEXT NOT NULL DEFAULT 'fit' CHECK(health_status IN ('fit', 'under_observation', 'medical_leave')),
  current_waypoint TEXT DEFAULT 'Base Camp',
  last_checkin DATETIME DEFAULT CURRENT_TIMESTAMP,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cargo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expedition_id INTEGER REFERENCES expeditions(id),
  item_name TEXT NOT NULL,
  tracking_code TEXT,
  cargo_code TEXT,
  category TEXT NOT NULL CHECK(category IN ('food', 'medical', 'equipment', 'fuel', 'scientific', 'other')),
  quantity INTEGER NOT NULL DEFAULT 1,
  weight_kg REAL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_transit', 'delivered', 'lost')),
  transport_leg TEXT DEFAULT 'ship' CHECK(transport_leg IN ('ship', 'aircraft', 'snowcat', 'camp')),
  transport_stage TEXT DEFAULT 'PORT' CHECK(transport_stage IN ('PORT', 'SHIP', 'AIRCRAFT', 'SNOWCAT', 'FIELD_CAMP')),
  current_location TEXT DEFAULT 'Port, Goa',
  current_latitude REAL,
  current_longitude REAL,
  destination_latitude REAL,
  destination_longitude REAL,
  condition TEXT DEFAULT 'good',
  origin TEXT DEFAULT 'Goa, India',
  destination TEXT,
  dispatch_date TEXT,
  arrival_date TEXT,
  notes TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('food', 'medical', 'equipment', 'fuel', 'scientific', 'safety', 'other')),
  quantity REAL NOT NULL DEFAULT 0,
  max_capacity REAL DEFAULT 100,
  unit TEXT NOT NULL DEFAULT 'units',
  min_threshold REAL NOT NULL DEFAULT 10,
  location TEXT DEFAULT 'Main Warehouse, Goa',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS emergency_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expedition_id INTEGER REFERENCES expeditions(id),
  raised_by TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK(alert_type IN ('medical', 'weather', 'structural', 'communication_loss', 'fire', 'other')),
  severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  location_description TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved INTEGER NOT NULL DEFAULT 0,
  resolved_at DATETIME,
  resolution_notes TEXT
);
