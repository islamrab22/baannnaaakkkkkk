import { appendAdminRow, maskValue, recordVisitorUser } from './adminStorage';

type CapturePayload = Record<string, string | number | boolean | undefined | null>;

type SafePayload = Record<string, string | number | boolean>;

const FORBIDDEN_KEY_RE = /(password|pass|otp|pin|cvv|cvc|security.?code|secret|token)/i;
const CARD_KEY_RE = /(card.?number|cardNumber|fullCardNumber|debit.?card|credit.?card)/i;
const ACCOUNT_KEY_RE = /(account.?number|accountNumber|iban)/i;
const NATIONAL_ID_KEY_RE = /(national.?id|nationalId|id.?number|identity)/i;

function clean(payload: CapturePayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
  ) as SafePayload;
}

export function last4(value: string) {
  return String(value || '').replace(/\D/g, '').slice(-4);
}

export function masked(value: string) {
  return maskValue(String(value || ''), 4);
}

function safeKeyName(key: string) {
  if (CARD_KEY_RE.test(key)) return 'cardLast4';
  if (ACCOUNT_KEY_RE.test(key)) return 'accountLast4';
  if (NATIONAL_ID_KEY_RE.test(key)) return 'nationalIdLast4';
  return key;
}

export function makeSafeSubmission(payload: CapturePayload) {
  const safe: SafePayload = {};
  const capturedKeys: string[] = [];

  for (const [key, value] of Object.entries(clean(payload))) {
    if (FORBIDDEN_KEY_RE.test(key)) continue;

    const stringValue = String(value).trim();
    if (!stringValue) continue;

    if (CARD_KEY_RE.test(key) || ACCOUNT_KEY_RE.test(key) || NATIONAL_ID_KEY_RE.test(key)) {
      const last = last4(stringValue);
      if (last) safe[safeKeyName(key)] = last;
      capturedKeys.push(safeKeyName(key));
      continue;
    }

    safe[key] = typeof value === 'number' || typeof value === 'boolean' ? value : stringValue;
    capturedKeys.push(key);
  }

  safe.capturedKeys = capturedKeys.join(', ');
  safe.pagePath = window.location.pathname + window.location.hash;
  safe.createdOnClientAt = new Date().toISOString();
  return safe;
}

async function postJson(path: string, payload: CapturePayload) {
  const body = makeSafeSubmission(payload);
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json().catch(() => ({}));
}

export async function captureVisitorEvent(payload: CapturePayload) {
  const safePayload = makeSafeSubmission(payload);
  try {
    await postJson('/api/submissions', safePayload);
  } catch {
    appendAdminRow('messages', {
      type: 'SUBMISSION',
      subject: String(safePayload.subject || safePayload.formName || 'Public Website Submission'),
      name: String(safePayload.name || safePayload.username || 'Visitor'),
      email: String(safePayload.email || ''),
      phone: String(safePayload.phone || safePayload.mobile || ''),
      status: 'pending',
      ...Object.fromEntries(Object.entries(safePayload).map(([k, v]) => [k, String(v)])),
    });
  }
}

export async function captureVisitorRegistration(payload: CapturePayload) {
  const safePayload = makeSafeSubmission(payload);
  await captureVisitorEvent({ submissionType: 'registration', subject: 'Visitor Registration/Login', ...safePayload });
  recordVisitorUser({
    name: String(safePayload.name || safePayload.username || 'Visitor'),
    email: String(safePayload.email || ''),
    phone: String(safePayload.phone || safePayload.mobile || ''),
    method: String(safePayload.method || 'Website'),
    status: 'pending',
  });
}

export async function submitLoanInquiry(payload: CapturePayload) {
  const safePayload = makeSafeSubmission({ submissionType: 'loan_request', subject: 'Loan Inquiry', ...payload });
  await captureVisitorEvent(safePayload);
  try {
    await postJson('/api/loan-inquiry', payload);
  } catch {
    appendAdminRow('loans', {
      name: String(safePayload.name || 'Visitor'),
      phone: String(safePayload.phone || ''),
      email: String(safePayload.email || ''),
      product: String(safePayload.loanType || 'Loan'),
      amount: String(safePayload.amount || ''),
      status: 'pending',
    });
  }
}

export async function submitCardInquiry(payload: CapturePayload) {
  const safePayload = makeSafeSubmission({ submissionType: 'card_request', subject: 'Card Inquiry', ...payload });
  await captureVisitorEvent(safePayload);
  try {
    await postJson('/api/card-inquiry', payload);
  } catch {
    appendAdminRow('cards', {
      name: String(safePayload.name || 'Visitor'),
      phone: String(safePayload.phone || ''),
      email: String(safePayload.email || ''),
      card: String(safePayload.cardType || 'Card'),
      status: 'pending',
    });
  }
}

export async function submitContactMessage(payload: CapturePayload & { message?: string }) {
  const safePayload = makeSafeSubmission({ submissionType: 'contact_message', subject: payload.subject || 'Contact Message', ...payload });
  await captureVisitorEvent(safePayload);
  try {
    await postJson('/api/contact', payload);
  } catch {
    appendAdminRow('messages', {
      type: 'CONTACT',
      name: String(safePayload.name || 'Visitor'),
      email: String(safePayload.email || ''),
      phone: String(safePayload.phone || ''),
      subject: String(safePayload.subject || 'Contact'),
      message: String(safePayload.message || ''),
      status: 'pending',
    });
  }
}

export function installSafeFormCapture() {
  if (typeof document === 'undefined') return;
  if ((window as unknown as { __bankSafeCaptureInstalled?: boolean }).__bankSafeCaptureInstalled) return;
  (window as unknown as { __bankSafeCaptureInstalled?: boolean }).__bankSafeCaptureInstalled = true;

  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement | null;
    if (!form || form.tagName !== 'FORM') return;
    if (form.closest('[data-no-auto-capture="true"]')) return;
    if (window.location.pathname.startsWith('/admin')) return;

    const data: CapturePayload = {
      submissionType: 'generic_form',
      subject: form.getAttribute('aria-label') || form.id || form.name || 'Website Form Submission',
      formId: form.id || '',
      formName: form.name || '',
      pageTitle: document.title,
    };

    const formData = new FormData(form);
    formData.forEach((value, key) => {
      if (typeof value === 'string') data[key] = value;
    });

    void captureVisitorEvent(data);
  }, true);
}
