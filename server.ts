import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Define Interfaces
interface Product {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  tagline: { ar: string; en: string };
  desc: { ar: string; en: string };
  bullets: { ar: string[]; en: string[] };
  icon?: string;
  category?: string;
}

interface Campaign {
  id: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  badge: { ar: string; en: string };
  image: string;
  link: string;
}

interface Branch {
  id: string;
  name: { ar: string; en: string };
  address: { ar: string; en: string };
  lat: number;
  lng: number;
  hours: { ar: string; en: string };
  phone: string;
}

interface NewsItem {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  date: string;
  desc: { ar: string; en: string };
  content: { ar: string; en: string };
  image: string;
}

interface Lead {
  id: string;
  type: 'contact' | 'newsletter' | 'loan-inquiry' | 'card-inquiry' | 'career';
  timestamp: string;
  data: any;
}

// In-Memory Database (Seeded with standard Bank of Palestine products)
let db = {
  accounts: [
    {
      id: "current",
      slug: "current-account",
      title: { ar: "الحساب الجاري", en: "Current Account" },
      tagline: { ar: "تحكم مرن بمعاملاتك اليومية", en: "Flexible daily banking solutions" },
      desc: { 
        ar: "صمم الحساب الجاري من بنك فلسطين لتلبية احتياجاتك المصرفية اليومية بكل يسر وسهولة. يمنحك الحساب دفتر شيكات، بطاقة خصم مباشر فيزا مقبولة عالمياً، والوصول الفوري لبوابتنا الرقمية.",
        en: "Our Current Account gives you the flexibility to manage your transactions easily with a free visa debit card, cheque book facility, and robust online banking." 
      },
      bullets: {
        ar: ["دفتر شيكات فوري عند فتح الحساب وموافقات سريعة", "بطاقة فيزا للخصم المباشر مقبولة محلياً وعالمياً", "إمكانية السحب على المكشوف لعملاء تحويل الرواتب"],
        en: ["Cheque book issued instantly upon account confirmation", "Visa debit card accepted at millions of merchants globally", "Overdraft privileges available for salaried clients"]
      },
      category: "personal"
    },
    {
      id: "savings",
      slug: "savings-account",
      title: { ar: "حساب التوفير الذكي", en: "Smart Savings Account" },
      tagline: { ar: "نمو مستمر لمدخراتك بأمان تام", en: "High-yield smart savings" },
      desc: { 
        ar: "ابدأ رحلة الادخار وضاعف أرباحك مع فوائد تنافسية متراكمة تُحسب يومياً وتُصرف شهرياً. تمتع بإمكانية السحب والإيداع في أي وقت دون خسارة العوائد المكتسبة.",
        en: "Grow your capital with dynamic competitive interest calculated daily and paid monthly. Save on your own terms with absolute control." 
      },
      bullets: {
        ar: ["عائد سنوي متميز يصل لغاية 4.25% متراكم", "لا توجد رسوم صيانة للحساب أو حد أدنى مرتفع", "إمكانية إعداد أوامر تحويل وتوفير تلقائية دورية"],
        en: ["Premium interest rate up to 4.25% per annum", "Zero monthly maintenance fees or lock-in penalties", "Automated deposit setups to build consistent habits"]
      },
      category: "personal"
    },
    {
      id: "kids-savings",
      slug: "kids-savings",
      title: { ar: "حساب توفير براعم للأطفال", en: "Baraem Kids Savings" },
      tagline: { ar: "أمن مستقبل أطفالك المالي من اليوم", en: "Securing your children's tomorrow" },
      desc: { 
        ar: "برنامج توفير الأطفال 'براعم' من بنك فلسطين يهدف إلى تعليم جيل الغد ثقافة التوفير الذكي مع تقديم هدايا دورية وعوائد مجزية ومكافآت متميزة عند بلوغ مراحل دراسية معينة.",
        en: "Baraem Kids account is tailored to instill healthy savings behaviors early on, offering rewarding gift boosters, premium rates, and educational programs." 
      },
      bullets: {
        ar: ["هدايا وجوائز دورية وسحوبات نقدية طوال العام", "بطاقة صراف مميزة مخصصة وبدون رسوم إصدار لأول مرة", "فوائد ادخارية تفضيلية تضمن نمواً أسرع لمستقبلهم"],
        en: ["Enter seasonal prize drawings and educational scholarships", "Custom personalized debit card for young savers", "Higher interest yields dedicated strictly to youth deposits"]
      },
      category: "personal"
    },
    {
      id: "basic",
      slug: "basic-account",
      title: { ar: "الحساب المصرفي الأساسي", en: "Basic Banking Account" },
      tagline: { ar: "الخدمات المصرفية الأساسية للجميع", en: "Essential banking for everyone" },
      desc: { 
        ar: "نؤمن بالشمول المالي وحق الجميع في الحصول على حساب مصرفي آمن ومنخفض التكلفة للبدء في إجراء معاملاتهم اليومية واستقبال الرواتب دون اشتراط حد أدنى للرصيد.",
        en: "Committed to financial inclusion, our basic account offers essential financial utilities at low cost with no minimum balance thresholds." 
      },
      bullets: {
        ar: ["معفى تماماً من عمولة تدني الرصيد تحت أي ظرف", "بطاقة صراف مجانية لإتمام مشترياتك وسحوباتك اليومية", "الوصول غير المحدود لتطبيق بنك فلسطين المطور مجاناً"],
        en: ["Zero low-balance charges under any circumstances", "Free debit card for essential cash and online purchases", "Unrestricted 24/7 access to Mobile Banking suites"]
      },
      category: "personal"
    }
  ] as Product[],

  loans: [
    {
      id: "personal",
      slug: "personal-loan",
      title: { ar: "القرض الشخصي المرن", en: "Flexible Personal Loan" },
      tagline: { ar: "حقق طموحاتك الآن مع تمويل فوري", en: "Immediate financing for life goals" },
      desc: { 
        ar: "احصل على التمويل الشخصي المناسب لتغطية نفقات السفر، الزواج، التعليم، أو دمج التزاماتك المالية بقسط واحد مخفض وأطول فترة سداد مريحة.",
        en: "Get instant access to funding for travel, weddings, education, or debt consolidation with competitive monthly rates and flexible tenures." 
      },
      bullets: {
        ar: ["تمويل فوري يصل لغاية 100,000 دولار بشروط ميسرة", "فترة سداد مرنة تصل لغاية 84 شهراً لتخفيف الأعباء", "نسبة فائدة متناقصة تفضيلية تبدأ من 4.5% سنوياً"],
        en: ["Financing up to $100,000 with swift approvals", "Flexible tenure up to 84 months to manage cash flow", "Highly competitive reducing interest rates from 4.5%"]
      },
      category: "personal"
    },
    {
      id: "home",
      slug: "home-loan",
      title: { ar: "التمويل العقاري السكني", en: "Residential Home Loan" },
      tagline: { ar: "امتلك بيت الأحلام بتمويل يصل لغاية 100%", en: "Own your dream home today" },
      desc: { 
        ar: "امتلاك منزلك الخاص بات سهلاً بفضل حلول التمويل العقاري المتكاملة من بنك فلسطين. نوفر لك أسعار فائدة ثابتة أو متناقضة مع مرونة تامة تلائم دخلك الشهري.",
        en: "Your dream home is within reach. Benefit from fully integrated mortgage structures, high loan-to-value ratios, and customized payment frequencies." 
      },
      bullets: {
        ar: ["تمويل يصل لغاية 100% من قيمة العقار أو تقدير البناء", "فترة سداد طويلة جداً تصل لغاية 25 سنة براحة تامة", "إمكانية تمويل المغتربين لشراء وتشييد عقاراتهم في وطنهم"],
        en: ["Loan amount up to 100% of property valuation", "Extended repayment tenure up to 25 comfortable years", "Expats programs tailored to buy or build homes back home"]
      },
      category: "personal"
    },
    {
      id: "auto",
      slug: "auto-loan",
      title: { ar: "تمويل سيارة الأحلام", en: "Express Auto Finance" },
      tagline: { ar: "انطلق بسيارة جديدة بفائدة تنافسية", en: "Drive home your dream car" },
      desc: { 
        ar: "اختر سيارتك المفضلة جديدة أو مستعملة واحصل على موافقة تمويلية سريعة خلال ساعات معدودة، مع إمكانية التمويل بدون رهن أو بدون كفيل لعملاء الرواتب.",
        en: "Select any new or certified pre-owned vehicle and lock in rapid approvals with optional zero-collateral options for salaried accounts." 
      },
      bullets: {
        ar: ["تمويل سريع يغطي لغاية 100% من قيمة السيارة", "تمويل بدون كفيل أو رهن إلزامي لعملاء الرواتب", "عروض مميزة وحصرية للسيارات الكهربائية والهجينة البيئية"],
        en: ["Financing up to 100% of purchase price", "No salary pledge or guarantor needed for qualified clients", "Eco-friendly EV and Hybrid preferred rate plans"]
      },
      category: "personal"
    }
  ] as Product[],

  cards: [
    {
      id: "visa-platinum",
      slug: "visa-platinum",
      title: { ar: "فيزا بلاتينيوم الائتمانية", en: "Visa Platinum Credit Card" },
      tagline: { ar: "مستوى متقدم من الرفاهية والمكافآت", en: "Premium travel & lifestyle perks" },
      desc: { 
        ar: "صممت بطاقة فيزا بلاتينيوم لتمنحك قوة شرائية معززة محلياً ودولياً، إلى جانب الدخول المجاني لصالات كبار الشخصيات في المطارات وبرامج تأمين السفر المتكاملة.",
        en: "Crafted for enhanced credit lines, Platinum rewards users with airport lounge access, global concierge benefits, and complimentary travel protection." 
      },
      bullets: {
        ar: ["استرداد نقدي لغاية 2% على كافة مشترياتك الدولية", "دخول مجاني لصالات المطارات الفاخرة حول العالم", "مزايا حماية المشتريات الممتدة والضمان المضاعف"],
        en: ["Earn up to 2% cashback points on foreign spends", "Complimentary access to VIP airport lounges globally", "Extended buyer protection and double warranty benefits"]
      },
      category: "personal"
    },
    {
      id: "visa-signature",
      slug: "visa-signature",
      title: { ar: "فيزا سيغنتشر النخبة", en: "Visa Signature Elite Card" },
      tagline: { ar: "عالم من الامتيازات الحصرية بلا حدود", en: "A world of endless luxuries" },
      desc: { 
        ar: "تعد بطاقة فيزا سيغنتشر بوابتك الفاخرة لتجارب لا تُنسى. استمتع بخدمات المساعد الشخصي (الكونسيرج) على مدار الساعة، خصومات الفنادق العالمية، وتغطيات التأمين الشاملة.",
        en: "Unlock unprecedented visual luxury. Signature treats holders to round-the-clock dedicated concierge assistance, elite hotel rates, and premium insurances." 
      },
      bullets: {
        ar: ["مساعد شخصي مخصص 24/7 لحجز الرحلات والمطاعم", "خصومات حصرية لغاية 50% في أرقى فنادق ومنتجعات العالم", "تأمين سفر طبي وحوادث متكامل ومجاني لك ولعائلتك"],
        en: ["Dedicated 24/7 lifestyle concierge hotline access", "Up to 50% preferred rates at luxury hotels & boutique resorts", "Fully comprehensive travel health & delay insurance wrappers"]
      },
      category: "personal"
    }
  ] as Product[],

  electronicServices: [
    {
      id: "app",
      slug: "mobile-banking",
      title: { ar: "تطبيق بنكي المطور", en: "Banki Next-Gen App" },
      tagline: { ar: "بنكك بالكامل في جيبك بأمان مطلق", en: "Complete financial control on your phone" },
      desc: { 
        ar: "تمتع بأعلى درجات الأمان والتحكم المالي المطلق. سدد الفواتير، تتبع النفقات، وقم بإجراء التحويلات الفورية بأطراف أصابعك ودون مغادرة منزلك.",
        en: "Our state-of-the-art mobile banking application offers total biometric security, quick remittances, and detailed budget analytics anywhere." 
      },
      bullets: {
        ar: ["تسجيل دخول آمن وفوري بالبصمة أو ملامح الوجه", "عرض ومراقبة حدود الإنفاق وبطاقات الائتمان فوراً", "دفع فواتير الخدمات العامة والإنترنت بنقرة واحدة"],
        en: ["Secure biometric instant fingerprint or Face ID access", "Freeze or update card parameters instantly on-the-fly", "Pay internet and government utility invoices in 5 seconds"]
      }
    },
    {
      id: "qr",
      slug: "qr-withdrawal",
      title: { ar: "سحب نقدي بدون بطاقة (QR)", en: "Cardless QR Cash" },
      tagline: { ar: "طريقة أسرع وأكثر أماناً للحصول على الكاش", en: "Forget plastic. Withdraw instantly." },
      desc: { 
        ar: "لا حاجة لحمل بطاقة الصراف المادية بعد الآن! امسح رمز الـ QR الظاهر على شاشة الصراف الآلي عبر تطبيقنا لسحب أموالك فوراً بأمان وسرعة فائقة.",
        en: "Generate a secure cash withdrawal token on your mobile application, scan the code on any Bank of Palestine ATM screen, and collect cash instantly." 
      },
      bullets: {
        ar: ["حماية مطلقة من عمليات نسخ وتزوير البطاقات المادية", "إمكانية إرسال كود سحب لصديق لاستخدامه في الحالات الطارئة", "سرعة تنفيذ عملية السحب تتقلص لأقل من 10 ثوانٍ فقط"],
        en: ["Eliminate traditional credit card skimming concerns completely", "Generate secure one-time withdrawal tokens for friends in need", "Complete safe cash collections in under 10 seconds flat"]
      }
    }
  ] as Product[],

  campaigns: [
    {
      id: "back-to-school",
      title: { ar: "حملة العودة للمدارس: استرداد نقدي 3%", en: "Back to School: 3% Cashback Booster" },
      desc: { 
        ar: "سدد الرسوم المدرسية والجامعية باستخدام أي من بطاقاتنا الائتمانية واحصل على كاش باك فوري بقيمة 3% لتغطية نفقاتك بسعادة.", 
        en: "Settle educational or university tuition invoices using our credit lines and receive an instant 3% cashback rebate." 
      },
      badge: { ar: "حملة حصرية", en: "Exclusive Campaign" },
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
      link: "cards"
    },
    {
      id: "hybrid-cars",
      title: { ar: "تمويل السيارات الصديقة للبيئة بنسبة 3.9%", en: "Go Green: Eco Auto Finance at 3.9%" },
      desc: { 
        ar: "تمتع بتمويل فوري لشراء سيارتك الهجينة أو الكهربائية بنسبة فائدة متناقصة تبدأ من 3.9% وبدون أي عمولات رهن إضافية.", 
        en: "Finance your eco-friendly hybrid or electric vehicle at a preferred 3.9% reducing interest rate with zero registration fees." 
      },
      badge: { ar: "صديق للبيئة", en: "Eco-Friendly" },
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
      link: "loans"
    }
  ] as Campaign[],

  business: {
    accounts: [
      {
        id: "corporate-current",
        slug: "corporate-current",
        title: { ar: "الحساب التجاري للشركات", en: "Corporate Current Account" },
        tagline: { ar: "شريكك في إدارة التدفقات النقدية اليومية", en: "Optimizing enterprise cash flows" },
        desc: { 
          ar: "حساب الشركات من بنك فلسطين يتيح لك إدارة المعاملات المالية الضخمة لشركتك بمرونة عالية، مع توفير خطوط ائتمانية ودفاتر شيكات مخصصة ومديري حسابات خبراء لتسهيل نمو أعمالك.",
          en: "Empower your corporate liquidity. Gain absolute oversight of dynamic business expenses, high-value bulk transfers, and bespoke commercial credit facilities." 
        },
        bullets: {
          ar: ["مدير علاقات عملاء مخصص لتوفير الدعم المصرفي الفوري", "تكامل سلس مع نظام المدفوعات والرواتب الجماعية الإلكتروني", "تسهيلات سحب على المكشوف وتسهيلات تجارية مرنة"],
          en: ["Dedicated Enterprise Relationship Manager for premium assistance", "Bulk corporate payroll execution integration capabilities", "Direct linkages to overdraft lines and working capital injections"]
        },
        category: "business"
      }
    ] as Product[],
    loans: [
      {
        id: "project-finance",
        slug: "project-finance",
        title: { ar: "تمويل المشاريع والتوسع الاستثماري", en: "Project & Capital Expansion Loans" },
        tagline: { ar: "حلق بأعمالك لآفاق جديدة بلا حدود", en: "Funding institutional scale" },
        desc: { 
          ar: "ندعم تطلعات شركتك التوسعية ونوفر قروض تمويل الأصول، وتشييد المنشآت، وشراء المعدات الصناعية بخطط سداد طويلة الأمد وأسعار فائدة تجارية تفضيلية.",
          en: "Partner with our institutional bankers to secure heavy equipment, establish factories, or scale service footprints with attractive commercial terms." 
        },
        bullets: {
          ar: ["هيكلة تمويلية مخصصة تلائم طبيعة تدفقاتك النقدية", "أسعار فائدة منافسة لقطاعات الصناعة، الزراعة والتكنولوجيا", "فترات سماح مرنة تبدأ من 6 أشهر وتصل لسنتين متتاليتين"],
          en: ["Custom structured loans tailored to corporate cash flow cycles", "Preferred pricing metrics for manufacturing, agro, and tech hubs", "Grace periods available up to 24 months to ensure operational stability"]
        },
        category: "business"
      }
    ] as Product[],
    cards: [
      {
        id: "visa-corporate",
        slug: "visa-corporate",
        title: { ar: "فيزا الشركات الائتمانية", en: "Visa Corporate Purchasing Card" },
        tagline: { ar: "إدارة ومراقبة كاملة لمصاريف موظفيك", en: "Simplify company spends" },
        desc: { 
          ar: "قم بتبسيط ومتابعة نفقات ومصاريف السفر والعمل لموظفيك. تتيح لك بطاقة فيزا الشركات وضع حدود إنفاق منفصلة واستخراج تقارير تحليلية شاملة للحد من الهدر.",
          en: "Consolidate official traveling and entertainment expenses easily. Allocate custom parameters per employee and synthesize centralized analytics." 
        },
        bullets: {
          ar: ["وضع حد إنفاق مخصص لكل بطاقة وموظف بشكل مستقل", "تقارير مالية دورية مدمجة مع الأنظمة المحاسبية للشركة", "تأمين سفر تجاري متكامل يحمي موظفيك أثناء السفر"],
          en: ["Set strict individual card limitations from a single master dashboard", "Robust API downloads mapped directly into SAP, Oracle, or QuickBooks", "Corporate travel insurance bundles included free of charge"]
        },
        category: "business"
      }
    ] as Product[],
    electronicServices: [
      {
        id: "online-corp",
        slug: "corporate-online",
        title: { ar: "بوابة الشركات المصرفية الإلكترونية", en: "Corporate Online Banking Suite" },
        tagline: { ar: "منصة آمنة ومتكاملة لإدارة أعمالك 24/7", en: "Enterprise treasury in one secure screen" },
        desc: { 
          ar: "تحكم بخزينة شركتك وأجرِ التحويلات الجماعية للرواتب والشركاء التجاريين محلياً ودولياً، مع نظام حوكمة متعدد الصلاحيات لاعتماد وتدقيق المعاملات المصرفية.",
          en: "Take command of corporate treasury. Authorize global wire workflows, process commercial tax levies, and execute massive payouts safely with multi-tiered approvals." 
        },
        bullets: {
          ar: ["نظام حوكمة متطور يتطلب اعتماد ثنائي أو ثلاثي للعمليات", "تحويل فوري ومجدول لرواتب الموظفين بنقرة واحدة", "تصدير فوري لكشوفات الحساب بصيغ متعددة MT940, CSV"],
          en: ["Dual-factor token validations and multi-level approval matrixes", "Process instantaneous staff salaries through encrypted SFTP lines", "Export files in standardized legacy formats like MT940 or Excel"]
        }
      }
    ] as Product[],
    transfers: [
      {
        id: "b2b-remittance",
        title: { ar: "الحوالات التجارية الدولية السريعة", en: "High-Value Corporate SWIFT" },
        tagline: { ar: "أسرع قنوات تحويل لتجارتك الدولية", en: "Remitting across borders with speed" },
        desc: { 
          ar: "أرسل واستقبل مستحقات شركتك الخارجية بأمان وبشراكة مع أوسع شبكة بنوك مراسلة حول العالم، مع ميزة التتبع اللحظي الحية لحوالاتك المصرفية.",
          en: "Execute international import/export wires seamlessly via SWIFT GPI, backed by a robust global correspondent banking network." 
        },
        bullets: {
          ar: ["تأكيد فوري بالوصول وتتبع لحظي عبر بوابة الشركات", "أسعار تفضيلية خاصة لتحويل العملات للشركات ذات الأحجام الكبيرة", "توافق تام وأمان مطلق مع معايير مكافحة غسيل الأموال"],
          en: ["Direct real-time status notifications for critical supplier payments", "Volume-based preferential exchange margins for cross-border conversions", "Automated compliance pre-screenings to ensure seamless routings"]
        }
      }
    ] as any[],
    campaigns: [
      {
        id: "sme-grow",
        title: { ar: "حملة تمويل المنشآت الصغيرة وعوائد تشجيعية", en: "SME Growth Accelerator Package" },
        desc: { 
          ar: "ندعم قطاع المنشآت الصغيرة والمتوسطة بفائدة تفضيلية منخفضة لتمكينهم من تطوير أعمالهم وزيادة مبيعاتهم وتوسيع كوادرهم.", 
          en: "Elevate your enterprise structure. Capitalize on subsidized lending rates, business advisory clinics, and credit lines designed for SMEs." 
        },
        badge: { ar: "دعم مالي", en: "SME Boost" },
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop",
        link: "loans"
      }
    ] as Campaign[]
  },

  branches: [
    {
      id: "ramallah-main",
      name: { ar: "الفرع الرئيسي - رام الله", en: "Ramallah Main Branch" },
      address: { ar: "شارع الإرسال، مقابل برج فلسطين، رام الله", en: "Al-Irsal Street, Opp Palestine Tower, Ramallah" },
      lat: 31.9061,
      lng: 35.2035,
      hours: { ar: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً", en: "Sunday - Thursday: 8:30 AM - 3:00 PM" },
      phone: "+970-2-2946420"
    },
    {
      id: "gaza-main",
      name: { ar: "الفرع الرئيسي - غزة", en: "Gaza Main Branch" },
      address: { ar: "شارع عمر المختار، غزة", en: "Omar Al-Mukhtar Street, Gaza" },
      lat: 31.5016,
      lng: 34.4668,
      hours: { ar: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً", en: "Sunday - Thursday: 8:30 AM - 3:00 PM" },
      phone: "+970-8-2880150"
    },
    {
      id: "nablus",
      name: { ar: "فرع نابلس - وسط البلد", en: "Nablus Center Branch" },
      address: { ar: "الدوار الرئيسي، شارع فيصل، نابلس", en: "Main Square, Faisal Street, Nablus" },
      lat: 32.2227,
      lng: 35.2621,
      hours: { ar: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً", en: "Sunday - Thursday: 8:30 AM - 3:00 PM" },
      phone: "+970-9-2345600"
    },
    {
      id: "hebron",
      name: { ar: "فرع الخليل - عين سارة", en: "Hebron Ain Sara Branch" },
      address: { ar: "شارع عين سارة، الخليل", en: "Ain Sara Street, Hebron" },
      lat: 31.5326,
      lng: 35.0998,
      hours: { ar: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً", en: "Sunday - Thursday: 8:30 AM - 3:00 PM" },
      phone: "+970-2-2228500"
    }
  ] as Branch[],

  exchangeRates: [
    { currency: "USD/JOD", buy: 0.7085, sell: 0.7095, change: 0.00 },
    { currency: "USD/ILS", buy: 3.6250, sell: 3.6550, change: 0.24 },
    { currency: "EUR/ILS", buy: 3.9210, sell: 3.9780, change: -0.15 },
    { currency: "JOD/ILS", buy: 5.1150, sell: 5.1600, change: 0.08 },
    { currency: "EUR/USD", buy: 1.0820, sell: 1.0890, change: -0.05 }
  ],

  news: [
    {
      id: "news-1",
      slug: "sustainable-bop",
      title: { 
        ar: "بنك فلسطين يتصدر قائمة البنوك المستدامة الصديقة للبيئة في فلسطين", 
        en: "Bank of Palestine tops local ESG and Green Finance lists" 
      },
      date: "2026-06-25",
      desc: {
        ar: "حاز بنك فلسطين على المرتبة الأولى في تمويل المشاريع الخضراء والطاقة البديلة تماشياً مع رؤيته للاستدامة البيئية والمسؤولية الاجتماعية والمجتمعية.",
        en: "Bank of Palestine achieves prime honors in sustainable project funding, reflecting its deep ESG commitment."
      },
      content: {
        ar: "في خطوة رائدة تكرس التزامنا بحماية الكوكب وتأمين غدٍ أكثر إشراقاً لأجيالنا القادمة، أعلن بنك فلسطين عن حزمة استثمارية ضخمة لتمويل محطات الطاقة الشمسية وتقديم تمويلات تفضيلية ميسرة لشراء المركبات الصديقة للبيئة، مؤكداً ريادته كبنك الكل الذي يدعم فلسطين الحبيبة أرضاً وشعباً.",
        en: "In a pioneer stride consolidating our deep duties towards protecting our environment and building prosperous futures, Bank of Palestine unveiled major eco-loans and sustainable corporate treasury funds dedicated to local solar and clean transit portfolios."
      },
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "news-2",
      slug: "digital-banki-launch",
      title: {
        ar: "إطلاق الميزات الذكية الجديدة على تطبيق 'بنكي' لتسهيل التحويلات الفورية",
        en: "New AI smart modules rolled out on Banki application"
      },
      date: "2026-06-12",
      desc: {
        ar: "أعلن البنك عن إطلاق ميزات مبتكرة تتيح التحويل السريع وفتح الحسابات الرقمية بنقرة واحدة وتتبع المصاريف آلياً.",
        en: "We are proud to introduce zero-friction payment gateways, automatic budgeting, and immediate remote accounts."
      },
      content: {
        ar: "تماشياً مع استراتيجيتنا للتحول الرقمي المستمر وتقديم أفضل الخدمات التكنولوجية لزبائننا، أعلن القسم التقني في بنك فلسطين عن تحديث شامل لتطبيق الهواتف الذكية يتضمن آليات حماية بيومترية متطورة، والمطابقة الفورية للحوالات المحلية دون رسوم إضافية.",
        en: "Consolidating our digital-first strategies, the Innovation core at Bank of Palestine updated its customer systems with multi-biometric gates, zero-fee fast domestic remittances, and secure interactive chat bots."
      },
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop"
    }
  ] as NewsItem[],

  about: {
    history: {
      ar: "تأسس بنك فلسطين عام 1960 كأول بنك وطني فلسطيني يسعى لتقديم خدمات مصرفية رائدة تنهض بالاقتصاد المحلي وتمكن شعبنا العظيم من بناء مستقبله بأمان تام.",
      en: "Established in 1960, Bank of Palestine is the first national banking pillar, serving generations and actively growing local economies with pride."
    },
    governance: {
      ar: "نلتزم بأعلى معايير الإدارة والمراقبة والشفافية وحماية المودعين، متبعين توجيهات سلطة النقد الفلسطينية والمعايير المصرفية الدولية بازل.",
      en: "Governed under maximum global standards, we preserve customer trust with strong risk mitigations, full compliance, and solid values."
    },
    sustainability: {
      ar: "نخصص سنوياً ما يعادل 5% من أرباحنا الصافية لدعم برامج الاستدامة، التعليم، تمكين المرأة، الرعاية الصحية، والمبادرات الشبابية في ربوع الوطن.",
      en: "We dedicate 5% of net yearly profits to community support, women empowerment, ecological sustainability, and youth scholarships."
    }
  },

  leads: [] as Lead[]
};

// Create Express Application
const app = express();
const PORT = 3000;

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic Logging & Delay Simulation for high-fidelity feel
app.use((req, res, next) => {
  console.log(`[API ${new Date().toISOString().split('T')[1].substring(0, 8)}] ${req.method} ${req.url}`);
  next();
});

// ========================================================
// 1. PUBLIC READ-ONLY CONTENT ENDPOINTS
// ========================================================

// GET accounts (with category filtering)
app.get("/api/accounts", (req, res) => {
  const cat = req.query.category as string || "personal";
  if (cat === "business") {
    return res.json(db.business.accounts);
  }
  res.json(db.accounts);
});

app.get("/api/accounts/:slug", (req, res) => {
  const { slug } = req.params;
  const item = db.accounts.find(a => a.slug === slug) || db.business.accounts.find(a => a.slug === slug);
  if (!item) return res.status(404).json({ error: "Account type not found" });
  res.json(item);
});

// GET loans
app.get("/api/loans", (req, res) => {
  const cat = req.query.category as string || "personal";
  if (cat === "business") {
    return res.json(db.business.loans);
  }
  res.json(db.loans);
});

app.get("/api/loans/:slug", (req, res) => {
  const { slug } = req.params;
  const item = db.loans.find(l => l.slug === slug) || db.business.loans.find(l => l.slug === slug);
  if (!item) return res.status(404).json({ error: "Loan product not found" });
  res.json(item);
});

// GET cards
app.get("/api/cards", (req, res) => {
  const cat = req.query.category as string || "personal";
  if (cat === "business") {
    return res.json(db.business.cards);
  }
  res.json(db.cards);
});

app.get("/api/cards/:slug", (req, res) => {
  const { slug } = req.params;
  const item = db.cards.find(c => c.slug === slug) || db.business.cards.find(c => c.slug === slug);
  if (!item) return res.status(404).json({ error: "Card product not found" });
  res.json(item);
});

// GET digital e-services
app.get("/api/electronic-services", (req, res) => {
  const cat = req.query.category as string || "personal";
  if (cat === "business") {
    return res.json(db.business.electronicServices);
  }
  res.json(db.electronicServices);
});

app.get("/api/electronic-services/:slug", (req, res) => {
  const { slug } = req.params;
  const item = db.electronicServices.find(e => e.slug === slug) || db.business.electronicServices.find(e => e.slug === slug);
  if (!item) return res.status(404).json({ error: "Digital service not found" });
  res.json(item);
});

// GET transfers
app.get("/api/transfers", (req, res) => {
  const cat = req.query.category as string || "personal";
  if (cat === "business") {
    return res.json(db.business.transfers);
  }
  res.json([
    {
      id: "local",
      title: { ar: "التحويل المحلي الفوري", en: "Local Instant Wire" },
      tagline: { ar: "تحويل فوري فائق الأمان ومجاني", en: "Instant local wires with zero fees" },
      desc: { ar: "أرسل واستقبل الأموال محلياً وبشكل فوري لأي بنك عامل في فلسطين دون عمولات إضافية.", en: "Wire cash instantly across Palestine over the unified central remittance grid." },
      bullets: { ar: ["منفذ بالكامل في أقل من 10 ثوانٍ", "بدون أي رسوم تذكر لكافة العملاء", "متوفر على مدار الساعة طيلة أيام الأسبوع"], en: ["Settled inside 10 seconds flat", "Completely free of charge for retail profiles", "Accessible 24/7/365 through 'Banki' system"] }
    }
  ]);
});

// GET campaigns
app.get("/api/campaigns", (req, res) => {
  const cat = req.query.category as string || "personal";
  if (cat === "business") {
    return res.json(db.business.campaigns);
  }
  res.json(db.campaigns);
});

// GET branch networks
app.get("/api/branches", (req, res) => {
  res.json(db.branches);
});

app.get("/api/branches/:id", (req, res) => {
  const branch = db.branches.find(b => b.id === req.params.id);
  if (!branch) return res.status(404).json({ error: "Branch not found" });
  res.json(branch);
});

// GET currency exchange rates
app.get("/api/exchange-rates", (req, res) => {
  res.json(db.exchangeRates);
});

// GET news
app.get("/api/news", (req, res) => {
  res.json(db.news);
});

app.get("/api/news/:slug", (req, res) => {
  const article = db.news.find(n => n.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "News article not found" });
  res.json(article);
});

// GET about static metadata
app.get("/api/about", (req, res) => {
  res.json(db.about);
});


// ========================================================
// 2. PRODUCT COMPARISON ENGINE (side-by-side)
// ========================================================
app.post("/api/compare", (req, res) => {
  const { type, ids } = req.body;
  if (!type || !Array.isArray(ids)) {
    return res.status(400).json({ error: "Invalid payload parameters. Need type and ids array." });
  }

  let sourcePool: Product[] = [];
  if (type === "accounts") {
    sourcePool = [...db.accounts, ...db.business.accounts];
  } else if (type === "loans") {
    sourcePool = [...db.loans, ...db.business.loans];
  } else if (type === "cards") {
    sourcePool = [...db.cards, ...db.business.cards];
  }

  // Filter up to 3 requested entries
  const matched = sourcePool.filter(item => ids.includes(item.id)).slice(0, 3);
  res.json(matched);
});


// ========================================================
// 3. PUBLIC WRITE ENDPOINTS (Lead Capture, Newsletter, Careers)
// ========================================================

// POST general contact
app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required contact details (name, email, message)." });
  }

  const newLead: Lead = {
    id: `c-${Date.now()}`,
    type: 'contact',
    timestamp: new Date().toISOString(),
    data: { name, email, phone, subject, message }
  };
  db.leads.push(newLead);
  res.json({ success: true, message: "Contact feedback submitted successfully", id: newLead.id });
});

