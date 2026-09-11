const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'db', 'polar.db'));

const columns = [
  { name: 'cargo_code',              def: 'TEXT' },
  { name: 'current_location',        def: 'TEXT' },
  { name: 'current_latitude',        def: 'REAL' },
  { name: 'current_longitude',       def: 'REAL' },
  { name: 'destination_latitude',    def: 'REAL' },
  { name: 'destination_longitude',   def: 'REAL' },
  { name: 'transport_stage',         def: 'TEXT' },
  { name: 'condition',               def: 'TEXT' },
  { name: 'last_updated',            def: 'DATETIME' },
];

for (const col of columns) {
  try {
    db.exec(`ALTER TABLE cargo ADD COLUMN ${col.name} ${col.def}`);
    console.log(`  ✓ Added column: ${col.name}`);
  } catch (e) {
    if (e.message && e.message.includes('duplicate column')) {
      console.log(`  ~ Already exists (skip): ${col.name}`);
    } else {
      console.error(`  ✗ Error on ${col.name}:`, e.message);
    }
  }
}

// Backfill cargo_code for existing rows that don't have one
const rows = db.prepare('SELECT id, tracking_code FROM cargo WHERE cargo_code IS NULL').all();
for (const row of rows) {
  const code = 'POLAR-' + (row.tracking_code || ('CR-' + row.id));
  db.prepare('UPDATE cargo SET cargo_code = ? WHERE id = ?').run(code, row.id);
  console.log(`  ✓ Backfilled cargo_code=${code} for id=${row.id}`);
}

// Backfill transport_stage from existing transport_leg column
db.exec(`
  UPDATE cargo
  SET transport_stage = CASE transport_leg
    WHEN 'ship'     THEN 'SHIP'
    WHEN 'aircraft' THEN 'AIRCRAFT'
    WHEN 'snowcat'  THEN 'SNOWCAT'
    WHEN 'camp'     THEN 'FIELD_CAMP'
    ELSE 'PORT'
  END
  WHERE transport_stage IS NULL
`);
console.log('  ✓ Backfilled transport_stage from transport_leg');

// Set default current_location where missing
db.exec(`UPDATE cargo SET current_location = 'Port, Goa' WHERE current_location IS NULL`);
console.log('  ✓ Set default current_location');

// Set default condition where missing
db.exec(`UPDATE cargo SET condition = 'good' WHERE condition IS NULL`);
console.log('  ✓ Set default condition');

// Set last_updated where missing
db.exec(`UPDATE cargo SET last_updated = CURRENT_TIMESTAMP WHERE last_updated IS NULL`);
console.log('  ✓ Set default last_updated');

console.log('\nMigration complete!');
db.close();
