const express = require('express');
const { db } = require('../db/database');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const items = db.prepare(`
      SELECT *, (quantity <= min_threshold) as is_low_stock 
      FROM inventory_items
    `).all();
    // Convert SQLite 1/0 to boolean
    const formatted = items.map(item => ({ ...item, is_low_stock: !!item.is_low_stock }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/low-stock', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM inventory_items WHERE quantity <= min_threshold').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM inventory_items WHERE id = ?').get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const { name, category, quantity, unit, min_threshold, location, notes } = req.body;
    const info = db.prepare(`
      INSERT INTO inventory_items (name, category, quantity, unit, min_threshold, location, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, quantity || 0, unit || 'units', min_threshold || 10, location || 'Main Warehouse, Goa', notes);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const { name, category, quantity, unit, min_threshold, location, notes } = req.body;
    const info = db.prepare(`
      UPDATE inventory_items 
      SET name = ?, category = ?, quantity = ?, unit = ?, min_threshold = ?, location = ?, notes = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, category, quantity, unit, min_threshold, location, notes, req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, requireRole(['commander', 'logistics_officer']), (req, res) => {
  try {
    const info = db.prepare('DELETE FROM inventory_items WHERE id = ?').run(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
