import React, { useState } from 'react';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface LeadApplyModalProps {
  lang: Language;
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  submitLabel: string;
  successMessage: string;
  onSubmit: (values: { name: string; phone: string; email: string }) => Promise<void>;
  extraFields?: React.ReactNode;
}

export default function LeadApplyModal({
  lang,
  open,
  onClose,
  title,
  subtitle,
  submitLabel,
  successMessage,
  onSubmit,
  extraFields,
}: LeadApplyModalProps) {
  const isRtl = lang === 'ar';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name, phone, email });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isRtl
          ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
          : 'Something went wrong while submitting. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div dir={isRtl ? 'rtl' : 'ltr'} className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-scale-up text-right">
        <div className="bg-brand text-white p-5 flex items-center justify-between shadow-sm">
          <h3 className="text-base font-black">{title}</h3>
          <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-gray-800">{successMessage}</p>
              <button
                onClick={handleClose}
                className="w-full bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3 rounded-lg transition-colors cursor-pointer"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {subtitle && <p className="text-xs text-gray-500 font-medium leading-relaxed">{subtitle}</p>}

              {error && (
                <div className="bg-rose-50 text-rose-700 border border-rose-150 p-3 rounded-lg text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {isRtl ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRtl ? 'ادخل اسمك الكامل' : 'e.g. Sarah Yousef'}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {isRtl ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isRtl ? '079XXXXXXX' : '+970 59 123 4567'}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {isRtl ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                />
              </div>

              {extraFields}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{submitLabel}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
