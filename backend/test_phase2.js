const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'localhost', port: 5000, path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      }
    };
    const req = http.request(opts, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  // Login all 3 roles
  const cR = await request('POST', '/api/auth/login', { email: 'commander@ncpor.in', password: 'password123' });
  const lR = await request('POST', '/api/auth/login', { email: 'logistics@ncpor.in', password: 'password123' });
  const fR = await request('POST', '/api/auth/login', { email: 'personnel@ncpor.in', password: 'password123' });

  const ct = cR.body.token;
  const lt = lR.body.token;
  const ft = fR.body.token;
  console.log(`Logins: commander=${cR.status} logistics=${lR.status} field=${fR.status}`);

  // T1: Field DELETE expedition -> 403
  const t1 = await request('DELETE', '/api/expeditions/1', null, ft);
  console.log(`T1 Field DELETE expedition: HTTP ${t1.status} ${t1.status === 403 ? 'PASS' : 'FAIL (expected 403)'}`);

  // T2: Logistics DELETE expedition -> 403
  const t2 = await request('DELETE', '/api/expeditions/1', null, lt);
  console.log(`T2 Logistics DELETE expedition: HTTP ${t2.status} ${t2.status === 403 ? 'PASS' : 'FAIL (expected 403)'}`);

  // T3: Field POST cargo -> 403
  const t3 = await request('POST', '/api/cargo', { item_name: 'test', category: 'other' }, ft);
  console.log(`T3 Field POST cargo: HTTP ${t3.status} ${t3.status === 403 ? 'PASS' : 'FAIL (expected 403)'}`);

  // T4: Logistics POST cargo -> 201
  const t4 = await request('POST', '/api/cargo', { item_name: 'Arctic Ration Pack', category: 'food', quantity: 10 }, lt);
  console.log(`T4 Logistics POST cargo: HTTP ${t4.status} ${t4.status === 201 ? 'PASS' : 'FAIL'} code=${t4.body.cargo_code}`);

  if (t4.status === 201) {
    const newId = t4.body.id;
    // T5: Field PATCH receive -> 200
    const t5 = await request('PATCH', `/api/cargo/${newId}/receive`, { confirmed_by: 'Field User', location_note: 'Maitri' }, ft);
    console.log(`T5 Field PATCH receive: HTTP ${t5.status} ${t5.status === 200 ? 'PASS' : 'FAIL'} msg=${t5.body.message}`);
  }

  // T6: GET /cargo/track/POLAR-CR-1042 -> 200
  const t6 = await request('GET', '/api/cargo/track/POLAR-CR-1042', null, ft);
  console.log(`T6 Track by POLAR code: HTTP ${t6.status} ${t6.status === 200 ? 'PASS' : 'FAIL'} item=${t6.body.item_name} stage=${t6.body.transport_stage}`);

  // T7: Field expeditions (assigned only)
  const t7 = await request('GET', '/api/expeditions', null, ft);
  console.log(`T7 Field sees ${t7.body.length} expedition(s)`);

  // T8: Commander sees all
  const t8 = await request('GET', '/api/expeditions', null, ct);
  console.log(`T8 Commander sees ${t8.body.length} expedition(s)`);

  // T9: Commander POST+DELETE expedition
  const t9c = await request('POST', '/api/expeditions', { name: 'Phase2 Test', destination: 'Bharati', zone: 'antarctic', start_date: '2027-01-01', end_date: '2027-06-01', status: 'planning', team_size: 5 }, ct);
  if (t9c.status === 201) {
    await request('DELETE', `/api/expeditions/${t9c.body.id}`, null, ct);
    console.log(`T9 Commander create+delete expedition: PASS`);
  } else {
    console.log(`T9 Commander POST expedition: HTTP ${t9c.status} ${JSON.stringify(t9c.body)}`);
  }

  // T10: Field cannot DELETE inventory
  const t10 = await request('DELETE', '/api/inventory/1', null, ft);
  console.log(`T10 Field DELETE inventory: HTTP ${t10.status} ${t10.status === 403 ? 'PASS' : 'FAIL (expected 403)'}`);

  // T11: Field cannot POST personnel -> 403
  const t11 = await request('POST', '/api/personnel', { name: 'Unauthorized Recruit', role_title: 'Scientist' }, ft);
  console.log(`T11 Field POST personnel: HTTP ${t11.status} ${t11.status === 403 ? 'PASS' : 'FAIL (expected 403)'}`);

  // T12: Logistics CAN POST personnel -> 201
  const t12 = await request('POST', '/api/personnel', { name: 'Test Glaciologist', role_title: 'Glaciologist', health_status: 'fit' }, lt);
  console.log(`T12 Logistics POST personnel: HTTP ${t12.status} ${t12.status === 201 ? 'PASS' : 'FAIL'}`);
  if (t12.status === 201) {
    await request('DELETE', `/api/personnel/${t12.body.id}`, null, lt);
  }

  // T13: Field CAN raise emergency SOS -> 201
  const t13 = await request('POST', '/api/emergency', { raised_by: 'Field Team Alpha', alert_type: 'weather', severity: 'high', description: 'Blizzard approaching Ridge 4' }, ft);
  console.log(`T13 Field POST emergency SOS: HTTP ${t13.status} ${t13.status === 201 ? 'PASS' : 'FAIL'}`);

  if (t13.status === 201) {
    const alertId = t13.body.id;
    // T14: Field CANNOT resolve emergency alert -> 403
    const t14 = await request('PATCH', `/api/emergency/${alertId}/resolve`, { resolution_notes: 'Self resolved' }, ft);
    console.log(`T14 Field resolve emergency alert: HTTP ${t14.status} ${t14.status === 403 ? 'PASS' : 'FAIL (expected 403)'}`);

    // T15: Commander CAN resolve emergency alert -> 200
    const t15 = await request('PATCH', `/api/emergency/${alertId}/resolve`, { resolution_notes: 'Command dispatched shelter protocol' }, ct);
    console.log(`T15 Commander resolve emergency alert: HTTP ${t15.status} ${t15.status === 200 ? 'PASS' : 'FAIL'}`);

    // Clean up alert
    await request('DELETE', `/api/emergency/${alertId}`, null, ct);
  }

  // T16: Field Checkin endpoint -> 200
  const t16 = await request('POST', '/api/personnel/checkin', { waypoint: 'Waypoint Charlie', health_status: 'fit' }, ft);
  console.log(`T16 Field Checkin endpoint: HTTP ${t16.status} ${t16.status === 200 ? 'PASS' : 'FAIL'} msg=${t16.body.message}`);

  console.log('\n=== ALL 16 INTEGRATION TESTS COMPLETE ===');
  process.exit(0);
}

main().catch(e => { console.error('Test error:', e.message); process.exit(1); });
