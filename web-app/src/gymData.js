import {
  assignMembership as assignMembershipMutation,
  createCheckIn,
  createMember as createMemberMutation,
  createPlan as createPlanMutation,
  listCheckIns,
  listMembers,
  listPayments,
  listPlans,
  recordPayment as recordPaymentMutation,
} from '@dataconnect/generated';
import { dataConnect } from './firebase';

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (date, days) => {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + Number(days || 0));
  return next.toISOString().slice(0, 10);
};

const byNewestDate = (field) => (a, b) => String(b[field] || '').localeCompare(String(a[field] || ''));

const mapMember = (member) => {
  const membership = member.memberships_on_member?.[0];
  return {
    id: member.id,
    member_code: member.memberCode,
    first_name: member.firstName,
    last_name: member.lastName,
    phone: member.phone,
    email: member.email || '',
    emergency_contact: member.emergencyContact || '',
    status: member.status,
    joined_on: member.joinedOn,
    notes: member.notes || '',
    membership_id: membership?.id || '',
    plan_id: membership?.plan?.id || '',
    plan_name: membership?.plan?.name || '',
    plan_price: membership?.plan?.price || '',
    start_date: membership?.startDate || '',
    end_date: membership?.endDate || '',
    membership_status: membership?.status || '',
  };
};

const mapPlan = (plan) => ({
  id: plan.id,
  name: plan.name,
  duration_days: plan.durationDays,
  price: plan.price,
  benefits: plan.benefits || '',
  active: plan.active,
});

const mapPayment = (payment) => ({
  id: payment.id,
  amount: payment.amount,
  method: payment.method,
  paid_on: payment.paidOn,
  reference: payment.reference || '',
  notes: payment.notes || '',
  invoice_number: payment.invoiceNumber,
  member_id: payment.member?.id || '',
  member_code: payment.member?.memberCode || '',
  member_name: payment.member ? `${payment.member.firstName} ${payment.member.lastName}` : '',
  plan_name: payment.membership?.plan?.name || '',
  start_date: payment.membership?.startDate || '',
  end_date: payment.membership?.endDate || '',
});

const mapCheckIn = (checkIn) => ({
  id: checkIn.id,
  checked_in_at: checkIn.checkedInAt,
  status: checkIn.status,
  message: checkIn.message,
  member_id: checkIn.member?.id || '',
  member_code: checkIn.member?.memberCode || '',
  member_name: checkIn.member ? `${checkIn.member.firstName} ${checkIn.member.lastName}` : '',
});

export async function loadGymData() {
  const [memberData, planData, paymentData, checkInData] = await Promise.all([
    listMembers(dataConnect).then((result) => result.data),
    listPlans(dataConnect).then((result) => result.data),
    listPayments(dataConnect).then((result) => result.data),
    listCheckIns(dataConnect).then((result) => result.data),
  ]);

  const members = (memberData.members || []).map(mapMember);
  const plans = (planData.membershipPlans || []).map(mapPlan);
  const payments = (paymentData.payments || []).map(mapPayment).sort(byNewestDate('paid_on'));
  const checkins = (checkInData.checkIns || []).map(mapCheckIn).sort(byNewestDate('checked_in_at'));

  return {
    members,
    plans,
    payments,
    checkins,
    dashboard: buildDashboard(members, payments, checkins),
  };
}

export async function createMember(form, members) {
  await createMemberMutation(dataConnect, {
    memberCode: nextMemberCode(members),
    firstName: form.firstName,
    lastName: form.lastName,
    phone: form.phone,
    email: form.email || null,
    emergencyContact: form.emergencyContact || null,
    joinedOn: today(),
    notes: form.notes || null,
  });
}

export async function createPlan(form) {
  await createPlanMutation(dataConnect, {
    name: form.name,
    durationDays: Number(form.durationDays),
    price: Number(form.price),
    benefits: form.benefits || null,
  });
}

export async function assignMembership(form, plans) {
  const plan = plans.find((item) => item.id === form.planId);
  if (!plan) throw new Error('Select a valid membership plan.');
  const startDate = form.startDate || today();
  await assignMembershipMutation(dataConnect, {
    memberId: form.memberId,
    planId: form.planId,
    startDate,
    endDate: addDays(startDate, plan.duration_days),
  });
}

export async function recordPayment(form, members, payments) {
  const member = members.find((item) => item.id === form.memberId);
  if (!member) throw new Error('Select a valid member.');
  const invoiceNumber = nextInvoiceNumber(payments);
  await recordPaymentMutation(dataConnect, {
    memberId: form.memberId,
    membershipId: form.membershipId || member.membership_id || null,
    amount: Number(form.amount),
    method: form.method,
    paidOn: form.paidOn || today(),
    reference: form.reference || null,
    notes: form.notes || null,
    invoiceNumber,
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
  await createCheckIn(dataConnect, {
    memberId: member.id,
    status,
    message,
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
