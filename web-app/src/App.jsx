import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import './App.css';
import { auth } from './firebase';
import {
  assignMembership,
  createMember,
  createPlan,
  loadGymData,
  recordCheckIn,
  recordPayment,
  validateMemberCheckIn,
} from './gymData';

const blankMember = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  emergencyContact: '',
  notes: '',
};

const blankPlan = {
  name: '',
  durationDays: 30,
  price: '',
  benefits: '',
};

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

function App() {
  const [staff, setStaff] = useState(null);
  const [login, setLogin] = useState({ email: 'admin@excelfitgym.com', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [memberForm, setMemberForm] = useState(blankMember);
  const [planForm, setPlanForm] = useState(blankPlan);
  const [membershipForm, setMembershipForm] = useState({ memberId: '', planId: '', startDate: '' });
  const [paymentForm, setPaymentForm] = useState({
    memberId: '',
    membershipId: '',
    amount: '',
    method: 'UPI',
    paidOn: new Date().toISOString().slice(0, 10),
    reference: '',
    notes: '',
  });
  const [checkinCode, setCheckinCode] = useState('');
  const [checkinResult, setCheckinResult] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const currentMember = useMemo(
    () => members.find((member) => String(member.id) === String(paymentForm.memberId)),
    [members, paymentForm.memberId],
  );

  async function refresh() {
    const data = await loadGymData();
    setDashboard(data.dashboard);
    setMembers(data.members);
    setPlans(data.plans);
    setPayments(data.payments);
  }

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setStaff(user);
      if (user) {
        refresh().catch((err) => setError(err.message));
      } else {
        setDashboard(null);
        setMembers([]);
        setPlans([]);
        setPayments([]);
      }
    });
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, login.email, login.password);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    await firebaseSignOut(auth);
  }

  async function submitMember(event) {
    event.preventDefault();
    await runAction(async () => {
      await createMember(memberForm, members);
      setMemberForm(blankMember);
      setNotice('Member registered.');
      await refresh();
    });
  }

  async function submitPlan(event) {
    event.preventDefault();
    await runAction(async () => {
      await createPlan(planForm);
      setPlanForm(blankPlan);
      setNotice('Membership plan added.');
      await refresh();
    });
  }

  async function submitMembership(event) {
    event.preventDefault();
    await runAction(async () => {
      await assignMembership(membershipForm, plans);
      setMembershipForm({ memberId: '', planId: '', startDate: '' });
      setNotice('Membership assigned.');
      await refresh();
    });
  }

  async function submitPayment(event) {
    event.preventDefault();
    await runAction(async () => {
      const receiptData = await recordPayment(paymentForm, members, payments);
      setReceipt(receiptData);
      setPaymentForm({
        memberId: '',
        membershipId: '',
        amount: '',
        method: 'UPI',
        paidOn: new Date().toISOString().slice(0, 10),
        reference: '',
        notes: '',
      });
      setNotice('Payment recorded and receipt generated.');
      await refresh();
    });
  }

  async function submitCheckin(event) {
    event.preventDefault();
    setError('');
    setCheckinResult(null);
    const result = validateMemberCheckIn(checkinCode, members);
    try {
      if (result.member) {
        await recordCheckIn(result.member, result.status, result.message);
      }
      setCheckinResult(result);
      setCheckinCode('');
      await refresh();
    } catch (err) {
      setCheckinResult({ status: 'invalid', message: err.message || result.message });
      await refresh().catch(() => {});
    }
  }

  async function runAction(action) {
    setError('');
    setNotice('');
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  }

  function selectMemberForPayment(member) {
    setPaymentForm((form) => ({
      ...form,
      memberId: member.id,
      membershipId: '',
      amount: member.plan_price || (member.plan_name ? plans.find((plan) => plan.name === member.plan_name)?.price || '' : ''),
    }));
    setActiveTab('payments');
  }

  if (!staff) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div>
            <p className="eyebrow">Excel Fit Gym</p>
            <h1>Staff Login</h1>
            <p className="muted">Firebase SQL Connect management console for up to 50 active gym members.</p>
          </div>
          <form onSubmit={handleLogin} className="form-stack">
            <label>
              Email
              <input
                type="email"
                value={login.email}
                onChange={(e) => setLogin({ ...login, email: e.target.value })}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
              />
            </label>
            {error && <div className="alert error">{error}</div>}
            <button type="submit">Log In</button>
          </form>
          <p className="hint">Use a Firebase Authentication staff account with Email/Password enabled.</p>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>EF</span>
          <div>
            <strong>Excel Fit</strong>
            <small>Gym Management</small>
          </div>
        </div>
        <nav>
          {[
            ['dashboard', 'Dashboard'],
            ['members', 'Members'],
            ['plans', 'Plans'],
            ['memberships', 'Assign Plan'],
            ['payments', 'Payments'],
            ['checkin', 'Check-in'],
          ].map(([key, label]) => (
            <button
              type="button"
              className={activeTab === key ? 'active' : ''}
              onClick={() => setActiveTab(key)}
              key={key}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Firebase SQL Connect</p>
            <h1>{titleFor(activeTab)}</h1>
          </div>
          <div className="staff-chip">
            <span>{staff.email}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {notice && <div className="alert success">{notice}</div>}
        {error && <div className="alert error">{error}</div>}

        {activeTab === 'dashboard' && dashboard && (
          <section className="dashboard-grid">
            <Metric label="Active Members" value={dashboard.activeMembers} />
            <Metric label="Active Plans" value={dashboard.activeMemberships} />
            <Metric label="Expiring in 7 Days" value={dashboard.expiringSoon} />
            <Metric label="This Month Revenue" value={money(dashboard.monthRevenue)} />
            <Metric label="Today Check-ins" value={dashboard.todaysCheckins} />

            <div className="panel wide">
              <h2>Recent Payments</h2>
              <DataTable
                columns={['Invoice', 'Member', 'Amount', 'Method', 'Paid On']}
                rows={dashboard.recentPayments.map((payment) => [
                  payment.invoice_number,
                  payment.member_name,
                  money(payment.amount),
                  payment.method,
                  payment.paid_on,
                ])}
              />
            </div>
            <div className="panel">
              <h2>Recent Check-ins</h2>
              <div className="activity-list">
                {dashboard.recentCheckins.map((item) => (
                  <div className="activity-item" key={item.id}>
                    <span className={item.status === 'valid' ? 'pill good' : 'pill bad'}>{item.status}</span>
                    <div>
                      <strong>{item.member_name}</strong>
                      <small>{item.message}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'members' && (
          <section className="split">
            <form className="panel form-grid" onSubmit={submitMember}>
              <h2>Register Member</h2>
              <label>
                First Name
                <input
                  required
                  value={memberForm.firstName}
                  onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                />
              </label>
              <label>
                Last Name
                <input
                  required
                  value={memberForm.lastName}
                  onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                />
              </label>
              <label>
                Phone
                <input
                  required
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                />
              </label>
              <label>
                Emergency Contact
                <input
                  value={memberForm.emergencyContact}
                  onChange={(e) => setMemberForm({ ...memberForm, emergencyContact: e.target.value })}
                />
              </label>
              <label>
                Notes
                <textarea value={memberForm.notes} onChange={(e) => setMemberForm({ ...memberForm, notes: e.target.value })} />
              </label>
              <button type="submit">Register Member</button>
            </form>

            <div className="panel table-panel">
              <h2>Member Directory</h2>
              <DataTable
                columns={['Code', 'Name', 'Phone', 'Plan', 'Valid Until', 'Action']}
                rows={members.map((member) => [
                  member.member_code,
                  `${member.first_name} ${member.last_name}`,
                  member.phone,
                  member.plan_name || 'Unassigned',
                  member.end_date || '-',
                  <button className="link-button" type="button" onClick={() => selectMemberForPayment(member)}>
                    Pay
                  </button>,
                ])}
              />
            </div>
          </section>
        )}

        {activeTab === 'plans' && (
          <section className="split">
            <form className="panel form-stack" onSubmit={submitPlan}>
              <h2>Add Plan</h2>
              <label>
                Plan Name
                <input required value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} />
              </label>
              <label>
                Duration Days
                <input
                  required
                  type="number"
                  min="1"
                  value={planForm.durationDays}
                  onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.value })}
                />
              </label>
              <label>
                Price
                <input
                  required
                  type="number"
                  min="1"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                />
              </label>
              <label>
                Benefits
                <textarea value={planForm.benefits} onChange={(e) => setPlanForm({ ...planForm, benefits: e.target.value })} />
              </label>
              <button type="submit">Save Plan</button>
            </form>

            <div className="plans-grid">
              {plans.map((plan) => (
                <article className="plan-card" key={plan.id}>
                  <h2>{plan.name}</h2>
                  <strong>{money(plan.price)}</strong>
                  <span>{plan.duration_days} days</span>
                  <p>{plan.benefits}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'memberships' && (
          <section className="panel compact">
            <form className="form-grid" onSubmit={submitMembership}>
              <h2>Assign Membership</h2>
              <label>
                Member
                <select
                  required
                  value={membershipForm.memberId}
                  onChange={(e) => setMembershipForm({ ...membershipForm, memberId: e.target.value })}
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option value={member.id} key={member.id}>
                      {member.member_code} - {member.first_name} {member.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Plan
                <select
                  required
                  value={membershipForm.planId}
                  onChange={(e) => setMembershipForm({ ...membershipForm, planId: e.target.value })}
                >
                  <option value="">Select plan</option>
                  {plans.map((plan) => (
                    <option value={plan.id} key={plan.id}>
                      {plan.name} - {money(plan.price)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Start Date
                <input
                  type="date"
                  value={membershipForm.startDate}
                  onChange={(e) => setMembershipForm({ ...membershipForm, startDate: e.target.value })}
                />
              </label>
              <button type="submit">Assign Plan</button>
            </form>
          </section>
        )}

        {activeTab === 'payments' && (
          <section className="split">
            <form className="panel form-grid" onSubmit={submitPayment}>
              <h2>Record Payment</h2>
              <label>
                Member
                <select
                  required
                  value={paymentForm.memberId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, memberId: e.target.value })}
                >
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option value={member.id} key={member.id}>
                      {member.member_code} - {member.first_name} {member.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Amount
                <input
                  required
                  type="number"
                  min="1"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </label>
              <label>
                Method
                <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </label>
              <label>
                Paid On
                <input
                  type="date"
                  value={paymentForm.paidOn}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paidOn: e.target.value })}
                />
              </label>
              <label>
                Reference
                <input value={paymentForm.reference} onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })} />
              </label>
              <label>
                Notes
                <textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} />
              </label>
              {currentMember && (
                <p className="inline-note">
                  Recording for {currentMember.member_code}, current plan: {currentMember.plan_name || 'none'}.
                </p>
              )}
              <button type="submit">Record and Generate Receipt</button>
            </form>

            <Receipt receipt={receipt} />
          </section>
        )}

        {activeTab === 'checkin' && (
          <section className="panel compact">
            <form className="checkin-form" onSubmit={submitCheckin}>
              <h2>Check-in Validation</h2>
              <p className="muted">Enter member code or phone number to validate active membership.</p>
              <div>
                <input
                  autoFocus
                  value={checkinCode}
                  onChange={(e) => setCheckinCode(e.target.value)}
                  placeholder="M001 or phone number"
                  required
                />
                <button type="submit">Validate</button>
              </div>
            </form>
            {checkinResult && (
              <div className={checkinResult.status === 'valid' ? 'checkin-result good' : 'checkin-result bad'}>
                <strong>{checkinResult.status === 'valid' ? 'Access Approved' : 'Access Blocked'}</strong>
                <span>{checkinResult.message}</span>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function titleFor(tab) {
  return {
    dashboard: 'Dashboard',
    members: 'Member Registration',
    plans: 'Membership Plans',
    memberships: 'Assign Membership',
    payments: 'Payment Recording',
    checkin: 'Check-in Desk',
  }[tab];
}

function Metric({ label, value }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No records yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Receipt({ receipt }) {
  if (!receipt) {
    return (
      <div className="panel receipt empty">
        <h2>Receipt Preview</h2>
        <p className="muted">The latest receipt appears here after payment is recorded.</p>
      </div>
    );
  }

  return (
    <div className="panel receipt">
      <div className="receipt-head">
        <div>
          <p className="eyebrow">Receipt</p>
          <h2>{receipt.invoice_number}</h2>
        </div>
        <button type="button" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <div className="receipt-lines">
        <span>Member</span>
        <strong>
          {receipt.member_name} ({receipt.member_code})
        </strong>
        <span>Plan</span>
        <strong>{receipt.plan_name || 'General payment'}</strong>
        <span>Membership Dates</span>
        <strong>
          {receipt.start_date || '-'} to {receipt.end_date || '-'}
        </strong>
        <span>Method</span>
        <strong>{receipt.method}</strong>
        <span>Paid On</span>
        <strong>{receipt.paid_on}</strong>
        <span>Total Paid</span>
        <strong>{money(receipt.amount)}</strong>
      </div>
      <p className="muted">Excel Fit Gym, Taliparamba. Thank you for your payment.</p>
    </div>
  );
}

export default App;
