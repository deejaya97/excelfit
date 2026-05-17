import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'excelfit.sqlite');

fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.json());
app.use(
  session({
    name: 'excelfit.sid',
    secret: process.env.SESSION_SECRET || 'excel-fit-local-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

const today = () => new Date().toISOString().slice(0, 10);
const addDays = (date, days) => {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
};

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_code TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      emergency_contact TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      joined_on TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      duration_days INTEGER NOT NULL,
      price REAL NOT NULL,
      benefits TEXT,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
      FOREIGN KEY(plan_id) REFERENCES plans(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      membership_id INTEGER,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      paid_on TEXT NOT NULL,
      reference TEXT,
      notes TEXT,
      invoice_number TEXT NOT NULL UNIQUE,
      FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
      FOREIGN KEY(membership_id) REFERENCES memberships(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      checked_in_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL,
      message TEXT NOT NULL,
      FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
    );
  `);

  const staffCount = db.prepare('SELECT COUNT(*) AS count FROM staff').get().count;
  if (!staffCount) {
    db.prepare('INSERT INTO staff (name, username, password_hash, role) VALUES (?, ?, ?, ?)').run(
      'Front Desk Admin',
      'admin',
      bcrypt.hashSync('admin123', 10),
      'manager',
    );
  }

  const planCount = db.prepare('SELECT COUNT(*) AS count FROM plans').get().count;
  if (!planCount) {
    const insertPlan = db.prepare(
      'INSERT INTO plans (name, duration_days, price, benefits) VALUES (?, ?, ?, ?)',
    );
    [
      ['Basic Monthly', 30, 799, 'Gym floor, cardio, free weights, locker access'],
      ['Pro Monthly', 30, 1399, 'Basic plus group classes, progress tracking, trainer review'],
      ['Elite Monthly', 30, 2199, 'Pro plus personal training, diet planning, body composition review'],
      ['Quarterly Saver', 90, 3777, 'Three-month access with bundled savings'],
    ].forEach((plan) => insertPlan.run(...plan));
  }

  const memberCount = db.prepare('SELECT COUNT(*) AS count FROM members').get().count;
  if (!memberCount) seedMembers();
}

function seedMembers() {
  const members = [
    ['M001', 'Aarav', 'Menon', '+91 90000 10001', 'aarav@example.com'],
    ['M002', 'Diya', 'Nair', '+91 90000 10002', 'diya@example.com'],
    ['M003', 'Ishaan', 'Das', '+91 90000 10003', 'ishaan@example.com'],
    ['M004', 'Meera', 'Rao', '+91 90000 10004', 'meera@example.com'],
    ['M005', 'Kabir', 'Khan', '+91 90000 10005', 'kabir@example.com'],
    ['M006', 'Anika', 'Pillai', '+91 90000 10006', 'anika@example.com'],
    ['M007', 'Rohan', 'Varma', '+91 90000 10007', 'rohan@example.com'],
    ['M008', 'Nila', 'Joseph', '+91 90000 10008', 'nila@example.com'],
    ['M009', 'Vivek', 'Thomas', '+91 90000 10009', 'vivek@example.com'],
    ['M010', 'Sara', 'Ali', '+91 90000 10010', 'sara@example.com'],
    ['M011', 'Arjun', 'Krishnan', '+91 90000 10011', 'arjun@example.com'],
    ['M012', 'Leah', 'Mathew', '+91 90000 10012', 'leah@example.com'],
  ];
  const insertMember = db.prepare(`
    INSERT INTO members (member_code, first_name, last_name, phone, email, emergency_contact, joined_on, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMembership = db.prepare(`
    INSERT INTO memberships (member_id, plan_id, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertPayment = db.prepare(`
    INSERT INTO payments (member_id, membership_id, amount, method, paid_on, reference, invoice_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const seedDate = today();
  const planIds = db.prepare('SELECT id, price FROM plans ORDER BY id').all();
  const tx = db.transaction(() => {
    members.forEach((member, index) => {
      const joined = addDays(seedDate, -index * 6);
      const info = insertMember.run(...member, '+91 90000 19999', joined, 'Seed member for demo operations');
      const plan = planIds[index % planIds.length];
      const startDate = addDays(seedDate, -((index % 4) * 8));
      const endDate = addDays(startDate, index === 10 ? -1 : 30);
      const membership = insertMembership.run(
        info.lastInsertRowid,
        plan.id,
        startDate,
        endDate,
        endDate < seedDate ? 'expired' : 'active',
      );
      insertPayment.run(
        info.lastInsertRowid,
        membership.lastInsertRowid,
        plan.price,
        index % 3 === 0 ? 'UPI' : index % 3 === 1 ? 'Cash' : 'Card',
        startDate,
        `SEED-${member[0]}`,
        nextInvoiceNumber(),
      );
    });
  });
  tx();
}

function requireAuth(req, res, next) {
  if (!req.session.staff) {
    return res.status(401).json({ message: 'Staff login required' });
  }
  next();
}

function nextMemberCode() {
  const row = db.prepare("SELECT member_code FROM members WHERE member_code LIKE 'M%' ORDER BY id DESC LIMIT 1").get();
  const number = row ? Number(row.member_code.replace(/\D/g, '')) + 1 : 1;
  return `M${String(number).padStart(3, '0')}`;
}

function nextInvoiceNumber() {
  const row = db.prepare('SELECT COUNT(*) AS count FROM payments').get();
  return `INV-${new Date().getFullYear()}-${String(row.count + 1).padStart(4, '0')}`;
}

function activeMembershipForMember(memberId) {
  return db
    .prepare(
      `
      SELECT memberships.*, plans.name AS plan_name, plans.price
      FROM memberships
      JOIN plans ON plans.id = memberships.plan_id
      WHERE memberships.member_id = ?
      ORDER BY date(memberships.end_date) DESC, memberships.id DESC
      LIMIT 1
    `,
    )
    .get(memberId);
}

initDb();

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const staff = db.prepare('SELECT * FROM staff WHERE username = ?').get(username);
  if (!staff || !bcrypt.compareSync(password || '', staff.password_hash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  req.session.staff = { id: staff.id, name: staff.name, username: staff.username, role: staff.role };
  res.json({ staff: req.session.staff });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ staff: req.session.staff || null });
});

app.get('/api/dashboard', requireAuth, (req, res) => {
  const dashboard = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM members WHERE status = 'active') AS activeMembers,
      (SELECT COUNT(*) FROM memberships WHERE status = 'active' AND date(end_date) >= date('now')) AS activeMemberships,
      (SELECT COUNT(*) FROM memberships WHERE date(end_date) BETWEEN date('now') AND date('now', '+7 days')) AS expiringSoon,
      (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE strftime('%Y-%m', paid_on) = strftime('%Y-%m', 'now')) AS monthRevenue,
      (SELECT COUNT(*) FROM checkins WHERE date(checked_in_at) = date('now') AND status = 'valid') AS todaysCheckins
  `).get();
  const recentPayments = db.prepare(`
    SELECT payments.*, members.first_name || ' ' || members.last_name AS member_name
    FROM payments
    JOIN members ON members.id = payments.member_id
    ORDER BY date(payments.paid_on) DESC, payments.id DESC
    LIMIT 6
  `).all();
  const recentCheckins = db.prepare(`
    SELECT checkins.*, members.member_code, members.first_name || ' ' || members.last_name AS member_name
    FROM checkins
    JOIN members ON members.id = checkins.member_id
    ORDER BY checkins.id DESC
    LIMIT 6
  `).all();
  res.json({ ...dashboard, recentPayments, recentCheckins });
});

app.get('/api/members', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT members.*,
      plans.name AS plan_name,
      memberships.start_date,
      memberships.end_date,
      memberships.status AS membership_status
    FROM members
    LEFT JOIN memberships ON memberships.id = (
      SELECT id FROM memberships m
      WHERE m.member_id = members.id
      ORDER BY date(m.end_date) DESC, m.id DESC
      LIMIT 1
    )
    LEFT JOIN plans ON plans.id = memberships.plan_id
    ORDER BY members.id DESC
  `).all();
  res.json(rows);
});

app.post('/api/members', requireAuth, (req, res) => {
  const { firstName, lastName, phone, email, emergencyContact, notes } = req.body;
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ message: 'First name, last name, and phone are required' });
  }
  const info = db
    .prepare(
      `
      INSERT INTO members (member_code, first_name, last_name, phone, email, emergency_contact, joined_on, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(nextMemberCode(), firstName, lastName, phone, email || '', emergencyContact || '', today(), notes || '');
  res.status(201).json(db.prepare('SELECT * FROM members WHERE id = ?').get(info.lastInsertRowid));
});

app.get('/api/plans', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM plans ORDER BY price ASC').all());
});

app.post('/api/plans', requireAuth, (req, res) => {
  const { name, durationDays, price, benefits } = req.body;
  if (!name || !durationDays || !price) {
    return res.status(400).json({ message: 'Plan name, duration, and price are required' });
  }
  const info = db
    .prepare('INSERT INTO plans (name, duration_days, price, benefits) VALUES (?, ?, ?, ?)')
    .run(name, Number(durationDays), Number(price), benefits || '');
  res.status(201).json(db.prepare('SELECT * FROM plans WHERE id = ?').get(info.lastInsertRowid));
});

app.post('/api/memberships', requireAuth, (req, res) => {
  const { memberId, planId, startDate } = req.body;
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(planId);
  const member = db.prepare('SELECT * FROM members WHERE id = ?').get(memberId);
  if (!plan || !member) return res.status(400).json({ message: 'Valid member and plan are required' });
  const start = startDate || today();
  const end = addDays(start, plan.duration_days);
  db.prepare("UPDATE memberships SET status = 'expired' WHERE member_id = ? AND status = 'active'").run(memberId);
  const info = db
    .prepare('INSERT INTO memberships (member_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)')
    .run(memberId, planId, start, end, 'active');
  res.status(201).json(db.prepare('SELECT * FROM memberships WHERE id = ?').get(info.lastInsertRowid));
});

app.post('/api/payments', requireAuth, (req, res) => {
  const { memberId, membershipId, amount, method, paidOn, reference, notes } = req.body;
  if (!memberId || !amount || !method) {
    return res.status(400).json({ message: 'Member, amount, and method are required' });
  }
  const info = db
    .prepare(
      `
      INSERT INTO payments (member_id, membership_id, amount, method, paid_on, reference, notes, invoice_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      memberId,
      membershipId || activeMembershipForMember(memberId)?.id || null,
      Number(amount),
      method,
      paidOn || today(),
      reference || '',
      notes || '',
      nextInvoiceNumber(),
    );
  res.status(201).json(db.prepare('SELECT * FROM payments WHERE id = ?').get(info.lastInsertRowid));
});