// POST newsletter subscription
app.post("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  const newLead: Lead = {
    id: `n-${Date.now()}`,
    type: 'newsletter',
    timestamp: new Date().toISOString(),
    data: { email }
  };
  db.leads.push(newLead);
  res.json({ success: true, message: "Subscribed to newsletter updates", id: newLead.id });
});

// POST loan inquiry
app.post("/api/loan-inquiry", (req, res) => {
  const { loanType, name, phone, email, preferredBranch } = req.body;
  if (!loanType || !name || !phone) {
    return res.status(400).json({ error: "Missing required inquiry coordinates (loanType, name, phone)." });
  }

  const newLead: Lead = {
    id: `l-${Date.now()}`,
    type: 'loan-inquiry',
    timestamp: new Date().toISOString(),
    data: { loanType, name, phone, email, preferredBranch }
  };
  db.leads.push(newLead);
  res.json({ success: true, message: "Loan inquiry registered. No actual loan is processed.", id: newLead.id });
});

// POST card inquiry
app.post("/api/card-inquiry", (req, res) => {
  const { cardType, name, phone, email } = req.body;
  if (!cardType || !name || !phone) {
    return res.status(400).json({ error: "Missing required credit coordinates (cardType, name, phone)." });
  }

  const newLead: Lead = {
    id: `card-${Date.now()}`,
    type: 'card-inquiry',
    timestamp: new Date().toISOString(),
    data: { cardType, name, phone, email }
  };
  db.leads.push(newLead);
  res.json({ success: true, message: "Card request logged into CRM queue.", id: newLead.id });
});

