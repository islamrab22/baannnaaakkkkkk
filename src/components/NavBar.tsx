import { useState, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, Landmark, ArrowLeftRight, CreditCard, ShieldCheck, DollarSign } from 'lucide-react';
import { Language, ActivePage, translations } from '../types';
import Logo from './Logo';

interface NavBarProps {
  lang: Language;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenLoginModal: (portal: 'personal' | 'business') => void;
  onOpenSearch: () => void;
}

export default function NavBar({
  lang,
  activePage,
  setActivePage,
  onOpenLoginModal,
  onOpenSearch,
}: NavBarProps) {
  const t = translations[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Monitor scroll to apply premium glassmorphism/shadow effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'accounts', label: t.navAccounts, page: 'accounts' as ActivePage },
    { id: 'campaigns', label: t.navCampaigns, page: 'home' as ActivePage, elementId: 'campaigns-section' },
    { id: 'cards', label: t.navCards, page: 'cards' as ActivePage },
    { id: 'loans', label: t.navLoans, page: 'loans' as ActivePage },
    { id: 'electronic', label: t.navElectronic, page: 'electronic' as ActivePage },
    { id: 'transfers', label: t.navTransfers, page: 'transfers' as ActivePage },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (link.elementId) {
      setActivePage('home');
      setTimeout(() => {
        const element = document.getElementById(link.elementId!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setActivePage(link.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md h-20'
          : 'bg-white h-24'
      } border-b border-gray-100 flex items-center`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
        
        {/* LOGO (Right side in RTL, Left side in LTR) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            id="bank-logo-button"
          >
            <Logo lang={lang} />
          </button>
        </div>

        {/* HORIZONTAL MENU (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
          {navLinks.map((link) => {
            const isPageActive = activePage === link.page && !link.elementId;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                id={`nav-link-${link.id}`}
                className={`px-3 py-2 text-sm font-bold rounded-md transition-all cursor-pointer relative ${
                  isPageActive
                    ? 'text-brand'
                    : 'text-gray-700 hover:text-brand hover:bg-brand-light/40'
                }`}
              >
                {link.label}
                {isPageActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />
                )}
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              id="nav-link-more"
              className="px-3 py-2 text-sm font-bold text-gray-700 hover:text-brand hover:bg-brand-light/40 rounded-md flex items-center gap-1 cursor-pointer"
            >
              <span>{t.more}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMoreOpen && (
              <div 
                className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50`}
                onMouseLeave={() => setIsMoreOpen(false)}
              >
                <button
                  onClick={() => { setActivePage('home'); setIsMoreOpen(false); setTimeout(() => document.getElementById('exchange-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  className="w-full text-right px-4 py-2.5 text-xs text-gray-700 hover:bg-brand-light/50 hover:text-brand flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'أسعار العملات والتبادل' : 'Exchange Rates'}</span>
                </button>
                <button
                  onClick={() => { setActivePage('home'); setIsMoreOpen(false); setTimeout(() => document.getElementById('faqs-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                  className="w-full text-right px-4 py-2.5 text-xs text-gray-700 hover:bg-brand-light/50 hover:text-brand flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'الأسئلة الشائعة والأمان' : 'FAQs & Security'}</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* LEFT NAV UTILITIES (Desktop: Search & Login button) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Icon button */}
          <button
            onClick={onOpenSearch}
            id="nav-search-button"
            className="p-2.5 text-gray-500 hover:text-brand hover:bg-gray-50 rounded-full transition-all cursor-pointer"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Login Dropdown Wrapper */}
          <div className="relative">
            <button
              onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
              id="nav-login-dropdown"
              className="bg-brand hover:bg-brand-dark text-white font-bold text-sm px-6 py-3 rounded-md shadow-md hover:shadow-lg flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <span>{t.login}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLoginDropdownOpen && (
              <div 
                className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2.5 w-64 bg-white border border-gray-100 rounded-lg shadow-2xl py-2 z-50 animate-fade-in`}
                onMouseLeave={() => setIsLoginDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    onOpenLoginModal('personal');
                    setIsLoginDropdownOpen(false);
                  }}
                  id="login-option-personal"
                  className="w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-brand-light/60 hover:text-brand flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 bg-brand/10 rounded-md text-brand">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{t.personalLogin}</span>
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    onOpenLoginModal('business');
                    setIsLoginDropdownOpen(false);
                  }}
                  id="login-option-business"
                  className="w-full text-right px-4 py-3 text-sm text-gray-800 hover:bg-brand-light/60 hover:text-brand flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 bg-neutral-100 rounded-md text-gray-700">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{t.businessLogin}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 text-gray-500 hover:text-brand hover:bg-gray-50 rounded-full cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle"
            className="p-2 text-gray-700 hover:text-brand hover:bg-brand-light rounded-md transition-all cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-24 left-0 right-0 bg-white border-b border-gray-100 shadow-xl z-50 animate-slide-down max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="p-5 flex flex-col gap-3">
            {navLinks.map((link) => {
              const isPageActive = activePage === link.page && !link.elementId;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={`w-full text-right py-3 px-4 rounded-lg font-bold text-base transition-all cursor-pointer ${
                    isPageActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            
            {/* Mobile login widgets */}
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-2">
              <span className="text-xs text-gray-400 px-4 uppercase tracking-wider">
                {lang === 'ar' ? 'الخدمات الرقمية الآمنة' : 'Secure Digital Portals'}
              </span>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLoginModal('personal');
                }}
                className="w-full text-right py-3 px-4 rounded-lg bg-brand text-white font-bold flex items-center justify-between cursor-pointer"
              >
                <span>{t.personalLogin}</span>
                <ShieldCheck className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLoginModal('business');
                }}
                className="w-full text-right py-3 px-4 rounded-lg bg-charcoal text-white font-bold flex items-center justify-between cursor-pointer"
              >
                <span>{t.businessLogin}</span>
                <Landmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
