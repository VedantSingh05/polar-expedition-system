const express = require('express');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const resolvedParam = req.query.resolved;
    let query = `
      SELECT a.*, e.name as expedition_name 
      FROM emergency_alerts a
      LEFT JOIN expeditions e ON a.expedition_id = e.id
    `;
    let items;
    if (resolvedParam !== undefined) {
      query += ' WHERE a.resolved = ? ORDER BY a.timestamp DESC';
      items = db.prepare(query).all(resolvedParam);
    } else {
      query += ' ORDER BY a.timestamp DESC';
      items = db.prepare(query).all();
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const alert = db.prepare('SELECT * FROM emergency_alerts WHERE id = ?').get(req.params.id);
    if (!alert) return res.status(404).json({ error: 'Not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { expedition_id, raised_by, alert_type, severity, description, location_description } = req.body;
    const info = db.prepare(`
      INSERT INTO emergency_alerts (expedition_id, raised_by, alert_type, severity, description, location_description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      expedition_id || null,
      raised_by || req.user.name || 'Polar Officer',
      alert_type || 'other',
      severity || 'medium',
      description,
      location_description || null
    );
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/resolve', authMiddleware, requireRole(['commander']), (req, res) => {
  try {
    const { resolution_notes } = req.body;
    const info = db.prepare(`
      UPDATE emergency_alerts 
      SET resolved = 1, resolved_at = CURRENT_TIMESTAMP, resolution_notes = ?
      WHERE id = ?
    `).run(resolution_notes, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, requireRole(['commander']), (req, res) => {
  try {
    const info = db.prepare('DELETE FROM emergency_alerts WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