// POST careers apply (graceful multipart-like simulated handler)
app.post("/api/careers/apply", (req, res) => {
  const { name, email, position, resumeFile } = req.body;
  if (!name || !email || !position) {
    return res.status(400).json({ error: "Missing candidate coordinates (name, email, position)." });
  }

  const newLead: Lead = {
    id: `car-${Date.now()}`,
    type: 'career',
    timestamp: new Date().toISOString(),
    data: { name, email, position, resumeName: resumeFile || "Simulated_Resume_Doc.pdf" }
  };
  db.leads.push(newLead);
  res.json({ success: true, message: "Job application submitted successfully.", id: newLead.id });
});


// ========================================================
// 4. SMART MULTI-INDEX SEARCH
// ========================================================
app.get("/api/search", (req, res) => {
  const q = (req.query.q as string || "").toLowerCase().trim();
  const lang = (req.query.lang as string || "ar") === "en" ? "en" : "ar";

  if (!q) return res.json([]);

  const results: any[] = [];

  // Helper matching function
  const match = (text: string) => text.toLowerCase().includes(q);

  // Search Personal Accounts
  db.accounts.forEach(acc => {
    if (match(acc.title[lang]) || match(acc.tagline[lang]) || match(acc.desc[lang]) || acc.bullets[lang].some(b => match(b))) {
      results.push({ type: "accounts", id: acc.id, title: acc.title[lang], desc: acc.tagline[lang], page: "accounts" });
    }
  });

  // Search Personal Loans
  db.loans.forEach(loan => {
    if (match(loan.title[lang]) || match(loan.tagline[lang]) || match(loan.desc[lang]) || loan.bullets[lang].some(b => match(b))) {
      results.push({ type: "loans", id: loan.id, title: loan.title[lang], desc: loan.tagline[lang], page: "loans" });
    }
  });

  // Search Personal Cards
  db.cards.forEach(card => {
    if (match(card.title[lang]) || match(card.tagline[lang]) || match(card.desc[lang]) || card.bullets[lang].some(b => match(b))) {
      results.push({ type: "cards", id: card.id, title: card.title[lang], desc: card.tagline[lang], page: "cards" });
    }
  });

  // Search News
  db.news.forEach(art => {
    if (match(art.title[lang]) || match(art.desc[lang]) || match(art.content[lang])) {
      results.push({ type: "news", id: art.slug, title: art.title[lang], desc: art.desc[lang], page: "home" });
    }
  });

  res.json(results);
});


