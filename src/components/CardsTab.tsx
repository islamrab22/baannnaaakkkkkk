import { useState } from 'react';
import { CreditCard, Check, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';
import { Language, translations } from '../types';
import { submitCardInquiry } from '../utils/publicCapture';

interface CardsTabProps {
  lang: Language;
}

export default function CardsTab({ lang }: CardsTabProps) {
  const t = translations[lang];
  const [selectedCard, setSelectedCard] = useState<'platinum' | 'signature' | 'elite'>('platinum');
  const [isApplied, setIsApplied] = useState(false);

  const cardsData = {
    platinum: {
      name: lang === 'ar' ? 'بطاقة فيزا بلاتينيوم الائتمانية' : 'Visa Platinum Credit Card',
      gradient: 'from-slate-400 via-slate-500 to-zinc-600',
      textColor: 'text-white',
      chipColor: 'bg-zinc-300',
      number: '4910 8821 0049 3120',
      holder: lang === 'ar' ? 'سارة يوسف الفايز' : 'SARAH Y. AL-FAYEZ',
      expiry: '09/31',
      cashback: '1.5%',
      creditLimit: '$5,000 - $15,000',
      annualFee: '$50 (Waived for 1st year)',
      benefits: lang === 'ar' 
        ? ['استرداد نقدي فوري بنسبة 1.5% على كافة المشتريات', 'تأمين سفر مجاني متكامل يشمل رعاية طبية طارئة', 'خصومات حصرية لدى أكثر من 500 متجر ومطعم محلي', 'دخول مجاني لـ 6 صالات مطار رئيسية سنوياً']
        : ['Flat 1.5% cashback on all transactions', 'Complimentary multi-trip travel insurance cover', 'Exclusive discounts at over 500 global merchants', '6 free airport lounge visits annually'],
    },
    signature: {
      name: lang === 'ar' ? 'بطاقة فيزا سيجنتشر الفاخرة' : 'Visa Signature Premium Card',
      gradient: 'from-indigo-950 via-purple-900 to-brand-dark',
      textColor: 'text-amber-100',
      chipColor: 'bg-amber-300',
      number: '4912 3345 9920 1284',
      holder: lang === 'ar' ? 'سارة يوسف الفايز' : 'SARAH Y. AL-FAYEZ',
      expiry: '12/31',
      cashback: '2.5%',
      creditLimit: '$15,000 - $50,000',
      annualFee: '$150',
      benefits: lang === 'ar' 
        ? ['استرداد نقدي مضاعف يصل لـ 2.5% على السفر والتسوق الدولي', 'دخول غير محدود لـ 1,000 صالة مطار حول العالم مع مرافق', 'خدمة الكونسيرج الفاخرة على مدار الساعة لحجز المطاعم وتذاكر الطيران', 'حماية مشتريات ممتدة ضد السرقة والتلف لمدة عام كامل']
        : ['Up to 2.5% cashback on international spend & travel', 'Unlimited access to 1,000+ global airport lounges', '24/7 Premium Concierge services for global VIP booking', 'Extended warranty and buyer protection coverage for 1 year'],
    },
    elite: {
      name: lang === 'ar' ? 'بطاقة فيزا النخبة الذهبية السوداء' : 'Black World Elite Card',
      gradient: 'from-neutral-950 via-neutral-900 to-stone-800',
      textColor: 'text-yellow-500',
      chipColor: 'bg-yellow-400',
      number: '4915 0000 8888 1111',
      holder: lang === 'ar' ? 'سارة يوسف الفايز' : 'SARAH Y. AL-FAYEZ',
      expiry: '06/32',
      cashback: '4.0%',
      creditLimit: '$50,000 - Unlimited',
      annualFee: '$500 (By Invitation / High Portfolio)',
      benefits: lang === 'ar' 
        ? ['نسبة استرداد نقدي استثنائية 4.0% على جميع المدفوعات الفاخرة', 'خدمة الاستقبال والمساعدة الشخصية المجانية (Meet & Greet) بالمطارات', 'دعوات حصرية لفعاليات كبار الشخصيات وعروض أزياء عالمية مغلقة', 'عضوية مجانية في نوادي غولف وفنادق خمس نجوم متميزة']
        : ['Exceptional 4.0% cashback on luxury & lifestyle brands', 'Complimentary VIP Meet & Greet airport arrival services', 'Exclusive private invitations to closed global premium events', 'Complimentary elite memberships in luxury golf & hotel chains'],
    }
  };

  const handleApplyCard = async () => {
    await submitCardInquiry({
      cardType: activeCard.name,
      name: lang === 'ar' ? 'زائر الموقع' : 'Website Visitor',
      phone: '+000000000',
      email: 'visitor@example.com',
    });
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
    }, 3000);
  };

  const activeCard = cardsData[selectedCard];

  return (
    <div id="cards-page" className="py-12 bg-white text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Page Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand uppercase tracking-widest block mb-2 font-mono">
            {lang === 'ar' ? 'عالم البطاقات الائتمانية الفاخرة' : 'Credit & Premium Card Collections'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nearblack mb-4">
            {t.cardComparisonTitle}
          </h2>
          <p className="text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
            {lang === 'ar' 
              ? 'اختر من باقتنا الفاخرة من البطاقات الائتمانية وبطاقات الخصم المباشر المليئة بالمزايا الحصرية المصممة لترقية جودة حياتك المصرفية والشرائية وتكافئ مدفوعاتك.' 
              : 'Empower your purchasing power with our premium bespoke credit lines, offering unprecedented reward rates, elite lounge access, and full financial cover.'}
          </p>
        </div>

        {/* SELECTOR TABS */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {(['platinum', 'signature', 'elite'] as const).map((id) => (
            <button
              key={id}
              onClick={() => { setSelectedCard(id); setIsApplied(false); }}
              id={`card-tab-btn-${id}`}
              className={`px-6 py-3 rounded-lg font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer ${
                selectedCard === id
                  ? 'bg-brand text-white shadow-md border-brand'
                  : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {id === 'platinum' ? (lang === 'ar' ? 'فيزا بلاتينيوم 🛡️' : 'Visa Platinum') :
               id === 'signature' ? (lang === 'ar' ? 'فيزا سيجنتشر ✨' : 'Visa Signature') :
                                    (lang === 'ar' ? 'النخبة السوداء 👑' : 'World Elite')}
            </button>
          ))}
        </div>

        {/* VISUAL LAYOUT CONTAINER (Card visual + details side-by-side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50 border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-lg">
          
          {/* LEFT: INTERACTIVE CSS CREDIT CARD RENDER */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group perspective-1000 w-full max-w-[380px]">
              
              {/* Virtual Card Box */}
              <div 
                id="interactive-credit-card"
                className={`w-full aspect-[1.586/1] rounded-[20px] bg-gradient-to-br ${activeCard.gradient} ${activeCard.textColor} p-6 sm:p-7 shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex flex-col justify-between relative overflow-hidden transition-transform duration-500 transform group-hover:rotate-x-6 group-hover:rotate-y-12 select-none border border-white/20`}
              >
                {/* Visual reflections overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-70 pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 rotate-[20deg]" />

                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black tracking-widest leading-none block uppercase font-sans">
                      {lang === 'ar' ? 'بنك الابتكار' : 'Innovation Bank'}
                    </span>
                    <span className="text-[7px] tracking-widest block uppercase opacity-70 mt-0.5">
                      {lang === 'ar' ? 'البنك للجميع' : 'INTERNATIONAL'}
                    </span>
                  </div>
                  {/* Geometric emblem logo on card */}
                  <div className="flex items-center gap-1 opacity-90">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-brand" />
                    </div>
                  </div>
                </div>

                {/* EMV Chip and Hologram Contactless Symbol */}
                <div className="flex items-center justify-between mt-4">
                  {/* EMV Chip */}
                  <div className={`w-10 h-8 rounded-md ${activeCard.chipColor} relative overflow-hidden border border-black/10`}>
                    <div className="absolute inset-x-2.5 top-0 bottom-0 border-l border-r border-black/10" />
                    <div className="absolute inset-y-2 top-2 bottom-2 border-t border-b border-black/10" />
                  </div>
                  {/* Contactless waves symbol */}
                  <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 8.5c1.1-1.1 2.9-1.1 4 0m-6 3c2.2-2.2 5.8-2.2 8 0M1 14.5c3.3-3.3 8.7-3.3 12 0" />
                  </svg>
                </div>

                {/* Card Number */}
                <div className="my-3">
                  <span className="font-mono text-sm sm:text-base font-bold tracking-widest text-center block">
                    {activeCard.number}
                  </span>
                </div>

                {/* Card Footer: Holder & Expiry & Network */}
                <div className="flex justify-between items-end">
                  <div className="text-right">
                    <span className="text-[7px] uppercase tracking-wider block opacity-70">
                      {lang === 'ar' ? 'حامل البطاقة' : 'CARDHOLDER'}
                    </span>
                    <span className="text-[10px] font-black tracking-wider block font-mono mt-0.5">
                      {activeCard.holder}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className="text-right">
                      <span className="text-[7px] uppercase tracking-wider block opacity-70">
                        {lang === 'ar' ? 'صلاحية' : 'EXPIRY'}
                      </span>
                      <span className="text-[10px] font-bold block font-mono mt-0.5">
                        {activeCard.expiry}
                      </span>
                    </div>
                    {/* Visa logo placeholder */}
                    <div className="text-right">
                      <span className="font-sans font-black text-xs sm:text-sm tracking-tighter italic block">
                        VISA
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Decorative prompt */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gray-400 select-none flex items-center gap-1.5 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-brand" />
                <span>{lang === 'ar' ? 'مرر المؤشر فوق البطاقة لرؤية تفاصيل الانعكاس' : 'Hover over the card to engage premium shine'}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILED CHARACTERISTICS & BENEFITS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-right">
              <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                {activeCard.name}
              </h3>
              <p className="text-xs font-bold text-brand flex items-center gap-1.5 justify-start">
                <Globe className="w-4 h-4 text-brand" />
                <span>{lang === 'ar' ? 'مقبولة وتعمل محلياً ودولياً في ملايين نقاط البيع والصرافات الآلية' : 'Accepted globally in millions of ATM networks'}</span>
              </p>
            </div>

            <div className="h-px bg-gray-200/80 my-4" />

            {/* Core statistics cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <span className="text-[9px] font-black text-gray-400 block uppercase mb-1">
                  {lang === 'ar' ? 'الاسترداد النقدي' : 'Cashback Ratio'}
                </span>
                <span className="text-base font-black text-brand block">{activeCard.cashback}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <span className="text-[9px] font-black text-gray-400 block uppercase mb-1">
                  {lang === 'ar' ? 'الحد الائتماني' : 'Credit limit'}
                </span>
                <span className="text-xs font-black text-gray-800 block whitespace-nowrap">{activeCard.creditLimit}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center">
                <span className="text-[9px] font-black text-gray-400 block uppercase mb-1">
                  {lang === 'ar' ? 'الرسوم السنوية' : 'Annual Fee'}
                </span>
                <span className="text-[11px] font-black text-gray-800 block">{activeCard.annualFee}</span>
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-3.5 pt-2">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest block">
                {lang === 'ar' ? 'مزايا البطاقة الائتمانية الحصرية' : 'Exclusive Card Privileges'}
              </h4>
              <ul className="space-y-3">
                {activeCard.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-gray-600 font-medium">
                    <Check className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application button with simulated feedback */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {!isApplied ? (
                <button
                  onClick={handleApplyCard}
                  className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-extrabold text-xs px-8 py-4 rounded-lg shadow-md transition-all cursor-pointer text-center"
                >
                  {lang === 'ar' ? 'قدم طلب الحصول على البطاقة' : 'Apply for Card Now'}
                </button>
              ) : (
                <div className="w-full sm:w-auto bg-green-100 border border-green-200 text-green-700 font-bold text-xs px-6 py-4 rounded-lg flex items-center gap-2 justify-center animate-scale-up">
                  <ShieldCheck className="w-5 h-5" />
                  <span>{lang === 'ar' ? '✓ تم إرسال طلب البطاقة الائتمانية بنجاح! سيتصل بك فريقنا خلال ساعة.' : '✓ Applied successfully! Our support will contact you within an hour.'}</span>
                </div>
              )}
              <button
                onClick={() => alert(lang === 'ar' ? 'ميزة تفعيل الحماية ثلاثية الأبعاد الآمنة (3D Secure) مفعلة تلقائياً لكافة بطاقاتنا.' : 'All cards are armed automatically with 3D Secure protocol.')}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 font-bold text-xs px-6 py-4 rounded-lg transition-colors cursor-pointer text-center"
              >
                {lang === 'ar' ? 'إجراءات الحماية والأمان' : 'Security Protocols'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
