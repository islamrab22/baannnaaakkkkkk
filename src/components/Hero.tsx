import { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Landmark, CreditCard, Landmark as LoanIcon, Megaphone, Computer } from 'lucide-react';
import { Language, ActivePage, translations } from '../types';

// Let's import the generated image directly
import heroImg from '../assets/images/hero_person_card_1782861610119.jpg';

interface HeroProps {
  lang: Language;
  setActivePage: (page: ActivePage) => void;
  onOpenLoginModal: (portal: 'personal' | 'business') => void;
}

export default function Hero({ lang, setActivePage, onOpenLoginModal }: HeroProps) {
  const t = translations[lang];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Carousel item definitions
  const carouselItems = [
    { id: 'accounts', label: t.quickAccounts, page: 'accounts' as ActivePage, icon: Landmark, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'cards', label: t.quickCards, page: 'cards' as ActivePage, icon: CreditCard, color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { id: 'loans', label: t.quickLoans, page: 'loans' as ActivePage, icon: LoanIcon, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'campaigns', label: t.quickCampaigns, page: 'home' as ActivePage, elementId: 'campaigns-section', icon: Megaphone, color: 'bg-red-50 text-red-600 border-red-100' },
    { id: 'electronic', label: t.quickElectronic, page: 'electronic' as ActivePage, icon: Computer, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 180;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleItemClick = (item: typeof carouselItems[0]) => {
    if (item.elementId) {
      const element = document.getElementById(item.elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setActivePage(item.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero-section"
      className="relative bg-cream pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden w-full"
    >
      {/* Background visual accents */}
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* TEXT CONTENT (Right column in RTL, Left column in LTR) */}
          <div className="lg:col-span-6 flex flex-col justify-center text-right order-2 lg:order-none">
            <h1 
              id="hero-headline"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-nearblack tracking-tight leading-none mb-6 font-sans select-none"
            >
              {t.heroTitle}
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-xl leading-relaxed mb-8">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-start">
              <button
                onClick={() => setActivePage('accounts')}
                className="bg-brand hover:bg-brand-dark text-white font-extrabold text-base px-8 py-4 rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {t.heroCTA}
              </button>
              <button
                onClick={() => onOpenLoginModal('personal')}
                className="bg-white hover:bg-gray-50 text-brand border-2 border-brand/20 hover:border-brand font-bold text-base px-8 py-4 rounded-md transition-all cursor-pointer"
              >
                {lang === 'ar' ? 'الخدمات المصرفية الرقمية' : 'Digital Services'}
              </button>
            </div>
          </div>

          {/* VISUAL IMAGE & BLOB (Left column in RTL, Right column in LTR) */}
          <div className="lg:col-span-6 flex justify-center items-center relative order-1 lg:order-none py-8">
            
            {/* Organic Brand Magenta Blob behind the Photo */}
            <div 
              className="absolute w-[80%] aspect-square bg-brand rounded-[40%_60%_70%_30%_/_50%_40%_60%_50%] opacity-90 animate-pulse transition-all duration-[10s]"
              style={{
                animationDuration: '15s',
                animationIterationCount: 'infinite',
              }}
            />

            {/* ARTISTIC GRADIENT LEAF ILLUSTRATIONS OVERLAY */}
            {/* Leaf 1 (Copper gradient, top-right) */}
            <svg className="absolute -top-4 -right-4 w-28 h-28 transform rotate-[45deg] drop-shadow-md z-10" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad-copper" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path d="M50,10 C65,30 65,70 50,90 C35,70 35,30 50,10 Z" fill="url(#grad-copper)" opacity="0.85" />
              <path d="M50,10 C55,40 55,60 50,90" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
            </svg>

            {/* Leaf 2 (Turquoise gradient, bottom-left) */}
            <svg className="absolute -bottom-6 -left-2 w-24 h-24 transform -rotate-[30deg] drop-shadow-md z-10" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad-turquoise" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
              <path d="M50,10 C65,30 65,70 50,90 C35,70 35,30 50,10 Z" fill="url(#grad-turquoise)" opacity="0.8" />
              <path d="M50,10 C45,35 45,65 50,90" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
            </svg>

            {/* Leaf 3 (Pink gradient, top-left) */}
            <svg className="absolute -top-6 left-12 w-20 h-20 transform -rotate-[60deg] drop-shadow-sm z-10" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#db2777" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              <path d="M50,10 C65,30 65,70 50,90 C35,70 35,30 50,10 Z" fill="url(#grad-pink)" opacity="0.75" />
            </svg>

            {/* High-quality generated stock photo with exact rounded card theme */}
            <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full overflow-hidden border-8 border-white shadow-2xl z-10 hover:scale-102 transition-transform duration-500">
              <img 
                src={heroImg} 
                alt="Bank client with credit card"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Decorative float tag */}
            <div className="absolute top-1/4 left-0 sm:-left-4 bg-white/90 backdrop-blur border border-gray-100 px-4 py-3 rounded-lg shadow-lg z-20 flex items-center gap-2.5 hover:scale-105 transition-transform">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-800 font-sans whitespace-nowrap">
                {lang === 'ar' ? 'بطاقة بلاتينيوم مفعلة' : 'Platinum Card Active'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* FLOATING QUICK CAROUSEL BAR (Overlapping boundary with shadow) */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[90%] max-w-4xl z-30">
        <div className="bg-white rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-4 flex items-center justify-between gap-2">
          
          {/* Scroll Right Button (in RTL: scroll previous) */}
          <button 
            onClick={() => scroll(lang === 'ar' ? 'right' : 'left')}
            className="p-2.5 bg-gray-50 hover:bg-brand-light text-gray-600 hover:text-brand rounded-full transition-all cursor-pointer"
            id="carousel-nav-prev"
          >
            <ChevronRight className="w-5 h-5 transform rotate-180" />
          </button>

          {/* Scrolling items wrapper */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-none flex items-center justify-between gap-4 px-2 select-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {carouselItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  id={`carousel-item-${item.id}`}
                  className="flex-1 min-w-[120px] scroll-snap-align-center flex flex-col items-center gap-2.5 py-2.5 rounded-lg hover:bg-brand-light/40 group transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-extrabold text-gray-800 text-center whitespace-nowrap group-hover:text-brand transition-colors">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Left Button (in RTL: scroll next) */}
          <button 
            onClick={() => scroll(lang === 'ar' ? 'left' : 'right')}
            className="p-2.5 bg-gray-50 hover:bg-brand-light text-gray-600 hover:text-brand rounded-full transition-all cursor-pointer"
            id="carousel-nav-next"
          >
            <ChevronLeft className="w-5 h-5 transform rotate-180" />
          </button>

        </div>
      </div>
    </section>
  );
}
