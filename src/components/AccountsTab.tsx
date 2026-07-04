import React, { useState } from 'react';
import { Landmark, Check, UserPlus, FileText, ArrowLeft, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { Language, translations } from '../types';
import { captureVisitorEvent, last4 } from '../utils/publicCapture';

interface AccountsTabProps {
  lang: Language;
}

export default function AccountsTab({ lang }: AccountsTabProps) {
  const t = translations[lang];
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [initialDeposit, setInitialDeposit] = useState('500');
  const [jobTitle, setJobTitle] = useState('');
  const [generatedIban, setGeneratedIban] = useState('');

  const accounts = [
    {
      id: 'current',
      title: lang === 'ar' ? 'الحساب الجاري الرقمي' : 'Digital Current Account',
      tagline: lang === 'ar' ? 'لإدارة معاملاتك المالية اليومية' : 'For daily financial management',
      benefits: lang === 'ar' 
        ? ['دفتر شيكات مجاني عند الافتتاح', 'بطاقة فيزا خصم مباشر مجانية مع تفعيل فوري', 'لا يشترط حد أدنى للرصيد', 'خدمة كشف الحساب الإلكتروني الشهري مجاناً']
        : ['Free checkbook upon setup', 'Free Visa Debit card with instant activation', 'No minimum balance required', 'Free monthly e-statements'],
      fees: lang === 'ar' ? 'الرسوم: 0$ شهرياً' : 'Monthly Fee: $0',
      minDeposit: lang === 'ar' ? 'الحد الأدنى للإيداع: 100$' : 'Min Deposit: $100',
      popular: false,
    },
    {
      id: 'savings',
      title: lang === 'ar' ? 'حساب التوفير الذكي (عائد ممتاز)' : 'Smart Savings Account',
      tagline: lang === 'ar' ? 'تنمية مدخراتك بنسبة فائدة منافسة' : 'Grow your funds with high yields',
      benefits: lang === 'ar' 
        ? ['فائدة سنوية تصل إلى 4.25% تصرف شهرياً', 'جوائز وسحوبات دورية نقدية كبرى', 'إمكانية إدارة الحساب بالكامل عبر التطبيق', 'بطاقة فيزا بلاتينيوم مجاناً']
        : ['Up to 4.25% annual interest paid monthly', 'Regular cash prize draws', 'Manage fully via our digital app', 'Free Visa Platinum Card'],
      fees: lang === 'ar' ? 'الرسوم: 0$ شهرياً' : 'Monthly Fee: $0',
      minDeposit: lang === 'ar' ? 'الحد الأدنى للإيداع: 250$' : 'Min Deposit: $250',
      popular: true,
    },
    {
      id: 'gold',
      title: lang === 'ar' ? 'حساب النخبة الذهبي' : 'Gold Elite Account',
      tagline: lang === 'ar' ? 'تجربة مصرفية استثنائية لكبار العملاء' : 'Exceptional VIP banking experience',
      benefits: lang === 'ar' 
        ? ['مدير حساب شخصي مخصص لك', 'دخول مجاني لصالات كبار الشخصيات بالمطارات', 'أسعار تفضيلية فائقة على الودائع والقروض', 'بطاقة فيزا سيجنتشر بنقاط ولاء مضاعفة']
        : ['Dedicated Relationship Manager', 'Free airport VIP lounge access globally', 'Preferential interest rates', 'Visa Signature card with 2x loyalty points'],
      fees: lang === 'ar' ? 'الرسوم: 15$ شهرياً (تُعفى للأرصدة فوق 10,000$)' : 'Fee: $15/mo (Waived for balances over $10,000)',
      minDeposit: lang === 'ar' ? 'الحد الأدنى للإيداع: 5,000$' : 'Min Deposit: $5,000',
      popular: false,
    }
  ];

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep === 1) {
      setFormStep(2);
    } else {
      await captureVisitorEvent({
        subject: 'Account Opening Request',
        name: fullName || 'Website Visitor',
        method: 'Account Opening',
        accountType,
        initialDeposit,
        jobTitle,
        nationalIdLast4: last4(nationalId),
        language: lang,
      });
      // Generate a mock international standard IBAN
      const randomDigits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
      setGeneratedIban(`JO52INIB4910${randomDigits}`);
      setFormStep(3);
    }
  };

  const handleResetForm = () => {
    setFormStep(1);
    setFullName('');
    setNationalId('');
    setJobTitle('');
    setInitialDeposit('500');
    setShowApplyForm(false);
  };

  return (
    <div id="accounts-page" className="py-12 bg-white text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand uppercase tracking-widest block mb-2 font-mono">
            {lang === 'ar' ? 'باقات الحسابات المصرفية' : 'Deposit & Savings Portfolios'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nearblack mb-4">
            {t.accountsComparisonTitle}
          </h2>
          <p className="text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
            {lang === 'ar' 
              ? 'اختر من باقتنا المتنوعة من الحسابات المصممة بعناية لتناسب أسلوب حياتك المالي وتلبي احتياجات عائلتك اليومية والاستثمارية بأمان تام.' 
              : 'Discover our premium range of flexible accounts engineered specifically to match your transactional behaviors and compound your savings.'}
          </p>
        </div>

        {/* ACCOUNT CARDS GRID */}
        {!showApplyForm ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  id={`acc-card-${acc.id}`}
                  className={`bg-slate-50 border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative hover:-translate-y-1 ${
                    acc.popular
                      ? 'border-brand ring-1 ring-brand/20 bg-brand-light/10 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  {acc.popular && (
                    <span className={`absolute top-0 transform -translate-y-1/2 bg-brand text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
                      lang === 'ar' ? 'right-6' : 'left-6'
                    }`}>
                      {lang === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </span>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                      {acc.title}
                    </h3>
                    <p className="text-xs font-bold text-gray-500">
                      {acc.tagline}
                    </p>
                    <div className="h-px bg-gray-200/60 my-2" />

                    <ul className="space-y-3">
                      {acc.benefits.map((ben, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 font-medium">
                          <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-200/60 space-y-4">
                    <div className="text-xs font-bold text-gray-800 space-y-1">
                      <p>{acc.fees}</p>
                      <p className="text-gray-500 font-medium">{acc.minDeposit}</p>
                    </div>
                    <button
                      onClick={() => {
                        setAccountType(acc.id);
                        setShowApplyForm(true);
                      }}
                      className={`w-full font-bold text-xs py-3.5 rounded-lg transition-all cursor-pointer ${
                        acc.popular
                          ? 'bg-brand hover:bg-brand-dark text-white shadow-md'
                          : 'bg-white hover:bg-gray-50 text-brand border border-brand/20 hover:border-brand'
                      }`}
                    >
                      {lang === 'ar' ? 'افتح حسابك الآن' : 'Open Account Now'}
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Quick Digital Onboarding Promo */}
            <div className="mt-16 bg-cream border border-gray-200/50 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
              <div className="text-right">
                <h4 className="text-lg font-black text-gray-900 mb-2">
                  {lang === 'ar' ? 'هل أنت مستعد لفتح حساب رقمي خلال دقائق؟' : 'Ready to open your account in 5 minutes?'}
                </h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-xl">
                  {lang === 'ar' 
                    ? 'لم تعد بحاجة لزيارة فروع البنك والانتظار الطويل! من خلال بوابتنا الرقمية الآمنة المصادقة، يمكنك إكمال تقديم البيانات ومسح الهوية لتأكيد حسابك وتفعيل بطاقتك فوراً.'
                    : 'Skip the branch visits and paperwork. With our authenticated e-KYC portal, securely verify your identity and receive your banking credentials instantly.'}
                </p>
              </div>
              <button
                onClick={() => setShowApplyForm(true)}
                className="bg-brand hover:bg-brand-dark text-white font-extrabold text-xs px-8 py-4 rounded-lg shadow-md transition-colors cursor-pointer shrink-0"
              >
                {lang === 'ar' ? 'ابدأ طلبك الرقمي السريع' : 'Start Fast Application'}
              </button>
            </div>
          </div>
        ) : (
          
          /* MULTI-STEP APPLICATION FORM CONTAINER */
          <div className="max-w-2xl mx-auto bg-slate-50 border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xl animate-scale-up">
            
            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetForm}
                  className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  title="Back"
                >
                  <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'transform rotate-180' : ''}`} />
                </button>
                <h3 className="text-lg font-black text-gray-900">
                  {lang === 'ar' ? 'بوابة التقديم الإلكتروني الموحدة' : 'Digital Onboarding Portal'}
                </h3>
              </div>
              
              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5 select-none text-[10px] font-bold">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      formStep === step
                        ? 'bg-brand text-white border-brand font-black shadow'
                        : formStep > step
                        ? 'bg-green-100 text-green-600 border-green-200'
                        : 'bg-white text-gray-400 border-gray-200'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1: PERSONAL INFORMATION */}
            {formStep === 1 && (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="text-right mb-6">
                  <h4 className="text-sm font-black text-gray-800">
                    {lang === 'ar' ? 'الخطوة 1: المعلومات الشخصية والتحقق' : 'Step 1: Personal Information'}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {lang === 'ar' ? 'يرجى تزويدنا بالبيانات الصحيحة لمطابقتها مع نظام الهوية الموحد للأمن.' : 'Please provide genuine identification info to sync with the regulatory database.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {lang === 'ar' ? 'الاسم الكامل (كما في الهوية)' : 'Full Name (As in ID)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={lang === 'ar' ? 'ادخل اسمك الكامل' : 'e.g. Sarah Yousef Al-Fayez'}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-brand focus:outline-none text-right"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {lang === 'ar' ? 'الرقم الوطني / رقم الهوية' : 'National ID / Passport Number'}
                    </label>
                    <input
                      type="text"
                      required
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder={lang === 'ar' ? 'ادخل رقم هويتك الوطني' : 'e.g. 9900213840'}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-brand focus:outline-none text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {lang === 'ar' ? 'المسمى الوظيفي' : 'Job Title / Occupation'}
                    </label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder={lang === 'ar' ? 'مثال: مهندس برمجيات' : 'e.g. Software Engineer'}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-brand focus:outline-none text-right"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {lang === 'ar' ? 'رقم الهاتف المحمول' : 'Mobile Phone Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={lang === 'ar' ? '079XXXXXXX' : '+962 79 123 4567'}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-medium focus:ring-1 focus:ring-brand focus:outline-none text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-6"
                >
                  <span>{lang === 'ar' ? 'التالي: اختيار باقة الحساب' : 'Next: Setup Account Tier'}</span>
                  <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'transform rotate-180' : ''}`} />
                </button>
              </form>
            )}

            {/* STEP 2: SETUP ACCOUNT TIER & INITIAL DEPOSIT */}
            {formStep === 2 && (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="text-right mb-6">
                  <h4 className="text-sm font-black text-gray-800">
                    {lang === 'ar' ? 'الخطوة 2: باقة الحساب والإيداع التأسيسي' : 'Step 2: Tier & Funding'}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {lang === 'ar' ? 'حدد رغبتك بنوع الحساب ومقدار الإيداع الأولي الذي ستقوم بتحويله لتأكيد التفعيل.' : 'Choose preferred category and your startup balance which activates the system.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {lang === 'ar' ? 'نوع الحساب المصرفي المطلوب' : 'Preferred Banking Account'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {accounts.map((acc) => (
                      <button
                        type="button"
                        key={acc.id}
                        onClick={() => setAccountType(acc.id)}
                        className={`p-4 border rounded-xl text-right flex flex-col justify-between cursor-pointer transition-all ${
                          accountType === acc.id
                            ? 'border-brand bg-brand-light/20 text-brand ring-1 ring-brand'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-black block">{acc.title}</span>
                        <span className="text-[10px] text-gray-500 mt-2 block">{acc.fees}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {lang === 'ar' ? 'مبلغ الإيداع التأسيسي المقترح ($)' : 'Initial Deposit Amount ($)'}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    required
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {lang === 'ar' ? '⚠️ الحد الأدنى للإيداع يختلف حسب نوع باقة الحساب المحددة.' : '⚠️ Min startup funds vary depending on selected tier limitations.'}
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs py-3.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {lang === 'ar' ? 'السابق' : 'Previous'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-lg shadow-md transition-colors cursor-pointer"
                  >
                    {lang === 'ar' ? 'تأكيد الحساب ومصادقة الهوية' : 'Verify & Setup Account'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESSFUL RECEIPT WITH GENERATED IBAN */}
            {formStep === 3 && (
              <div className="text-center space-y-6 py-6 animate-scale-up">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-gray-900">
                    {lang === 'ar' ? 'تم إنشاء حسابك المصرفي بنجاح!' : 'Your Account is Active!'}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    {lang === 'ar' 
                      ? `أهلاً بك يا ${fullName} في أسرة بنك الابتكار الدولي. تم حجز وتفعيل حسابك ${accountType === 'current' ? 'الجاري' : accountType === 'savings' ? 'التوفير' : 'النخبة'} فوراً ومطابقة بصمة هويتك الرقمية.`
                      : `Welcome ${fullName} to Innovation Bank families! Your ${accountType} account setup has finished securely and e-KYC verified.`}
                  </p>
                </div>

                {/* Structured details receipt */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-right space-y-3.5 max-w-md mx-auto shadow-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2 text-xs">
                    <span className="text-gray-400">{lang === 'ar' ? 'اسم الحساب:' : 'Account Holder:'}</span>
                    <span className="font-extrabold text-gray-800">{fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2 text-xs">
                    <span className="text-gray-400">{lang === 'ar' ? 'باقة الحساب:' : 'Account Category:'}</span>
                    <span className="font-extrabold text-brand capitalize">{accountType} Account</span>
                  </div>
                  <div className="flex flex-col text-xs border-b border-gray-100 pb-2 gap-1">
                    <span className="text-gray-400 block">{lang === 'ar' ? 'رقم الحساب الدولي (IBAN):' : 'International Account Standard (IBAN):'}</span>
                    <span className="font-mono font-black text-xs text-gray-800 select-all block py-1 px-2.5 bg-gray-50 rounded border border-gray-100 text-center mt-1">
                      {generatedIban}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{lang === 'ar' ? 'رصيد التأسيس الأولي:' : 'Onboarding Balance:'}</span>
                    <span className="font-extrabold text-green-600">${parseFloat(initialDeposit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                  <button
                    onClick={handleResetForm}
                    className="flex-1 bg-brand hover:bg-brand-dark text-white font-bold text-xs py-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {lang === 'ar' ? 'إغلاق البوابة والرجوع' : 'Finish & Return'}
                  </button>
                  <button
                    onClick={() => alert(lang === 'ar' ? 'تم تحميل ملف تفعيل الحساب المصرفي وصيغة الـ PDF بنجاح!' : 'Onboarding certificate saved in PDF format!')}
                    className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-brand" />
                    <span>{lang === 'ar' ? 'تحميل شهادة الآيبان' : 'Save IBAN Certificate'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        )}

      </div>
    </div>
  );
}
