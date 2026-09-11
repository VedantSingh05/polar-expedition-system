const express = require('express');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const personnel = db.prepare(`
      SELECT p.*, e.name as expedition_name, e.destination as expedition_destination 
      FROM personnel p 
      LEFT JOIN expeditions e ON p.expedition_id = e.id
    `).all();
    res.json(personnel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/expedition/:expeditionId', (req, res) => {
  try {
    const personnel = db.prepare(`
      SELECT p.*, e.name as expedition_name 
      FROM personnel p 
      LEFT JOIN expeditions e ON p.expedition_id = e.id
      WHERE p.expedition_id = ?
    `).all(req.params.expeditionId);
    res.json(personnel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const p = db.prepare('SELECT * FROM personnel WHERE id = ?').get(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check-in endpoint for Field Operations
router.post('/checkin', authMiddleware, (req, res) => {
  try {
    const { waypoint, health_status, notes } = req.body;
    const userEmail = req.user.email;

    // Find corresponding personnel record by email or first record for demo
    let person = db.prepare('SELECT * FROM personnel WHERE email = ?').get(userEmail);
    if (!person) {
      person = db.prepare('SELECT * FROM personnel LIMIT 1').get();
    }

    if (person) {
      db.prepare(`
        UPDATE personnel 
        SET current_waypoint = ?, health_status = ?, last_checkin = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(waypoint || person.current_waypoint || 'Base Camp', health_status || person.health_status || 'fit', person.id);

      if (person.expedition_id) {
        db.prepare(`
          UPDATE expeditions 
          SET current_location = ?, last_checkin = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(waypoint || 'Field Camp', person.expedition_id);
      }
    }

    res.json({
      success: true,
      message: 'Operational Check-in & Safe Arrival recorded successfully.',
      timestamp: new Date().toISOString(),
      waypoint: waypoint || person?.current_waypoint || 'Base Camp'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const { name, email, role_title, expedition_id, skills, health_status, emergency_contact_name, emergency_contact_phone, current_waypoint } = req.body;
    const info = db.prepare(`
      INSERT INTO personnel (name, email, role_title, expedition_id, skills, health_status, current_waypoint, emergency_contact_name, emergency_contact_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      email || null,
      role_title,
      expedition_id || null,
      skills || null,
      health_status || 'fit',
      current_waypoint || 'Base Camp',
      emergency_contact_name || null,
      emergency_contact_phone || null
    );
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const { name, email, role_title, expedition_id, skills, health_status, current_waypoint, emergency_contact_name, emergency_contact_phone } = req.body;
    const info = db.prepare(`
      UPDATE personnel 
      SET name = ?, email = ?, role_title = ?, expedition_id = ?, skills = ?, health_status = ?, current_waypoint = ?, emergency_contact_name = ?, emergency_contact_phone = ?
      WHERE id = ?
    `).run(
      name,
      email || null,
      role_title,
      expedition_id || null,
      skills || null,
      health_status || 'fit',
      current_waypoint || 'Base Camp',
      emergency_contact_name || null,
      emergency_contact_phone || null,
      req.params.id
    );
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const info = db.prepare('DELETE FROM personnel WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
