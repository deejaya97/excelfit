import express from "express";
import {createHmac, timingSafeEqual} from "crypto";
import {Pool, PoolClient} from "pg";

const app = express();
app.use(express.json());

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use((request, response, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN || "*";
  response.set("Access-Control-Allow-Origin", allowedOrigin);
  response.set("Access-Control-Allow-Headers", "authorization,content-type");
  response.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }
  next();
});

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured.");
    }
    pool = new Pool({
      connectionString,
      ssl: {rejectUnauthorized: false},
      max: 5,
    });
  }
  return pool;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool().query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS members (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        member_code varchar(20) NOT NULL UNIQUE,
        first_name varchar(80) NOT NULL,
        last_name varchar(80) NOT NULL,
        phone varchar(32) NOT NULL,
        email varchar(160),
        emergency_contact varchar(80),
        status varchar(24) NOT NULL DEFAULT 'active',
        joined_on date NOT NULL,
        notes text,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS membership_plans (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(80) NOT NULL,
        duration_days integer NOT NULL,
        price double precision NOT NULL,
        benefits text,
        active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS memberships (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        plan_id uuid NOT NULL REFERENCES membership_plans(id),
        start_date date NOT NULL,
        end_date date NOT NULL,
        status varchar(24) NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS payments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        membership_id uuid REFERENCES memberships(id) ON DELETE SET NULL,
        amount double precision NOT NULL,
        method varchar(32) NOT NULL,
        paid_on date NOT NULL,
        reference varchar(80),
        notes text,
        invoice_number varchar(40) NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS check_ins (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        checked_in_at timestamptz NOT NULL DEFAULT now(),
        status varchar(24) NOT NULL,
        message text NOT NULL
      );

      CREATE INDEX IF NOT EXISTS memberships_member_end_idx ON memberships(member_id, end_date DESC);
      CREATE INDEX IF NOT EXISTS payments_paid_on_idx ON payments(paid_on DESC);
      CREATE INDEX IF NOT EXISTS check_ins_checked_in_at_idx ON check_ins(checked_in_at DESC);
    `).then(() => undefined);
  }

  await schemaReady;
}

// ── Auth middleware ───────────────────────────────────────────────────────────
app.use(async (request, response, next) => {
  if (request.path === "/login") {
    next();
    return;
  }

  try {
    const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
    const staff = verifySessionToken(token || "");
    if (!staff) throw new Error("Please log in again.");
    await ensureSchema();
    response.locals.staff = staff;
    next();
  } catch (error) {
    response.status(401).json({error: errorMessage(error)});
  }
});

app.post("/login", (request, response) => {
  const expectedEmail = process.env.STAFF_EMAIL;
  const expectedPassword = process.env.STAFF_PASSWORD;
  if (!expectedEmail || !expectedPassword) {
    response.status(500).json({error: "Server credentials not configured."});
    return;
  }
  const {email, password} = request.body || {};

  if (email !== expectedEmail || password !== expectedPassword) {
    response.status(401).json({error: "Invalid email or password."});
    return;
  }

  const expiresAt = Date.now() + 1000 * 60 * 60 * 12;
  response.json({
    staff: {email},
    token: createSessionToken({email, expiresAt}),
  });
});

app.get("/gym-data", async (_request, response) => {
  const db = getPool();
  const [members, plans, payments, checkins] = await Promise.all([
    db.query(`
      SELECT
        m.id,
        m.member_code,
        m.first_name,
        m.last_name,
        m.phone,
        COALESCE(m.email, '') AS email,
        COALESCE(m.emergency_contact, '') AS emergency_contact,
        m.status,
        to_char(m.joined_on, 'YYYY-MM-DD') AS joined_on,
        COALESCE(m.notes, '') AS notes,
        COALESCE(latest.id::text, '') AS membership_id,
        COALESCE(latest.plan_id::text, '') AS plan_id,
        COALESCE(latest.plan_name, '') AS plan_name,
        COALESCE(latest.plan_price, 0) AS plan_price,
        COALESCE(to_char(latest.start_date, 'YYYY-MM-DD'), '') AS start_date,
        COALESCE(to_char(latest.end_date, 'YYYY-MM-DD'), '') AS end_date,
        COALESCE(latest.status, '') AS membership_status
      FROM members m
      LEFT JOIN LATERAL (
        SELECT ms.id, ms.plan_id, p.name AS plan_name, p.price AS plan_price,
          ms.start_date, ms.end_date, ms.status
        FROM memberships ms
        JOIN membership_plans p ON p.id = ms.plan_id
        WHERE ms.member_id = m.id
        ORDER BY ms.end_date DESC
        LIMIT 1
      ) latest ON true
      ORDER BY m.joined_on DESC
      LIMIT 100
    `),
    db.query(`
      SELECT id, name, duration_days, price, COALESCE(benefits, '') AS benefits, active
      FROM membership_plans
      WHERE active = true
      ORDER BY price ASC
    `),
    db.query(`
      SELECT
        p.id,
        p.amount,
        p.method,
        to_char(p.paid_on, 'YYYY-MM-DD') AS paid_on,
        COALESCE(p.reference, '') AS reference,
        COALESCE(p.notes, '') AS notes,
        p.invoice_number,
        p.member_id,
        m.member_code,
        concat(m.first_name, ' ', m.last_name) AS member_name,
        COALESCE(mp.name, '') AS plan_name,
        COALESCE(to_char(ms.start_date, 'YYYY-MM-DD'), '') AS start_date,
        COALESCE(to_char(ms.end_date, 'YYYY-MM-DD'), '') AS end_date
      FROM payments p
      JOIN members m ON m.id = p.member_id
      LEFT JOIN memberships ms ON ms.id = p.membership_id
      LEFT JOIN membership_plans mp ON mp.id = ms.plan_id
      ORDER BY p.paid_on DESC
      LIMIT 100
    `),
    db.query(`
      SELECT
        c.id,
        c.checked_in_at,
        c.status,
        c.message,
        c.member_id,
        m.member_code,
        concat(m.first_name, ' ', m.last_name) AS member_name
      FROM check_ins c
      JOIN members m ON m.id = c.member_id
      ORDER BY c.checked_in_at DESC
      LIMIT 100
    `),
  ]);

  response.json({
    members: members.rows,
    plans: plans.rows,
    payments: payments.rows,
    checkins: checkins.rows,
  });
});

app.post("/members", async (request, response) => {
  const body = request.body;
  await getPool().query(
    `INSERT INTO members
      (member_code, first_name, last_name, phone, email, emergency_contact, joined_on, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      body.memberCode,
      body.firstName,
      body.lastName,
      body.phone,
      nullable(body.email),
      nullable(body.emergencyContact),
      body.joinedOn,
      nullable(body.notes),
    ],
  );

  response.status(201).json({ok: true});
});

