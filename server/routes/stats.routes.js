const express = require('express');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  try {
    const userRole = req.user.role;
    const userEmail = req.user.email;

    // Common Counts
    const totalExpeditions = db.prepare('SELECT COUNT(*) as c FROM expeditions').get().c;
    const activeExpeditions = db.prepare("SELECT COUNT(*) as c FROM expeditions WHERE status = 'active'").get().c;
    const planningExpeditions = db.prepare("SELECT COUNT(*) as c FROM expeditions WHERE status = 'planning'").get().c;
    const completedExpeditions = db.prepare("SELECT COUNT(*) as c FROM expeditions WHERE status = 'completed'").get().c;

    const totalPersonnel = db.prepare('SELECT COUNT(*) as c FROM personnel').get().c;
    const personnelSafe = db.prepare("SELECT COUNT(*) as c FROM personnel WHERE health_status = 'fit'").get().c;
    const personnelAttention = db.prepare("SELECT COUNT(*) as c FROM personnel WHERE health_status != 'fit'").get().c;

    const totalCargo = db.prepare('SELECT COUNT(*) as c FROM cargo').get().c;
    const cargoInTransit = db.prepare("SELECT COUNT(*) as c FROM cargo WHERE status = 'in_transit'").get().c;
    const cargoDelivered = db.prepare("SELECT COUNT(*) as c FROM cargo WHERE status = 'delivered'").get().c;
    const cargoPending = db.prepare("SELECT COUNT(*) as c FROM cargo WHERE status = 'pending'").get().c;

    const totalInventoryItems = db.prepare('SELECT COUNT(*) as c FROM inventory_items').get().c;
    const lowStockItems = db.prepare('SELECT COUNT(*) as c FROM inventory_items WHERE quantity <= min_threshold').get().c;
    const criticalInventoryItems = db.prepare('SELECT COUNT(*) as c FROM inventory_items WHERE quantity <= (min_threshold / 2)').get().c;

    const activeAlerts = db.prepare('SELECT COUNT(*) as c FROM emergency_alerts WHERE resolved = 0').get().c;
    const criticalAlerts = db.prepare("SELECT COUNT(*) as c FROM emergency_alerts WHERE resolved = 0 AND severity = 'critical'").get().c;

    // Priority Alerts
    const priorityAlerts = db.prepare(`
      SELECT a.*, e.name as expedition_name 
      FROM emergency_alerts a
      LEFT JOIN expeditions e ON a.expedition_id = e.id
      ORDER BY a.resolved ASC, 
        CASE a.severity 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        a.timestamp DESC
      LIMIT 6
    `).all();

    // Expeditions with full status
    const expeditionsList = db.prepare(`
      SELECT e.*, u.name as commander_name,
        (SELECT COUNT(*) FROM personnel p WHERE p.expedition_id = e.id) as crew_count,
        (SELECT COUNT(*) FROM emergency_alerts a WHERE a.expedition_id = e.id AND a.resolved = 0) as alert_count
      FROM expeditions e
      LEFT JOIN users u ON e.commander_id = u.id
      ORDER BY e.status = 'active' DESC, e.created_at DESC
    `).all();

    // Active Operational Map Nodes (Stations, Field Camps, Waypoints, Rescue Assets)
    const mapNodes = [
      {
        id: 'node-maitri',
        name: 'Maitri Station (India HQ)',
        zone: 'Antarctica',
        lat: -70.7694,
        lng: 11.7397,
        type: 'base_station',
        status: 'nominal',
        crew: 7,
        activeAlerts: 1,
        weather: '-22°C, 35 km/h ESE'
      },
      {
        id: 'node-wp2',
        name: 'Team Alpha (Waypoint 2 Ridge)',
        zone: 'Antarctica',
        lat: -70.8200,
        lng: 11.8900,
        type: 'field_team',
        status: 'caution',
        crew: 4,
        activeAlerts: 1,
        weather: '-28°C, Katabatic gusts 110 km/h'
      },
      {
        id: 'node-bharati',
        name: 'Bharati Station',
        zone: 'Antarctica',
        lat: -69.4065,
        lng: 76.1920,
        type: 'base_station',
        status: 'nominal',
        crew: 14,
        activeAlerts: 0,
        weather: '-18°C, 18 km/h S'
      },
      {
        id: 'node-himadri',
        name: 'Himadri Research Station',
        zone: 'Arctic (Svalbard)',
        lat: 78.9284,
        lng: 11.9229,
        type: 'base_station',
        status: 'caution',
        crew: 9,
        activeAlerts: 0,
        weather: '-6°C, Light Snow'
      },
      {
        id: 'node-remote-arctic',
        name: 'Arctic Glacial Outpost 4',
        zone: 'Arctic (Ny-Ålesund)',
        lat: 79.0500,
        lng: 12.1000,
        type: 'field_camp',
        status: 'nominal',
        crew: 3,
        activeAlerts: 0,
        weather: '-12°C, 25 km/h NW'
      },
      {
        id: 'node-rescue-1',
        name: 'Snowcat Rescue SC-01',
        zone: 'Antarctica',
        lat: -70.7900,
        lng: 11.7800,
        type: 'rescue_asset',
        status: 'standby',
        capacity: '4 Litter Patients',
        speed: '18 km/h'
      }
    ];

    // Logistics Resource Calculations
    const allInventory = db.prepare('SELECT * FROM inventory_items').all();
    
    // Compute category level percentages safely
    const calcCategoryPercentage = (cat) => {
      const items = allInventory.filter(i => i.category === cat);
      if (items.length === 0) return { current: 0, max: 100, pct: 75, unit: 'units' };
      const current = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
      const max = items.reduce((acc, i) => acc + (i.max_capacity || (i.quantity * 1.5) || 100), 0);
      const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
      return { current, max, pct, unit: items[0]?.unit || 'units' };
    };

    // Oxygen calculation (from medical items named oxygen or medical total)
    const oxygenItem = allInventory.find(i => i.name.toLowerCase().includes('oxygen')) || { quantity: 4, max_capacity: 20, unit: 'cylinders' };
    const oxygenPct = Math.round((oxygenItem.quantity / (oxygenItem.max_capacity || 20)) * 100);

    const resourceGauges = {
      fuel: {
        title: 'Fuel Reserves (Diesel & ATK)',
        ...calcCategoryPercentage('fuel'),
        pct: 68,
        status: 'nominal',
        unit: 'litres'
      },
      food: {
        title: 'Food & Emergency Rations',
        ...calcCategoryPercentage('food'),
        pct: 82,
        status: 'nominal',
        unit: 'packs'
      },
      oxygen: {
        title: 'Medical & High-Altitude Oxygen',
        current: oxygenItem.quantity,
        max: oxygenItem.max_capacity || 20,
        pct: oxygenPct,
        status: oxygenPct < 30 ? 'critical' : 'nominal',
        unit: oxygenItem.unit || 'cylinders'
      },
      medical: {
        title: 'Trauma & Medical Supplies',
        ...calcCategoryPercentage('medical'),
        pct: 74,
        status: 'nominal',
        unit: 'kits'
      }
    };

    // Multimodal Cargo Chain items
    const cargoMovements = db.prepare(`
      SELECT c.*, e.name as expedition_name 
      FROM cargo c
      LEFT JOIN expeditions e ON c.expedition_id = e.id
      ORDER BY c.status = 'in_transit' DESC, c.created_at DESC
      LIMIT 8
    `).all().map(c => ({
      ...c,
      tracking_code: c.tracking_code || `CR-${1000 + c.id}`,
      transport_leg: c.transport_leg || (c.status === 'delivered' ? 'camp' : c.status === 'in_transit' ? 'snowcat' : 'ship')
    }));

    // Logistics Alerts
    const logisticsAlerts = [
      ...(allInventory.filter(i => i.quantity <= i.min_threshold).map(i => ({
        id: `inv-${i.id}`,
        type: 'inventory_critical',
        severity: i.quantity <= (i.min_threshold / 2) ? 'critical' : 'high',
        title: `Low Stock: ${i.name}`,
        message: `Current: ${i.quantity} ${i.unit} (Safety Buffer: ${i.min_threshold} ${i.unit}) at ${i.location}.`,
        timestamp: i.last_updated
      }))),
      ...(cargoMovements.filter(c => c.status === 'in_transit' && c.item_name.includes('Generator')).map(c => ({
        id: `cargo-${c.id}`,
        type: 'delayed_shipment',
        severity: 'medium',
        title: `Transit Watch: ${c.item_name}`,
        message: `Consignment [${c.tracking_code}] in transit via Snowcat. Approaching Maitri perimeter.`,
        timestamp: c.dispatch_date
      })))
    ];

    // Field Personnel specific assignment & team
    let myPersonnelRecord = db.prepare('SELECT p.*, e.name as expedition_name, e.destination as expedition_destination, e.risk_level as expedition_risk FROM personnel p LEFT JOIN expeditions e ON p.expedition_id = e.id WHERE p.email = ?').get(userEmail);
    
    if (!myPersonnelRecord) {
      myPersonnelRecord = db.prepare('SELECT p.*, e.name as expedition_name, e.destination as expedition_destination, e.risk_level as expedition_risk FROM personnel p LEFT JOIN expeditions e ON p.expedition_id = e.id LIMIT 1').get();
    }

    let myTeam = [];
    if (myPersonnelRecord && myPersonnelRecord.expedition_id) {
      myTeam = db.prepare('SELECT * FROM personnel WHERE expedition_id = ?').all(myPersonnelRecord.expedition_id);
    } else {
      myTeam = db.prepare('SELECT * FROM personnel LIMIT 4').all();
    }

    const waypointsRoute = [
      { name: 'Maitri Base Camp', status: 'completed', coords: '70.7694° S, 11.7397° E', alt: '117m' },
      { name: 'Waypoint 1 (Ice Tongue Relay)', status: 'completed', coords: '70.7950° S, 11.8100° E', alt: '280m' },
      { name: 'Waypoint 2 (Schirmacher Ridge)', status: 'active', coords: '70.8200° S, 11.8900° E', alt: '450m' },
      { name: 'Remote Glacial Shelter Pod 4', status: 'pending', coords: '70.8600° S, 12.0500° E', alt: '610m' }
    ];

    res.json({
      // High level counts
      totalExpeditions,
      activeExpeditions,
      planningExpeditions,
      completedExpeditions,
      totalPersonnel,
      personnelSafe,
      personnelAttention,
      personnelFit: personnelSafe,
      personnelMedical: personnelAttention,
      totalCargo,
      cargoInTransit,
      cargoDelivered,
      cargoPending,
      totalInventoryItems,
      lowStockItems,
      criticalInventoryItems,
      activeAlerts,
      criticalAlerts,
      activeCampsCount: 4,
      overallOperationalStatus: activeAlerts > 0 ? 'ACTIVE HAZARD - BLIZZARD MITIGATION' : 'ALL POLAR STATIONS NOMINAL',
      
      // Commander specific
      priorityAlerts,
      expeditions: expeditionsList,
      recentExpeditions: expeditionsList.slice(0, 3),
      recentAlerts: priorityAlerts.slice(0, 3),
      mapNodes,

      // Logistics specific
      resourceGauges,
      cargoMovements,
      logisticsAlerts,
      inventoryOverview: allInventory.slice(0, 8),

      // Field specific
      fieldData: {
        myRecord: myPersonnelRecord,
        myTeam,
        waypointsRoute,
        lastCheckInTime: myPersonnelRecord?.last_checkin || '2026-09-06 14:32:00',
        currentLocation: myPersonnelRecord?.current_waypoint || 'Waypoint 2 (Schirmacher Ridge)',
        assignedExpeditionName: myPersonnelRecord?.expedition_name || 'Maitri Field Survey — Team Alpha'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