app.get('/api/payments/:id/receipt', requireAuth, (req, res) => {
  const payment = db
    .prepare(
      `
      SELECT payments.*, members.member_code, members.first_name || ' ' || members.last_name AS member_name,
        plans.name AS plan_name, memberships.start_date, memberships.end_date
      FROM payments
      JOIN members ON members.id = payments.member_id
      LEFT JOIN memberships ON memberships.id = payments.membership_id
      LEFT JOIN plans ON plans.id = memberships.plan_id
      WHERE payments.id = ?
    `,
    )
    .get(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Receipt not found' });
  res.json(payment);
});

app.post('/api/checkins', requireAuth, (req, res) => {
  const { memberCode } = req.body;
  const member = db.prepare('SELECT * FROM members WHERE member_code = ? OR phone = ?').get(memberCode, memberCode);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  const membership = activeMembershipForMember(member.id);
  const isValid = member.status === 'active' && membership && membership.status === 'active' && membership.end_date >= today();
  const message = isValid
    ? `Welcome ${member.first_name}. ${membership.plan_name} valid until ${membership.end_date}.`
    : `${member.first_name} does not have an active membership.`;
  const info = db
    .prepare('INSERT INTO checkins (member_id, status, message) VALUES (?, ?, ?)')
    .run(member.id, isValid ? 'valid' : 'invalid', message);
  res.status(isValid ? 201 : 403).json({
    id: info.lastInsertRowid,
    status: isValid ? 'valid' : 'invalid',
    message,
    member,
    membership,
  });
});

app.listen(PORT, () => {
  console.log(`Excel Fit API running at http://localhost:${PORT}`);
  console.log(`SQLite database: ${dbPath}`);
});
