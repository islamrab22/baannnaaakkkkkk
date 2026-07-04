import { Facebook, MessageCircle, MapPin, Phone, Linkedin, Instagram, Youtube, HelpCircle, FileText, Globe, Landmark } from 'lucide-react';
import { Language, ActivePage, translations } from '../types';
import Logo from './Logo';

interface FooterProps {
  lang: Language;
  setActivePage: (page: ActivePage) => void;
  onNavigate: (section: string) => void;
}

export default function Footer({ lang, setActivePage, onNavigate }: FooterProps) {
  const t = translations[lang];

  const socialLinks = [
    { id: 'fb', icon: Facebook, url: 'https://facebook.com', color: 'hover:bg-blue-600 hover:text-white', label: 'Facebook' },
    { id: 'wa', icon: MessageCircle, url: 'https://wa.me/1800555000', color: 'hover:bg-green-500 hover:text-white', label: 'WhatsApp' },
    { id: 'in', icon: Instagram, url: 'https://instagram.com', color: 'hover:bg-pink-600 hover:text-white', label: 'Instagram' },
    { id: 'yt', icon: Youtube, url: 'https://youtube.com', color: 'hover:bg-red-600 hover:text-white', label: 'YouTube' },
    { id: 'li', icon: Linkedin, url: 'https://linkedin.com', color: 'hover:bg-blue-700 hover:text-white', label: 'LinkedIn' },
  ];

  const exploreLinks = [
    { label: lang === 'ar' ? 'الوظائف والمهن' : 'Careers', action: () => onNavigate('careers') },
    { label: lang === 'ar' ? 'المركز الإعلامي والأخبار' : 'News & Media', action: () => onNavigate('news') },
    { label: lang === 'ar' ? 'العطاءات والمناقصات' : 'Tenders & RFPs', action: () => onNavigate('tenders') },
    { label: lang === 'ar' ? 'احصل على الآيبان (IBAN)' : 'Get your IBAN', action: () => onNavigate('iban') },
    { label: lang === 'ar' ? 'حاسبة أسعار العملات' : 'Currency Exchange', action: () => { setActivePage('home'); setTimeout(() => document.getElementById('exchange-section')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
  ];

  return (
    <footer 
      className="bg-charcoal text-white pt-16 pb-8 border-t-4 border-brand"
      id="main-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* TOP HELP BLOCK (Need Help? Contact Us) */}
        <div className="bg-neutral-800 rounded-2xl p-6 sm:p-8 md:p-10 mb-12 shadow-lg border border-neutral-700 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-right flex-1">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 flex items-center gap-2.5 justify-start">
              <HelpCircle className="w-6 h-6 text-brand-light" />
              <span>{t.footerHelpTitle}</span>
            </h3>
            <p className="text-sm font-medium text-gray-300 leading-relaxed max-w-xl">
              {t.footerHelpSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-end">
            <a
              href="https://wa.me/1800555000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Chat'}</span>
            </a>
            <a
              href="tel:1800555000"
              className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all"
            >
              <Phone className="w-5 h-5" />
              <span>{t.footerPhoneLocal}</span>
            </a>
          </div>

        </div>

        {/* MID GRID CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-neutral-800 pb-12 mb-8">
          
          {/* Institutional Branding */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Logo lang={lang} light={true} />
            </div>
            <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-sm">
              {lang === 'ar' 
                ? 'مؤسسة مصرفية عالمية رائدة مرخصة وخاضعة لرقابة البنك المركزي. نعمل على تمكين الأفراد والشركات من تحقيق تطلعاتهم المالية بأمان وثقة.' 
                : 'A leading international banking institution licensed and regulated by the Central Bank. We empower individuals and companies to achieve their financial aspirations securely.'}
            </p>
            <button
              onClick={() => onNavigate('branches')}
              className="flex items-center gap-2 text-xs font-bold text-brand-light hover:text-white transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>{t.footerFindBranch}</span>
            </button>
          </div>

          {/* Quick Explore Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-black text-gray-300 uppercase tracking-widest border-b border-neutral-800 pb-2">
              {lang === 'ar' ? 'روابط هامة للمستثمرين والشركات' : 'Key Information & Portals'}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {exploreLinks.map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={link.action}
                    className="text-xs font-medium text-gray-400 hover:text-brand-light hover:underline transition-all cursor-pointer text-right flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Security Badges */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-black text-gray-300 uppercase tracking-widest border-b border-neutral-800 pb-2">
              {lang === 'ar' ? 'الاتصال الدولي والأمان' : 'International Reach & Security'}
            </h4>
            <div className="space-y-2 text-xs font-medium text-gray-400">
              <p className="flex items-center gap-2 justify-start">
                <Phone className="w-4 h-4 text-brand" />
                <span>{t.footerPhoneInt}</span>
              </p>
              <p className="flex items-center gap-2 justify-start">
                <Globe className="w-4 h-4 text-brand" />
                <span>support@innovationbank.com</span>
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="bg-neutral-800 px-2.5 py-1.5 rounded border border-neutral-700 flex items-center gap-1.5 text-[10px] text-gray-300">
                  <FileText className="w-3.5 h-3.5 text-green-400" />
                  <span>ISO 27001 SECURE</span>
                </div>
                <div className="bg-neutral-800 px-2.5 py-1.5 rounded border border-neutral-700 flex items-center gap-1.5 text-[10px] text-gray-300">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>CENTRAL BANK REGULATED</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: Social media & copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Copyrights */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500 font-medium leading-loose">
              {t.footerCopyright}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-[11px] text-gray-500">
              <button onClick={() => onNavigate('terms')} className="hover:text-brand-light hover:underline cursor-pointer">{t.footerTerms}</button>
              <span className="h-2.5 w-px bg-neutral-800" />
              <button onClick={() => onNavigate('privacy')} className="hover:text-brand-light hover:underline cursor-pointer">{t.footerPrivacy}</button>
              <span className="h-2.5 w-px bg-neutral-800" />
              <button onClick={() => onNavigate('security')} className="hover:text-brand-light hover:underline cursor-pointer">{t.footerSecurity}</button>
            </div>
          </div>

          {/* Social Row */}
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 text-gray-300 flex items-center justify-center transition-all duration-300 ${social.color}`}
                >
                  <Icon className="w-4 h-4 fill-current" />
                </a>
              );
            })}
          </div>

        </div>

      </div>
    </footer>
  );
}