app.post("/plans", async (request, response) => {
  const body = request.body;
  await getPool().query(
    `INSERT INTO membership_plans (name, duration_days, price, benefits, active)
     VALUES ($1, $2, $3, $4, true)`,
    [body.name, body.durationDays, body.price, nullable(body.benefits)],
  );

  response.status(201).json({ok: true});
});

app.post("/memberships", async (request, response) => {
  const body = request.body;
  const db = await getPool().connect();

  try {
    await transaction(db, async () => {
      await db.query(
        `UPDATE memberships SET status = 'expired'
         WHERE member_id = $1 AND status = 'active'`,
        [body.memberId],
      );
      await db.query(
        `INSERT INTO memberships (member_id, plan_id, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, 'active')`,
        [body.memberId, body.planId, body.startDate, body.endDate],
      );
    });

    response.status(201).json({ok: true});
  } finally {
    db.release();
  }
});

app.post("/payments", async (request, response) => {
  const body = request.body;
  await getPool().query(
    `INSERT INTO payments
      (member_id, membership_id, amount, method, paid_on, reference, notes, invoice_number)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      body.memberId,
      nullable(body.membershipId),
      body.amount,
      body.method,
      body.paidOn,
      nullable(body.reference),
      nullable(body.notes),
      body.invoiceNumber,
    ],
  );

  response.status(201).json({ok: true});
});

app.post("/checkins", async (request, response) => {
  const body = request.body;
  await getPool().query(
    `INSERT INTO check_ins (member_id, status, message)
     VALUES ($1, $2, $3)`,
    [body.memberId, body.status, body.message],
  );

  response.status(201).json({ok: true});
});

async function transaction(db: PoolClient, callback: () => Promise<void>) {
  await db.query("BEGIN");
  try {
    await callback();
    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}

function nullable(value: unknown) {
  return value === undefined || value === "" ? null : value;
}

function createSessionToken(payload: {email: string; expiresAt: number}) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as {email?: string; expiresAt?: number};

  if (!payload.email || !payload.expiresAt || payload.expiresAt < Date.now()) {
    return null;
  }

  return {email: payload.email};
}

function sign(value: string) {
  return createHmac("sha256", getRequiredEnv("SESSION_SECRET"))
    .update(value)
    .digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer);
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected server error.";
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`ExcelFit API running on port ${PORT}`);
});
