const express = require('express');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

// GET all cargo — all authenticated users
router.get('/', authMiddleware, (req, res) => {
  try {
    const expId = req.query.expedition_id;
    let query = `
      SELECT c.*, e.name as expedition_name 
      FROM cargo c 
      LEFT JOIN expeditions e ON c.expedition_id = e.id
    `;
    let items;
    if (expId) {
      query += ' WHERE c.expedition_id = ?';
      items = db.prepare(query).all(expId);
    } else {
      items = db.prepare(query).all();
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// IMPORTANT: Named routes must come BEFORE /:id to avoid Express catching them as the id param

// GET cargo by tracking code (for field scan) — all authenticated
// Must be defined BEFORE GET /:id
router.get('/track/:code', authMiddleware, (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const item = db.prepare(`
      SELECT c.*, e.name as expedition_name 
      FROM cargo c 
      LEFT JOIN expeditions e ON c.expedition_id = e.id
      WHERE UPPER(c.tracking_code) = ? OR UPPER(c.cargo_code) = ?
    `).get(code, code);
    if (!item) return res.status(404).json({ error: `No cargo found with code: ${req.params.code}` });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single cargo by ID — all authenticated
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const item = db.prepare(`
      SELECT c.*, e.name as expedition_name 
      FROM cargo c 
      LEFT JOIN expeditions e ON c.expedition_id = e.id
      WHERE c.id = ?
    `).get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (create) — Commander or Logistics Officer
router.post('/', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const {
      expedition_id, item_name, category, quantity, weight_kg,
      status, origin, destination, dispatch_date, arrival_date, notes,
      cargo_code, current_location, transport_stage, condition
    } = req.body;

    // Validate required fields
    if (!item_name || !category) {
      return res.status(400).json({ error: 'item_name and category are required.' });
    }

    // Auto-generate cargo_code if not provided
    const generatedCode = cargo_code || ('POLAR-CR-' + String(Date.now()).slice(-4));

    const info = db.prepare(`
      INSERT INTO cargo (
        expedition_id, item_name, category, quantity, weight_kg,
        status, origin, destination, dispatch_date, arrival_date, notes,
        cargo_code, current_location, transport_stage, condition, last_updated
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      expedition_id || null,
      item_name,
      category,
      quantity || 1,
      weight_kg || null,
      status || 'pending',
      origin || 'Goa, India',
      destination || null,
      dispatch_date || null,
      arrival_date || null,
      notes || null,
      generatedCode,
      current_location || 'Port, Goa',
      transport_stage || 'PORT',
      condition || 'good'
    );
    res.status(201).json({ id: info.lastInsertRowid, cargo_code: generatedCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (edit) — Commander or Logistics Officer
router.put('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const {
      expedition_id, item_name, category, quantity, weight_kg,
      status, origin, destination, dispatch_date, arrival_date, notes,
      current_location, transport_stage, condition
    } = req.body;

    const info = db.prepare(`
      UPDATE cargo 
      SET expedition_id = ?, item_name = ?, category = ?, quantity = ?, weight_kg = ?,
          status = ?, origin = ?, destination = ?, dispatch_date = ?, arrival_date = ?, notes = ?,
          current_location = ?, transport_stage = ?, condition = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      expedition_id || null,
      item_name,
      category,
      quantity,
      weight_kg || null,
      status,
      origin,
      destination || null,
      dispatch_date || null,
      arrival_date || null,
      notes || null,
      current_location || null,
      transport_stage || null,
      condition || null,
      req.params.id
    );
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /:id/receive — Field Personnel (and above) confirm cargo receipt
// Must be defined BEFORE DELETE /:id
router.patch('/:id/receive', authMiddleware, (req, res) => {
  try {
    const { confirmed_by, location_note } = req.body;
    const receiverName = confirmed_by || req.user.name;
    const location = location_note || 'Field Camp';

    const info = db.prepare(`
      UPDATE cargo
      SET status = 'delivered',
          transport_stage = 'FIELD_CAMP',
          current_location = ?,
          last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(location, req.params.id);

    if (info.changes === 0) return res.status(404).json({ error: 'Cargo not found' });

    // Append receipt note safely
    db.prepare(`UPDATE cargo SET notes = COALESCE(notes || ' | ', '') || ? WHERE id = ?`)
      .run('Received by ' + receiverName, req.params.id);

    res.json({ success: true, message: 'Cargo receipt confirmed by ' + receiverName + '.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Commander or Logistics Officer (NOT field personnel)
router.delete('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const info = db.prepare('DELETE FROM cargo WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
