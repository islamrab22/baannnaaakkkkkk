export type Language = 'ar' | 'en';

export type ActivePage = 'home' | 'accounts' | 'cards' | 'loans' | 'electronic' | 'transfers';

export interface TranslationDict {
  // Common Utilities
  langToggle: string;
  branches: string;
  contactUs: string;
  login: string;
  personalLogin: string;
  businessLogin: string;
  aboutUs: string;
  sustainability: string;
  loyalty: string;
  investor: string;
  businessServices: string;
  personalServices: string;
  searchPlaceholder: string;
  bankName: string;
  more: string;

  // Nav Links
  navAccounts: string;
  navCampaigns: string;
  navCards: string;
  navLoans: string;
  navElectronic: string;
  navTransfers: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;

  // Quick Carousel
  quickAccounts: string;
  quickCards: string;
  quickLoans: string;
  quickCampaigns: string;
  quickElectronic: string;

  // Online Banking Section
  obTitle: string;
  obSubtitle: string;
  obDescription: string;
  obFeature1Title: string;
  obFeature1Desc: string;
  obFeature2Title: string;
  obFeature2Desc: string;
  obFeature3Title: string;
  obFeature3Desc: string;
  obPhoneMockTitle: string;
  obPhoneMockBalance: string;
  obPhoneMockRecent: string;

  // Footer Content
  footerHelpTitle: string;
  footerHelpSubtitle: string;
  footerPhoneLocal: string;
  footerPhoneInt: string;
  footerFindBranch: string;
  footerCopyright: string;
  footerTerms: string;
  footerPrivacy: string;
  footerSecurity: string;
  
  // Extra tabs translations
  loanCalculatorTitle: string;
  loanAmount: string;
  loanTenure: string;
  loanInterest: string;
  monthlyInstallment: string;
  calculate: string;
  applyNow: string;
  
  cardComparisonTitle: string;
  accountsComparisonTitle: string;
}

