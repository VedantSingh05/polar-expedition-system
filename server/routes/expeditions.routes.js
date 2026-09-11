const express = require('express');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

// GET all expeditions — all authenticated users can view
// Field personnel only see their own assigned expedition
router.get('/', authMiddleware, (req, res) => {
  try {
    let expeditions;
    if (req.user.role === 'field_personnel') {
      // Field personnel: only see expeditions they are assigned to
      expeditions = db.prepare(`
        SELECT e.*, u.name as commander_name 
        FROM expeditions e 
        LEFT JOIN users u ON e.commander_id = u.id
        WHERE e.id IN (
          SELECT expedition_id FROM personnel WHERE email = ?
        )
      `).all(req.user.email);
    } else {
      // Commander and Logistics Officer see all expeditions
      expeditions = db.prepare(`
        SELECT e.*, u.name as commander_name 
        FROM expeditions e 
        LEFT JOIN users u ON e.commander_id = u.id
      `).all();
    }
    res.json(expeditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single expedition — all authenticated users
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const exp = db.prepare(`
      SELECT e.*, u.name as commander_name 
      FROM expeditions e 
      LEFT JOIN users u ON e.commander_id = u.id
      WHERE e.id = ?
    `).get(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });

    exp.personnel_count = db.prepare('SELECT COUNT(*) as c FROM personnel WHERE expedition_id = ?').get(exp.id).c;
    exp.cargo_count = db.prepare('SELECT COUNT(*) as c FROM cargo WHERE expedition_id = ?').get(exp.id).c;
    exp.asset_count = 0;
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (create) — Commander only
router.post('/', authMiddleware, requireRole(['commander']), (req, res) => {
  try {
    const { name, destination, zone, start_date, end_date, status, commander_id, description, team_size } = req.body;
    const info = db.prepare(`
      INSERT INTO expeditions (name, destination, zone, start_date, end_date, status, commander_id, description, team_size) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, destination, zone, start_date, end_date, status || 'planning', commander_id || req.user.id, description || null, team_size || 0);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (edit) — Commander only
router.put('/:id', authMiddleware, requireRole(['commander']), (req, res) => {
  try {
    const { name, destination, zone, start_date, end_date, status, commander_id, description, team_size } = req.body;
    const info = db.prepare(`
      UPDATE expeditions 
      SET name = ?, destination = ?, zone = ?, start_date = ?, end_date = ?, status = ?, commander_id = ?, description = ?, team_size = ?
      WHERE id = ?
    `).run(name, destination, zone, start_date, end_date, status, commander_id, description, team_size, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Commander only
router.delete('/:id', authMiddleware, requireRole(['commander']), (req, res) => {
  try {
    const info = db.prepare('DELETE FROM expeditions WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
