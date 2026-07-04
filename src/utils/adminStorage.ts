export type AdminPage = 'dashboard' | 'products' | 'news' | 'campaigns' | 'branches' | 'messages' | 'loans' | 'cards' | 'users' | 'settings' | 'profile';
export type AdminRow = Record<string, string>;

export const ADMIN_STORAGE_KEY = 'bank_admin_static_data_v2';

const baseDb: Record<AdminPage, AdminRow[]> = {
  dashboard: [],
  products: [
    { name:'Palestine Current Account', category:'Accounts', status:'active', featured:'Yes', updated:'2026-07-03' },
    { name:'Visa Signature Card', category:'Cards', status:'active', featured:'No', updated:'2026-07-02' },
    { name:'Personal Loan', category:'Loans', status:'draft', featured:'Yes', updated:'2026-06-28' }
  ],
  news: [
    { title:'New digital banking services launched', category:'Bank News', status:'active', date:'2026-07-01' },
    { title:'Holiday working hours announcement', category:'Announcements', status:'draft', date:'2026-06-25' }
  ],
  campaigns: [
    { title:'Summer Cards Campaign', type:'Cards', status:'active', start:'2026-07-01', end:'2026-08-31' },
    { title:'Youth Account Offer', type:'Accounts', status:'pending', start:'2026-06-15', end:'2026-07-30' }
  ],
  branches: [
    { name:'Amman Main Branch', city:'Amman', phone:'+962 6 000 0000', status:'active' },
    { name:'Irbid Branch', city:'Irbid', phone:'+962 2 000 0000', status:'active' },
    { name:'Aqaba Branch', city:'Aqaba', phone:'+962 3 000 0000', status:'inactive' }
  ],
  messages: [
    { name:'Ahmad Saleh', email:'ahmad@example.com', subject:'Account question', status:'pending', date:'2026-07-04' },
    { name:'Lana Omar', email:'lana@example.com', subject:'Card support', status:'approved', date:'2026-07-03' }
  ],
  loans: [
    { name:'Khaled Naser', product:'Personal Loan', amount:'12,000 JOD', status:'pending', date:'2026-07-04' },
    { name:'Maya Ali', product:'Car Loan', amount:'18,500 JOD', status:'approved', date:'2026-07-01' }
  ],
  cards: [
    { name:'Sara Mahmoud', card:'Visa Gold', income:'900 JOD', status:'pending', date:'2026-07-04' },
    { name:'Omar Yassin', card:'Mastercard Platinum', income:'1,700 JOD', status:'rejected', date:'2026-06-29' }
  ],
  users: [
    { name:'Admin User', email:'admin@bank.com', role:'ADMIN', status:'active', method:'Admin Login' },
    { name:'Content Editor', email:'editor@bank.com', role:'EDITOR', status:'active', method:'Manual' }
  ],
  settings: [],
  profile: []
};

export function todayString() { return new Date().toISOString().slice(0, 10); }

export function maskValue(value: string, visible = 4) {
  const clean = String(value || '').replace(/\s+/g, '');
  if (!clean) return '';
  if (clean.length <= visible) return '*'.repeat(clean.length);
  return `${'*'.repeat(Math.max(0, clean.length - visible))}${clean.slice(-visible)}`;
}

export function getAdminDb(): Record<AdminPage, AdminRow[]> {
  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || 'null');
    return { ...baseDb, ...(parsed || {}) };
  } catch { return JSON.parse(JSON.stringify(baseDb)); }
}

export function saveAdminDb(db: Record<AdminPage, AdminRow[]>) { localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(db)); }

export function appendAdminRow(page: AdminPage, row: AdminRow) {
  const db = getAdminDb();
  const safeRow = { date: todayString(), status: 'pending', ...row };
  db[page] = [safeRow, ...(db[page] || [])];
  saveAdminDb(db);
}

export function recordVisitorUser(row: AdminRow) { appendAdminRow('users', { role: 'VISITOR', ...row }); }
