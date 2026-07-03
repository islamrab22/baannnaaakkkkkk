import { Smartphone, MessageSquare, QrCode, ShieldAlert, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface ElectronicServicesTabProps {
  lang: Language;
}

export default function ElectronicServicesTab({ lang }: ElectronicServicesTabProps) {
  const services = [
    {
      id: 'app',
      title: lang === 'ar' ? 'تطبيق الموبايل المصرفي المطور' : 'Next-Gen Mobile Banking',
      icon: Smartphone,
      tagline: lang === 'ar' ? 'بنكك بالكامل في جيبك' : 'Your entire bank in your pocket',
      desc: lang === 'ar' 
        ? 'تمتع بأعلى درجات الأمان والتحكم المالي المطلق. سدد الفواتير، تتبع النفقات، وقم بإجراء التحويلات الفورية بأطراف أصابعك.'
        : 'Settle invoices, evaluate budget expenses, and transmit rapid instant transfers directly on your phone.',
      bullets: lang === 'ar' 
        ? ['تسجيل دخول آمن وفوري بالبصمة أو FaceID', 'عرض ومراقبة حدود الإنفاق وتعديلها فوراً', 'دفع فواتير الخدمات فواتيركوم بنقرة واحدة']
        : ['Biometric instant fingerprint or FaceID entry', 'Track and manage credit card limits instantly', 'Pay all utility bills with automated schedules'],
    },
    {
      id: 'qr',
      title: lang === 'ar' ? 'سحب نقدي بدون بطاقة عبر رمز QR' : 'Cardless QR Code Withdrawal',
      icon: QrCode,
      tagline: lang === 'ar' ? 'طريقة أسرع وأكثر أماناً للحصول على الكاش' : 'Secure cardless cash solutions',
      desc: lang === 'ar' 
        ? 'لا حاجة لبطاقة الصراف المادية بعد الآن! امسح رمز الـ QR الظاهر على شاشة الصراف الآلي عبر تطبيقنا لسحب الأموال فوراً بأمان.'
        : 'Forget plastic. Generate a secure withdrawal token on your mobile application, scan the screen at any Innovation ATM, and withdraw funds.',
      bullets: lang === 'ar' 
        ? ['حماية مطلقة من عمليات نسخ وتزوير البطاقات', 'إمكانية إرسال كود السحب لصديق للحالات الطارئة', 'سرعة السحب تتقلص لأقل من 10 ثوانٍ']
        : ['Eliminate card skimming security concerns completely', 'Transmit emergency withdrawal tokens securely to friends', 'Transaction speed reduced to under 10 seconds'],
    },
    {
      id: 'wa',
      title: lang === 'ar' ? 'خدمة المساعدة التفاعلية عبر واتساب' : 'Interactive WhatsApp Banking',
      icon: MessageSquare,
      tagline: lang === 'ar' ? 'تواصل معنا في أي وقت ومن أي مكان' : 'Your automated assistant available 24/7',
      desc: lang === 'ar' 
        ? 'احصل على كشوف الحساب السريعة، أسعار العملات الحالية، مواقع الصرافات الآلية القريبة فوراً عبر تطبيق الواتساب الموثق والأكثر أماناً.'
        : 'Retrieve mini-statements, verify live exchange rates, and pinpoint adjacent branch locations directly over our verified green-tick chat lines.',
      bullets: lang === 'ar' 
        ? ['الاستعلام عن الرصيد وحركة الحسابات الأخيرة لربط سهل', 'خط اتصال مشفر بالكامل ومعتمد رسمياً', 'متاحة على مدار الساعة طيلة أيام الأسبوع']
        : ['Query active balance accounts and transaction logs instantly', 'Fully encrypted and officially verified green-tick protocol', 'Operational 24/7/365 with automated response grids'],
    }
  ];

  return (
    <div id="electronic-page" className="py-12 bg-white text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand uppercase tracking-widest block mb-2 font-mono">
            {lang === 'ar' ? 'منظومة الخدمات الرقمية الذكية' : 'Smart Digital Services'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nearblack mb-4">
            {lang === 'ar' ? 'عالم من الخدمات الرقمية بين يديك' : 'Digital Ecosystems & Integrations'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
            {lang === 'ar' 
              ? 'نهتم بتطوير وتقديم حلول تكنولوجية ريادية لتستمتع بمعاملات مصرفية سهلة وآمنة تناسب تطلعاتك وتضمن راحة عائلتك اليومية.'
              : 'Our technical team is focused on implementing forward-thinking digital platforms which safeguard transactions and optimize accessibility.'}
          </p>
        </div>

        {/* SERVICES LIST (Alternating layout or robust card grids) */}
        <div className="space-y-16">
          {services.map((ser, index) => {
            const Icon = ser.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={ser.id}
                id={`e-service-${ser.id}`}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-6 sm:p-8 rounded-3xl border border-gray-100 bg-slate-50 shadow-sm transition-all hover:shadow-md ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Icon Box */}
                <div className={`lg:col-span-4 flex justify-center items-center ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-brand-light/30 border border-brand/10 text-brand flex items-center justify-center shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                    <Icon className="w-12 h-12 sm:w-16 sm:h-16 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Info Box */}
                <div className={`lg:col-span-8 text-right space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="flex items-center gap-2 justify-start">
                    <span className="bg-brand-light text-brand text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                      {lang === 'ar' ? 'خدمة ذكية مفعلة' : 'SMART SERVICE ACTIVE'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-gray-950">
                    {ser.title}
                  </h3>
                  <p className="text-xs font-extrabold text-gray-400">
                    {ser.tagline}
                  </p>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl">
                    {ser.desc}
                  </p>

                  <div className="h-px bg-gray-200/50 my-2" />

                  <ul className="space-y-2.5">
                    {ser.bullets.map((bul, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-gray-600 font-bold justify-start">
                        <Check className="w-4 h-4 text-brand shrink-0" />
                        <span>{bul}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <button
                      onClick={() => alert(lang === 'ar' ? 'يرجى تحميل تطبيق البنك الرسمي لتفعيل وإدارة هذه الميزة الآمنة.' : 'Install the official Innovation Banking application to register.')}
                      className="bg-white hover:bg-gray-100 text-brand border border-brand/20 hover:border-brand font-extrabold text-xs px-5 py-3 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>{lang === 'ar' ? 'تعلم كيفية التفعيل' : 'Read Onboarding Guide'}</span>
                      <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'transform rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
