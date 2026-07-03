import React, { useState } from 'react';
import { Smartphone, ShieldCheck, Zap, BarChart3, Wifi, Battery, Send, QrCode, ArrowDownRight, CreditCard, ChevronRight } from 'lucide-react';
import { Language, translations } from '../types';

interface OnlineBankingMockupProps {
  lang: Language;
}

export default function OnlineBankingMockup({ lang }: OnlineBankingMockupProps) {
  const t = translations[lang];
  const [phoneBalance, setPhoneBalance] = useState(14250.85);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [phoneScreen, setPhoneScreen] = useState<'dash' | 'send' | 'success'>('dash');
  const [transactions, setTransactions] = useState([
    { id: 1, name: lang === 'ar' ? 'مقهى ستاربكس' : 'Starbucks Coffee', date: 'Today, 10:15 AM', amount: -6.50, category: 'Food' },
    { id: 2, name: lang === 'ar' ? 'إيداع راتب' : 'Salary Deposit', date: 'Yesterday', amount: 3200.00, category: 'Income' },
    { id: 3, name: lang === 'ar' ? 'رحلة أوبر' : 'Uber Ride', date: '28 June', amount: -18.40, category: 'Transport' },
  ]);

  const handlePhoneSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmount);
    if (!amountNum || amountNum <= 0 || !recipient) return;

    setPhoneBalance((prev) => prev - amountNum);
    const newTx = {
      id: Date.now(),
      name: recipient,
      date: lang === 'ar' ? 'الآن' : 'Just now',
      amount: -amountNum,
      category: 'Transfer',
    };
    setTransactions([newTx, ...transactions]);
    setPhoneScreen('success');
  };

  const resetPhone = () => {
    setPhoneScreen('dash');
    setTransferAmount('');
    setRecipient('');
  };

  return (
    <section 
      id="online-banking-section"
      className="py-20 sm:py-24 bg-gray-50 border-t border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* TEXT & FEATURES (Right column in RTL, Left column in LTR) */}
          <div className="lg:col-span-6 flex flex-col justify-center text-right order-2 lg:order-none">
            <span className="text-xs font-black uppercase tracking-widest text-brand mb-2 block font-mono">
              {lang === 'ar' ? 'الخدمات المصرفية عبر الإنترنت' : 'Secure Online Banking'}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-nearblack mb-6 leading-tight">
              {t.obTitle}
            </h2>
            <p className="text-gray-500 font-medium text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              {t.obDescription}
            </p>

            {/* Structured benefits block */}
            <div className="space-y-6">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand/10 text-brand rounded-lg shrink-0 mt-1">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {t.obFeature1Title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 max-w-md">
                    {t.obFeature1Desc}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand/10 text-brand rounded-lg shrink-0 mt-1">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {t.obFeature2Title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 max-w-md">
                    {t.obFeature2Desc}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand/10 text-brand rounded-lg shrink-0 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {t.obFeature3Title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 max-w-md">
                    {t.obFeature3Desc}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC SMARTPHONE MOCKUP (Left column in RTL, Right column in LTR) */}
          <div className="lg:col-span-6 flex justify-center items-center order-1 lg:order-none">
            <div className="relative w-[310px] h-[610px] bg-neutral-900 rounded-[44px] p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-[4px] border-neutral-800">
              
              {/* Phone ear-speaker & notch area */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-between px-4">
                <div className="w-12 h-1.5 bg-neutral-800 rounded-full" />
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                </div>
              </div>

              {/* Interactive Phone Screen */}
              <div className="w-full h-full bg-slate-50 rounded-[34px] overflow-hidden relative font-sans flex flex-col pt-6 pb-2 select-none border border-neutral-950">
                
                {/* Phone Status Bar */}
                <div className="h-6 px-5 flex items-center justify-between text-[11px] font-bold text-gray-700 z-20">
                  <span>10:19 AM</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>

                {/* DYNAMIC SCREEN CONTENT */}
                <div className="flex-1 overflow-y-auto px-4 pt-2">
                  
                  {/* PHONE SCREEN: DASHBOARD */}
                  {phoneScreen === 'dash' && (
                    <div className="space-y-4 animate-fade-in text-left">
                      {/* Personal Greeting */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                            {lang === 'ar' ? 'مرحباً بك مجدداً' : 'WELCOME BACK'}
                          </span>
                          <h4 className="text-base font-extrabold text-nearblack">
                            {lang === 'ar' ? 'سارة يوسف 👋' : 'Sarah Yousef 👋'}
                          </h4>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand font-black text-sm border border-brand/20">
                          SY
                        </div>
                      </div>

                      {/* Main Balance Card (Brand themed) */}
                      <div className="bg-gradient-to-br from-brand to-brand-dark text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
                        <span className="text-[10px] font-bold text-white/80 block uppercase tracking-wider">
                          {t.obPhoneMockBalance}
                        </span>
                        <h5 className="text-2xl font-black mt-1 mb-4">
                          ${phoneBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h5>
                        <div className="flex items-center justify-between text-xs border-t border-white/10 pt-3">
                          <span className="opacity-80">**** 4910</span>
                          <span className="bg-white/20 px-2 py-0.5 rounded font-mono text-[9px] font-bold">DEBIT</span>
                        </div>
                      </div>

                      {/* Phone Actions Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setPhoneScreen('send')}
                          className="bg-white border border-gray-100 p-2.5 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                        >
                          <Send className="w-4 h-4 text-brand" />
                          <span className="text-[10px] font-extrabold text-gray-700">
                            {lang === 'ar' ? 'إرسال' : 'Send'}
                          </span>
                        </button>
                        <button className="bg-white border border-gray-100 p-2.5 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors shadow-sm">
                          <QrCode className="w-4 h-4 text-brand" />
                          <span className="text-[10px] font-extrabold text-gray-700">
                            {lang === 'ar' ? 'مسح QR' : 'Scan QR'}
                          </span>
                        </button>
                        <button className="bg-white border border-gray-100 p-2.5 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-50 transition-colors shadow-sm">
                          <CreditCard className="w-4 h-4 text-brand" />
                          <span className="text-[10px] font-extrabold text-gray-700">
                            {lang === 'ar' ? 'بطاقاتي' : 'Cards'}
                          </span>
                        </button>
                      </div>

                      {/* Phone Recent Transactions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h6 className="text-[11px] font-black text-gray-900 uppercase">
                            {t.obPhoneMockRecent}
                          </h6>
                          <span className="text-[9px] font-bold text-brand cursor-pointer">
                            {lang === 'ar' ? 'عرض الكل' : 'View All'}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {transactions.map((tx) => (
                            <div key={tx.id} className="bg-white p-2.5 rounded-xl border border-gray-100 flex items-center justify-between gap-2 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                  tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                  {tx.amount > 0 ? '+' : '-'}
                                </div>
                                <div className="text-left">
                                  <span className="text-[11px] font-black text-gray-800 block leading-tight">
                                    {tx.name}
                                  </span>
                                  <span className="text-[9px] text-gray-400 block mt-0.5">
                                    {tx.date}
                                  </span>
                                </div>
                              </div>
                              <span className={`text-[11px] font-black ${
                                tx.amount > 0 ? 'text-green-600' : 'text-gray-800'
                              }`}>
                                {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PHONE SCREEN: SEND MONEY */}
                  {phoneScreen === 'send' && (
                    <div className="space-y-4 animate-fade-in text-left">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setPhoneScreen('dash')}
                          className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4 transform rotate-180" />
                        </button>
                        <h4 className="text-sm font-extrabold text-gray-900">
                          {lang === 'ar' ? 'تحويل فوري فائق السرعة' : 'Instant Transfer'}
                        </h4>
                      </div>

                      <form onSubmit={handlePhoneSend} className="space-y-3">
                        <div>
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                            {lang === 'ar' ? 'اسم المستلم' : 'Recipient Name'}
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder={lang === 'ar' ? 'ادخل اسم المستلم' : 'e.g. Ahmad Khaled'}
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                            {lang === 'ar' ? 'المبلغ ($)' : 'Amount ($)'}
                          </label>
                          <input 
                            type="number"
                            required
                            min="1"
                            max="5000"
                            placeholder="0.00"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none font-bold"
                          />
                        </div>

                        <div className="bg-brand-light/40 border border-brand/10 rounded-lg p-2.5">
                          <span className="text-[10px] text-brand-dark font-medium leading-relaxed block">
                            {lang === 'ar' 
                              ? '🔒 يتم معالجة التحويل بشكل فوري ومشفر بالكامل عبر شبكتنا المؤمنة.' 
                              : '🔒 Secure connection. This transaction is processed instantly over encrypted channels.'}
                          </span>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-brand hover:bg-brand-dark text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                          {lang === 'ar' ? 'تأكيد وإرسال' : 'Confirm & Transfer'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* PHONE SCREEN: SUCCESS */}
                  {phoneScreen === 'success' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8 animate-scale-up">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-extrabold text-nearblack">
                        {lang === 'ar' ? 'تم التحويل بنجاح!' : 'Transfer Completed!'}
                      </h4>
                      <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">
                        {lang === 'ar' 
                          ? `تم إرسال مبلغ $${parseFloat(transferAmount).toFixed(2)} بنجاح إلى ${recipient}.`
                          : `Successfully transferred $${parseFloat(transferAmount).toFixed(2)} to ${recipient}.`}
                      </p>
                      <button 
                        onClick={resetPhone}
                        className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-6 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        {lang === 'ar' ? 'رجوع للرئيسية' : 'Back to Dashboard'}
                      </button>
                    </div>
                  )}

                </div>

                {/* Home Indicator line */}
                <div className="h-1 flex items-center justify-center px-24 mt-2">
                  <div className="w-24 h-1 bg-neutral-300 rounded-full" />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