// ========================================================
// 5. LOCALE STRINGS API
// ========================================================
app.get("/api/locale/:lang", (req, res) => {
  const { lang } = req.params;
  const strings = {
    ar: {
      bankName: "بنك فلسطين",
      tagline: "بنك الكل - خدمات مصرفية ذكية برؤية فلسطينية أصيلة",
      login: "دخول آمن",
      home: "الرئيسية",
      accounts: "الحسابات",
      loans: "القروض والتمويل",
      cards: "البطاقات",
      electronic: "الخدمات الإلكترونية",
      transfers: "الحوالات والصرف"
    },
    en: {
      bankName: "Bank of Palestine",
      tagline: "Bank for Everyone - Smart Financial Ecosystems built with local warmth",
      login: "Secure Login",
      home: "Home",
      accounts: "Accounts",
      loans: "Loans & Finance",
      cards: "Cards",
      electronic: "E-Services",
      transfers: "Remittances"
    }
  };

  const selected = lang === "en" ? strings.en : strings.ar;
  res.json(selected);
});


// ========================================================
// 6. PROTECTED CONTENT EDITOR / STAFF ADMIN CMS ENDPOINTS
// ========================================================

// Simulated staff credentials
const ADMIN_USER = "staff_editor";
const ADMIN_PASS = "Palestine2026!";

