import { Facebook, MessageCircle, MapPin, Phone, Globe } from 'lucide-react';
import { Language, translations } from '../types';

interface TopBarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeSegment: 'personal' | 'business';
  setActiveSegment: (segment: 'personal' | 'business') => void;
  onNavigate: (section: string) => void;
}

export default function TopBar({
  lang,
  setLang,
  activeSegment,
  setActiveSegment,
  onNavigate,
}: TopBarProps) {
  const t = translations[lang];

  const handleLanguageToggle = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const tabs = [
    { id: 'personal', label: t.personalServices, segment: 'personal' },
    { id: 'business', label: t.businessServices, segment: 'business' },
    { id: 'about', label: t.aboutUs, action: () => onNavigate('about') },
    { id: 'sustainability', label: t.sustainability, action: () => onNavigate('sustainability') },
    { id: 'loyalty', label: t.loyalty, action: () => onNavigate('loyalty') },
    { id: 'investor', label: t.investor, action: () => onNavigate('investor') },
  ];

  return (
    <div 
      className="bg-charcoal text-white text-xs h-10 flex items-center justify-between px-4 sm:px-6 md:px-8 shadow-inner"
      id="top-utility-bar"
    >
      {/* Dynamic segment tabs (Middle/Left in RTL, Middle/Right in LTR) */}
      <div className="flex h-full items-center overflow-x-auto scrollbar-none gap-0.5">
        {tabs.map((tab) => {
          const isActive = tab.segment ? activeSegment === tab.segment : false;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.segment) {
                  setActiveSegment(tab.segment as 'personal' | 'business');
                } else if (tab.action) {
                  tab.action();
                }
              }}
              id={`top-tab-${tab.id}`}
              className={`h-full px-3 font-medium transition-all duration-300 flex items-center justify-center whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-nearblack font-bold shadow-sm'
                  : 'text-gray-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Utility links and socials (Right to Left in RTL, Left to Right in LTR) */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Contact Us Link */}
        <a
          href="tel:+96265550000"
          id="top-contact"
          className="hidden sm:flex items-center gap-1.5 text-gray-300 hover:text-brand-light transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{t.contactUs}</span>
        </a>

        {/* Branches Link */}
        <button
          onClick={() => onNavigate('branches')}
          id="top-branches"
          className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-brand-light transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.branches}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={handleLanguageToggle}
          id="top-lang-toggle"
          className="flex items-center gap-1.5 font-bold text-brand-light bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t.langToggle}</span>
        </button>

        {/* Separator */}
        <span className="h-4 w-px bg-neutral-700 hidden sm:inline" />

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/1800555000"
            target="_blank"
            rel="noopener noreferrer"
            id="top-whatsapp"
            className="text-gray-300 hover:text-green-400 transition-colors duration-300"
            title="WhatsApp Support"
          >
            <MessageCircle className="w-4 h-4 fill-current text-white hover:text-green-400" />
          </a>
          
          {/* Facebook Icon */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            id="top-facebook"
            className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
            title="Facebook Portal"
          >
            <Facebook className="w-4 h-4 fill-current text-white hover:text-blue-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
