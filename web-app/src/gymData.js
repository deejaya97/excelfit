const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const sessionKey = 'excelfit_staff_session';

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (date, days) => {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + Number(days || 0));
  return next.toISOString().slice(0, 10);
};

const byNewestDate = (field) => (a, b) => String(b[field] || '').localeCompare(String(a[field] || ''));

export function getStoredStaff() {
  return getStoredSession()?.staff || null;
}

export function logoutStaff() {
  localStorage.removeItem(sessionKey);
}

export async function loginStaff(credentials) {
  const data = await apiRequest('/login', {
    method: 'POST',
    body: credentials,
    skipAuth: true,
  });
  localStorage.setItem(sessionKey, JSON.stringify(data));
  return data.staff;
}

export async function loadGymData() {
  const data = await apiRequest('/gym-data');
  const members = data.members || [];
  const plans = data.plans || [];
  const payments = (data.payments || []).sort(byNewestDate('paid_on'));
  const checkins = (data.checkins || []).sort(byNewestDate('checked_in_at'));

  return {
    members,
    plans,
    payments,
    checkins,
    dashboard: buildDashboard(members, payments, checkins),
  };
}

export async function createMember(form, members) {
  await apiRequest('/members', {
    method: 'POST',
    body: {
      memberCode: nextMemberCode(members),
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email || null,
      emergencyContact: form.emergencyContact || null,
      joinedOn: today(),
      notes: form.notes || null,
    },
  });
}

export async function createPlan(form) {
  await apiRequest('/plans', {
    method: 'POST',
    body: {
      name: form.name,
      durationDays: Number(form.durationDays),
      price: Number(form.price),
      benefits: form.benefits || null,
    },
  });
}

export async function assignMembership(form, plans) {
  const plan = plans.find((item) => item.id === form.planId);
  if (!plan) throw new Error('Select a valid membership plan.');
  const startDate = form.startDate || today();
  await apiRequest('/memberships', {
    method: 'POST',
    body: {
      memberId: form.memberId,
      planId: form.planId,
      startDate,
      endDate: addDays(startDate, plan.duration_days),
    },
  });
}

export async function recordPayment(form, members, payments) {
  const member = members.find((item) => item.id === form.memberId);
  if (!member) throw new Error('Select a valid member.');
  const invoiceNumber = nextInvoiceNumber(payments);
  await apiRequest('/payments', {
    method: 'POST',
    body: {
      memberId: form.memberId,
      membershipId: form.membershipId || member.membership_id || null,
      amount: Number(form.amount),
      method: form.method,
      paidOn: form.paidOn || today(),
      reference: form.reference || null,
      notes: form.notes || null,
      invoiceNumber,
    },
  });

  return {
    invoice_number: invoiceNumber,
    member_name: `${member.first_name} ${member.last_name}`,
    member_code: member.member_code,
    plan_name: member.plan_name || 'General payment',
    start_date: member.start_date,
    end_date: member.end_date,
    method: form.method,
    paid_on: form.paidOn || today(),
    amount: Number(form.amount),
  };
}

export async function recordCheckIn(member, status, message) {
  await apiRequest('/checkins', {
    method: 'POST',
    body: {
      memberId: member.id,
      status,
      message,
    },
  });
}

export function validateMemberCheckIn(code, members) {
  const normalized = code.trim().toLowerCase();
  const member = members.find(
    (item) => item.member_code.toLowerCase() === normalized || item.phone.toLowerCase() === normalized,
  );

  if (!member) {
    return { status: 'invalid', message: 'Member not found.' };
  }

  const valid =
    member.status === 'active' &&
    member.membership_status === 'active' &&
    Boolean(member.end_date) &&
    member.end_date >= today();

  return {
    status: valid ? 'valid' : 'invalid',
    message: valid
      ? `Welcome ${member.first_name}. ${member.plan_name} valid until ${member.end_date}.`
      : `${member.first_name} does not have an active membership.`,
    member,
  };
}

function buildDashboard(members, payments, checkins) {
  const currentDate = today();
  const sevenDays = addDays(currentDate, 7);
  const currentMonth = currentDate.slice(0, 7);

  return {
    activeMembers: members.filter((member) => member.status === 'active').length,
    activeMemberships: members.filter(
      (member) => member.membership_status === 'active' && member.end_date >= currentDate,
    ).length,
    expiringSoon: members.filter((member) => member.end_date >= currentDate && member.end_date <= sevenDays).length,
    monthRevenue: payments
      .filter((payment) => payment.paid_on?.startsWith(currentMonth))
      .reduce((total, payment) => total + Number(payment.amount || 0), 0),
    todaysCheckins: checkins.filter(
      (checkin) => checkin.status === 'valid' && checkin.checked_in_at?.slice(0, 10) === currentDate,
    ).length,
    recentPayments: payments.slice(0, 6),
    recentCheckins: checkins.slice(0, 6),
  };
}

function nextMemberCode(members) {
  const max = members.reduce((highest, member) => {
    const value = Number(String(member.member_code || '').replace(/\D/g, ''));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return `M${String(max + 1).padStart(3, '0')}`;
}

function nextInvoiceNumber(payments) {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(payments.length + 1).padStart(4, '0')}`;
}

async function apiRequest(path, options = {}) {
  const token = getStoredSession()?.token;
  if (!options.skipAuth && !token) throw new Error('Please log in again.');

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

function getStoredSession() {
  const rawSession = localStorage.getItem(sessionKey);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch {
    localStorage.removeItem(sessionKey);
    return null;
  }
}