// POST admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: "BoP-Editor-CMS-Secured-Token-2026" });
  } else {
    res.status(401).json({ error: "Invalid staff editor credentials" });
  }
});

// GET CMS submitted inquiry leads (secured for internal reporting)
app.get("/api/admin/leads", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied. Internal staff privileges only." });
  }
  res.json(db.leads);
});

// POST/PUT/DELETE product configurations
app.post("/api/admin/products/:type", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }

  const { type } = req.params;
  const payload = req.body;

  if (type === "accounts") {
    db.accounts.push(payload);
  } else if (type === "loans") {
    db.loans.push(payload);
  } else if (type === "cards") {
    db.cards.push(payload);
  } else {
    return res.status(400).json({ error: "Unsupported product index" });
  }

  res.json({ success: true, message: "Entry initialized successfully" });
});

app.put("/api/admin/products/:type/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }

  const { type, id } = req.params;
  const payload = req.body;

  let pool: any[] = [];
  if (type === "accounts") pool = db.accounts;
  else if (type === "loans") pool = db.loans;
  else if (type === "cards") pool = db.cards;

  const index = pool.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ error: "Item not spotted in database" });

  pool[index] = { ...pool[index], ...payload };
  res.json({ success: true, message: "Record modified in real-time.", item: pool[index] });
});