export const translations: Record<Language, TranslationDict> = {
  ar: {
    langToggle: 'English',
    branches: 'الفروع والمكاتب',
    contactUs: 'اتصل بنا',
    login: 'دخول',
    personalLogin: 'الأفراد عبر الإنترنت',
    businessLogin: 'الشركات عبر الإنترنت',
    aboutUs: 'من نحن',
    sustainability: 'الاستدامة',
    loyalty: 'برنامج الولاء',
    investor: 'علاقات المستثمرين',
    businessServices: 'خدمات الشركات',
    personalServices: 'خدمات الأفراد',
    searchPlaceholder: 'ابحث عن خدمات، بطاقات، فروع...',
    bankName: 'بنك فلسطين',
    more: 'المزيد',

    navAccounts: 'الحسابات',
    navCampaigns: 'أحدث الحملات',
    navCards: 'البطاقات',
    navLoans: 'القروض والتمويل',
    navElectronic: 'الخدمات الإلكترونية',
    navTransfers: 'التحويلات المالية',

    heroTitle: 'بنك للجميع',
    heroSubtitle: 'نقدم لك حلولاً مصرفية ذكية تواكب تطلعاتك وتضمن أمان معاملاتك اليومية أينما كنت.',
    heroCTA: 'افتح حسابك الآن',

    quickAccounts: 'الحسابات',
    quickCards: 'البطاقات',
    quickLoans: 'القروض والتمويل',
    quickCampaigns: 'أحدث الحملات',
    quickElectronic: 'الخدمات الإلكترونية',

    obTitle: 'الخدمات المصرفية الرقمية',
    obSubtitle: 'تحكّم بأموالك بلمسة زر في أي وقت ومن أي مكان',
    obDescription: 'تمتع بتجربة مصرفية متكاملة وسلسة عبر تطبيق الهواتف الذكية الحائز على جوائز عالمية. أنجز معاملاتك اليومية بأمان وسرعة فائقة.',
    obFeature1Title: 'تحويلات فورية',
    obFeature1Desc: 'أرسل واستقبل الأموال محلياً ودولياً في غضون ثوانٍ وبأقل الرسوم.',
    obFeature2Title: 'دفع الفواتير والخدمات',
    obFeature2Desc: 'سدد التزاماتك ومدفوعاتك الحكومية والخدماتية بنقرة واحدة وبشكل تلقائي.',
    obFeature3Title: 'حماية فائقة الأمان',
    obFeature3Desc: 'تقنيات تشفير متطورة ومصادقة بيومترية تضمن أمن بياناتك وأموالك بشكل مستمر.',
    obPhoneMockTitle: 'تطبيق الخدمات المصرفية',
    obPhoneMockBalance: 'الرصيد المتاح',
    obPhoneMockRecent: 'العمليات الأخيرة',

    footerHelpTitle: 'بحاجة لمساعدة؟ تواصل معنا',
    footerHelpSubtitle: 'فريق الدعم الفني متواجد على مدار الساعة لخدمتك والإجابة على استفساراتك',
    footerPhoneLocal: 'الرقم المحلي: 1700-150-150',
    footerPhoneInt: 'الرقم الدولي: +970 2 2946420',
    footerFindBranch: 'ابحث عن أقرب فرع أو صراف آلي',
    footerCopyright: 'جميع الحقوق محفوظة © 2026 بنك فلسطين.',
    footerTerms: 'الشروط والأحكام',
    footerPrivacy: 'سياسة الخصوصية',
    footerSecurity: 'أمن المعلومات',

    loanCalculatorTitle: 'حاسبة القروض والتمويل',
    loanAmount: 'مبلغ التمويل',
    loanTenure: 'مدة التمويل (بالسنوات)',
    loanInterest: 'نسبة الفائدة السنوية (%)',
    monthlyInstallment: 'القسط الشهري المتوقع',
    calculate: 'احسب التمويل',
    applyNow: 'قدم طلبك الآن',

    cardComparisonTitle: 'قارن بين البطاقات الائتمانية',
    accountsComparisonTitle: 'باقة حساباتنا المصرفية المتميزة',
  },
  en: {
    langToggle: 'العربية',
    branches: 'Branches & Offices',
    contactUs: 'Contact Us',
    login: 'Login',
    personalLogin: 'Personal Online Banking',
    businessLogin: 'Business Online Banking',
    aboutUs: 'About Us',
    sustainability: 'Sustainability',
    loyalty: 'Loyalty Program',
    investor: 'Investor Relations',
    businessServices: 'Business Services',
    personalServices: 'Personal Services',
    searchPlaceholder: 'Search for services, cards, branches...',
    bankName: 'Bank of Palestine',
    more: 'More',

    navAccounts: 'Accounts',
    navCampaigns: 'Latest Campaigns',
    navCards: 'Cards',
    navLoans: 'Loans',
    navElectronic: 'Electronic Services',
    navTransfers: 'Transfers',

    heroTitle: 'Bank for Everyone',
    heroSubtitle: 'Providing smart banking solutions that align with your aspirations and ensure the safety of your daily transactions wherever you are.',
    heroCTA: 'Open Your Account Now',

    quickAccounts: 'Accounts',
    quickCards: 'Cards',
    quickLoans: 'Loans & Financing',
    quickCampaigns: 'Latest Campaigns',
    quickElectronic: 'Electronic Services',

    obTitle: 'Digital Banking Services',
    obSubtitle: 'Control your money with a touch of a button anytime, anywhere',
    obDescription: 'Enjoy an integrated and seamless banking experience through our award-winning mobile application. Complete your daily transactions safely and extremely fast.',
    obFeature1Title: 'Instant Transfers',
    obFeature1Desc: 'Send and receive money locally and internationally within seconds at the lowest rates.',
    obFeature2Title: 'Bill Payments',
    obFeature2Desc: 'Settle your government, utility, and recurring bills with one click automatically.',
    obFeature3Title: 'Advanced Protection',
    obFeature3Desc: 'State-of-the-art encryption technologies and biometric authentication ensure continuous data safety.',
    obPhoneMockTitle: 'Mobile Banking App',
    obPhoneMockBalance: 'Available Balance',
    obPhoneMockRecent: 'Recent Transactions',

    footerHelpTitle: 'Need Help? Contact Us',
    footerHelpSubtitle: 'Our technical support team is available 24/7 to serve you and answer your inquiries',
    footerPhoneLocal: 'Local Number: 1700-150-150',
    footerPhoneInt: 'International: +970 2 2946420',
    footerFindBranch: 'Find Nearest Branch or ATM',
    footerCopyright: 'All Rights Reserved © 2026 Bank of Palestine.',
    footerTerms: 'Terms & Conditions',
    footerPrivacy: 'Privacy Policy',
    footerSecurity: 'Information Security',

    loanCalculatorTitle: 'Loans & Financing Calculator',
    loanAmount: 'Financing Amount',
    loanTenure: 'Financing Tenure (Years)',
    loanInterest: 'Annual Interest Rate (%)',
    monthlyInstallment: 'Expected Monthly Installment',
    calculate: 'Calculate Financing',
    applyNow: 'Apply Now',

    cardComparisonTitle: 'Compare Credit Cards',
    accountsComparisonTitle: 'Our Outstanding Banking Accounts',
  }
};
