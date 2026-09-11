const bcrypt = require('bcryptjs');
const { db } = require('./database');

const seedIfEmpty = () => {
  // Check if users exist and has latest format
  const count = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (count > 0) {
    return; // Already seeded
  }

  console.log('Seeding database with realistic NCPOR Polar Expedition demo data...');
  
  const hash = bcrypt.hashSync('password123', 10);

  // Users (3 roles)
  const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
  const u1 = insertUser.run('Dr. Rasik Ravindra (Commander)', 'commander@ncpor.in', hash, 'commander').lastInsertRowid;
  const u2 = insertUser.run('Capt. Priya Nair (Logistics Officer)', 'logistics@ncpor.in', hash, 'logistics_officer').lastInsertRowid;
  const u3 = insertUser.run('Dr. Arun Kumar (Field Operator)', 'personnel@ncpor.in', hash, 'field_personnel').lastInsertRowid;

  // Expeditions
  const insertExp = db.prepare(`
    INSERT INTO expeditions (name, destination, zone, start_date, end_date, status, commander_id, description, team_size, current_location, risk_level, last_checkin) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const e1 = insertExp.run(
    'Maitri Field Survey — Team Alpha', 
    'Maitri Station', 
    'antarctic', 
    '2026-05-01', 
    '2026-10-30', 
    'active', 
    u1, 
    'Glacier ice sheet profiling and automatic weather station monitoring at Schirmacher Oasis.', 
    7,
    'Waypoint 2 (Schirmacher Ridge)',
    'moderate',
    '2026-09-06 14:32:00'
  ).lastInsertRowid;

  const e2 = insertExp.run(
    'Bharati Logistics Mission — Team Bravo', 
    'Bharati Station', 
    'antarctic', 
    '2026-06-15', 
    '2026-11-20', 
    'active', 
    u1, 
    'Coastal oceanography, harbor acoustic mooring servicing, and winter power plant overhaul.', 
    14,
    'Base Camp (Larsemann Hills)',
    'low',
    '2026-09-06 13:50:00'
  ).lastInsertRowid;

  const e3 = insertExp.run(
    'Himadri Research Expedition — Arctic Camp', 
    'Himadri Station', 
    'arctic', 
    '2026-07-01', 
    '2026-09-30', 
    'active', 
    u1, 
    'High Arctic atmospheric boundary layer physics, permafrost coring, and aerosol optical depth.', 
    9,
    'Remote Field Camp (Ny-Ålesund)',
    'high',
    '2026-09-06 11:15:00'
  ).lastInsertRowid;

  const e4 = insertExp.run(
    'Southern Ocean Marine Survey 2027', 
    'ORV Sagar Kanya', 
    'antarctic', 
    '2027-01-10', 
    '2027-04-15', 
    'planning', 
    u1, 
    'Deep water biogeochemical sampling across Antarctic Polar Frontal Zone.', 
    22,
    'Goa Naval Port',
    'low',
    '2026-09-01 09:00:00'
  ).lastInsertRowid;

  // Personnel
  const insertPers = db.prepare(`
    INSERT INTO personnel (name, email, role_title, expedition_id, skills, health_status, current_waypoint, last_checkin, emergency_contact_name, emergency_contact_phone) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPers.run(
    'Dr. Arun Kumar',
    'personnel@ncpor.in',
    'Field Glaciologist & Team Lead',
    e1,
    'Ice Coring, GPS Surveying, Cold-Weather Survival, Telemetry',
    'fit',
    'Waypoint 2 (Schirmacher Ridge)',
    '2026-09-06 14:32:00',
    'Sunita Kumar (Spouse)',
    '+91-9876543200'
  );

  insertPers.run(
    'Dr. Suresh Babu',
    'suresh.babu@ncpor.res.in',
    'Senior Atmospheric Scientist',
    e1,
    'Radiosonde, Aerosol Sampling, LIDAR Operations',
    'fit',
    'Waypoint 2 (Schirmacher Ridge)',
    '2026-09-06 14:30:00',
    'Meena Babu',
    '+91-9876543210'
  );

  insertPers.run(
    'Eng. Vikram Sharma',
    'vikram.sharma@ncpor.res.in',
    'Station Mechanical Engineer',
    e1,
    'Diesel Generators, Snowcat Maintenance, HVAC, Power Grid',
    'fit',
    'Base Camp (Maitri)',
    '2026-09-06 14:15:00',
    'Anita Sharma',
    '+91-9876543211'
  );

  insertPers.run(
    'Dr. Ananya Das',
    'ananya.das@ncpor.res.in',
    'Meteorologist',
    e1,
    'Weather Forecasting, AWS Telemetry, Satellite Link Ops',
    'under_observation',
    'Base Camp (Maitri)',
    '2026-09-06 12:00:00',
    'Ravi Das',
    '+91-9876543212'
  );

  insertPers.run(
    'Lt. Cmdr. Rajesh Pillai',
    'rajesh.pillai@ncpor.res.in',
    'Chief Medical Officer',
    e1,
    'Emergency Trauma, Hyperbaric Medicine, Telemedicine',
    'fit',
    'Base Camp (Maitri)',
    '2026-09-06 14:20:00',
    'Suja Pillai',
    '+91-9876543213'
  );

  insertPers.run(
    'Dr. Nandini Krishnan',
    'nandini.k@ncpor.res.in',
    'Arctic Oceanographer',
    e3,
    'CTD Profiling, Sea Ice Dynamics, Marine Ecology',
    'fit',
    'Remote Field Camp',
    '2026-09-06 11:15:00',
    'Mohan Krishnan',
    '+91-9876543214'
  );

  insertPers.run(
    'Mr. Aditya Patel',
    'aditya.patel@ncpor.res.in',
    'IT & SATCOM Specialist',
    e2,
    'VSAT Terminal, Iridium Mesh, HF Radio, Network Defense',
    'fit',
    'Base Camp (Bharati)',
    '2026-09-06 13:50:00',
    'Kavita Patel',
    '+91-9876543215'
  );

  insertPers.run(
    'Dr. Pooja Bhatt',
    'pooja.bhatt@ncpor.res.in',
    'Marine Biologist',
    e3,
    'Microbiome Sampling, Cryo-storage, Diver Certified',
    'medical_leave',
    'Ny-Ålesund Medical Unit',
    '2026-09-05 18:00:00',
    'Rakesh Bhatt',
    '+91-9876543216'
  );

  // Cargo (with tracking codes & transport legs: ship -> aircraft -> snowcat -> camp)
  const insertCargo = db.prepare(`
    INSERT INTO cargo (expedition_id, item_name, tracking_code, category, quantity, weight_kg, status, transport_leg, origin, destination, dispatch_date, arrival_date, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCargo.run(
    e1,
    'Generator Heavy Spare Parts & Filters',
    'CR-1042',
    'equipment',
    4,
    380.0,
    'in_transit',
    'snowcat',
    'Port of Cape Town',
    'Maitri Station, Antarctica',
    '2026-08-15',
    '2026-09-12',
    'Critical spare parts for Caterpillar 3406 generator bank.'
  );

  insertCargo.run(
    e1,
    'Aviation Grade Winterized Fuel (5000L)',
    'CR-1043',
    'fuel',
    25,
    4200.0,
    'in_transit',
    'aircraft',
    'Cape Town Airfield',
    'Maitri Air Strip',
    '2026-09-01',
    '2026-09-09',
    'Jet A-1 fuel specialized for polar twin-otter aircraft.'
  );

  insertCargo.run(
    e1,
    'Emergency Oxygen Cylinders & Regulators',
    'CR-1044',
    'medical',
    12,
    180.0,
    'delivered',
    'camp',
    'AIIMS New Delhi',
    'Maitri Station Medical Bay',
    '2026-07-10',
    '2026-08-05',
    'High-pressure medical oxygen for high-altitude & trauma use.'
  );

  insertCargo.run(
    e3,
    'Cryogenic Ice Core Drill Rig & Bits',
    'CR-2088',
    'scientific',
    2,
    620.0,
    'in_transit',
    'ship',
    'NCPOR Logistics Base, Goa',
    'Himadri Research Station, Svalbard',
    '2026-08-20',
    '2026-09-18',
    'Precision thermal drilling head with spare diamond bit cutters.'
  );

  insertCargo.run(
    e3,
    'High-Calorie Freeze-Dried Polar Rations',
    'CR-2089',
    'food',
    180,
    540.0,
    'delivered',
    'camp',
    'DFRL Mysuru, India',
    'Himadri Camp Stores',
    '2026-06-25',
    '2026-07-15',
    '6-month energy balance ration packs rated for -50°C endurance.'
  );

  insertCargo.run(
    e2,
    'Deep Sea Oceanographic CTD Sensors',
    'CR-3051',
    'scientific',
    6,
    210.0,
    'pending',
    'ship',
    'National Institute of Oceanography, Goa',
    'Bharati Station, Larsemann Hills',
    '2026-09-15',
    '2026-10-25',
    'Sea-Bird SBE 911plus conductivity-temperature-depth rosette.'
  );

  // Inventory Items (with max_capacity for percentage gauges)
  const insertInv = db.prepare(`
    INSERT INTO inventory_items (name, category, quantity, max_capacity, unit, min_threshold, location, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertInv.run('Polar Grade Diesel Reserves', 'fuel', 12500, 30000, 'litres', 5000, 'Maitri Fuel Farm Bay 1', 'Main generator fuel stock');
  insertInv.run('Aviation Turbine Kerosene (ATK)', 'fuel', 4200, 10000, 'litres', 3000, 'Airstrip Depot', 'Twin-otter flight reserve');
  insertInv.run('Emergency High-Calorie Rations', 'food', 380, 500, 'ration packs', 100, 'Cold Storage Vault 2', '6-month endurance buffer');
  insertInv.run('Dehydrated Protein & Carbohydrate Stores', 'food', 85, 200, 'kg', 50, 'Kitchen Dry Pantry', 'Daily consumption staples');
  insertInv.run('Medical High-Pressure Oxygen Cylinders', 'medical', 4, 20, 'cylinders', 6, 'Medical Bay Locker 1', 'Low stock alert active');
  insertInv.run('Trauma Care & Resuscitation Kits', 'medical', 14, 20, 'kits', 5, 'Station Infirmary', 'Sterile emergency surgical kits');
  insertInv.run('Level-4 Arctic Thermal Survival Suits', 'safety', 9, 25, 'suits', 10, 'Airlock Outer Locker', 'Extreme cold rated -60°C');
  insertInv.run('Iridium Extreme PTT Satellite Radios', 'equipment', 16, 20, 'handsets', 5, 'Comms Operations Desk', 'Encrypted satellite voice link');
  insertInv.run('Snowcat SC-01 Engine Spares & Filters', 'equipment', 3, 10, 'sets', 4, 'Heavy Vehicle Hangar', 'Scheduled maintenance spares');
  insertInv.run('Portable Weather Sensor Pods (AWS)', 'scientific', 5, 8, 'units', 2, 'Instruments Lab', 'Battery heated polar sensors');

  // Emergency Alerts
  const insertAlert = db.prepare(`
    INSERT INTO emergency_alerts (expedition_id, raised_by, alert_type, severity, description, location_description, timestamp, resolved, resolved_at, resolution_notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAlert.run(
    e1,
    'Dr. Arun Kumar (Field Lead)',
    'weather',
    'high',
    'Katabatic wind storm warning issued. Wind gusts 135 km/h recorded at Waypoint 2. Team Alpha fortified in shelter pod.',
    'Waypoint 2, Schirmacher Oasis Ridge',
    '2026-09-06 14:10:00',
    0,
    null,
    null
  );

  insertAlert.run(
    e1,
    'Lt. Cmdr. Rajesh Pillai (Medical)',
    'medical',
    'medium',
    'Dr. Ananya Das experiencing moderate hypothermia and fatigue. Monitored in medical bay with heated oxygen therapy.',
    'Maitri Station Medical Bay',
    '2026-09-06 12:30:00',
    0,
    null,
    null
  );

  insertAlert.run(
    e3,
    'Dr. Nandini Krishnan',
    'communication_loss',
    'low',
    'Intermittent ionospheric scintillation disrupting VHF link to Ny-Ålesund relay. Primary Iridium link verified active.',
    'Himadri Station Arctic Array',
    '2026-09-06 09:45:00',
    1,
    '2026-09-06 11:00:00',
    'Atmospheric disturbance cleared. Dual VHF and satellite channels restored.'
  );

  console.log('NCPOR Polar Expedition demo database seeded successfully!');
};

module.exports = { seedIfEmpty };