app.delete("/api/admin/products/:type/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }

  const { type, id } = req.params;
  if (type === "accounts") {
    db.accounts = db.accounts.filter(a => a.id !== id);
  } else if (type === "loans") {
    db.loans = db.loans.filter(l => l.id !== id);
  } else if (type === "cards") {
    db.cards = db.cards.filter(c => c.id !== id);
  } else {
    return res.status(400).json({ error: "Target type undefined" });
  }

  res.json({ success: true, message: "Product deleted from index successfully." });
});

// POST/PUT/DELETE campaigns
app.post("/api/admin/campaigns", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }
  db.campaigns.push(req.body);
  res.json({ success: true, message: "Campaign created." });
});

app.put("/api/admin/campaigns/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }
  const idx = db.campaigns.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Campaign not found" });
  db.campaigns[idx] = { ...db.campaigns[idx], ...req.body };
  res.json({ success: true, message: "Campaign updated." });
});

app.delete("/api/admin/campaigns/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }
  db.campaigns = db.campaigns.filter(c => c.id !== req.params.id);
  res.json({ success: true, message: "Campaign removed." });
});

// POST/PUT/DELETE branches
app.post("/api/admin/branches", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }
  db.branches.push(req.body);
  res.json({ success: true, message: "Branch added." });
});

app.put("/api/admin/branches/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }
  const idx = db.branches.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Branch not found" });
  db.branches[idx] = { ...db.branches[idx], ...req.body };
  res.json({ success: true, message: "Branch updated." });
});

app.delete("/api/admin/branches/:id", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes("BoP-Editor-CMS-Secured-Token-2026")) {
    return res.status(403).json({ error: "Access Denied" });
  }
  db.branches = db.branches.filter(b => b.id !== req.params.id);
  res.json({ success: true, message: "Branch removed." });
});


// ========================================================
// 7. VITE MIDDLEWARE AND SPA FALLBACK
// ========================================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite Dev Server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000 },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted successfully.");
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production build static server initialized.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BOP SERVER] Server booted at http://localhost:${PORT}`);
  });
}

startServer();
