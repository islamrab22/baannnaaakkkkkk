import "dotenv/config";
import { PrismaClient, ProductGroup, Segment, ContentStatus } from "@prisma/client";
import { hashPassword } from "../server/utils/password.ts";

const prisma = new PrismaClient();

interface SeedProduct {
  slug: string;
  group: ProductGroup;
  segment: Segment;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descAr: string;
  descEn: string;
  bulletsAr: string[];
  bulletsEn: string[];
}

const products: SeedProduct[] = [
  {
    slug: "current-account",
    group: ProductGroup.ACCOUNT,
    segment: Segment.PERSONAL,
    titleAr: "الحساب الجاري",
    titleEn: "Current Account",
    taglineAr: "تحكم مرن بمعاملاتك اليومية",
    taglineEn: "Flexible daily banking solutions",
    descAr: "صمم الحساب الجاري من بنك فلسطين لتلبية احتياجاتك المصرفية اليومية بكل يسر وسهولة. يمنحك الحساب دفتر شيكات، بطاقة خصم مباشر فيزا مقبولة عالمياً، والوصول الفوري لبوابتنا الرقمية.",
    descEn: "Our Current Account gives you the flexibility to manage your transactions easily with a free visa debit card, cheque book facility, and robust online banking.",
    bulletsAr: ["دفتر شيكات فوري عند فتح الحساب وموافقات سريعة", "بطاقة فيزا للخصم المباشر مقبولة محلياً وعالمياً", "إمكانية السحب على المكشوف لعملاء تحويل الرواتب"],
    bulletsEn: ["Cheque book issued instantly upon account confirmation", "Visa debit card accepted at millions of merchants globally", "Overdraft privileges available for salaried clients"],
  },
  {
    slug: "savings-account",
    group: ProductGroup.ACCOUNT,
    segment: Segment.PERSONAL,
    titleAr: "حساب التوفير الذكي",
    titleEn: "Smart Savings Account",
    taglineAr: "نمو مستمر لمدخراتك بأمان تام",
    taglineEn: "High-yield smart savings",
    descAr: "ابدأ رحلة الادخار وضاعف أرباحك مع فوائد تنافسية متراكمة تُحسب يومياً وتُصرف شهرياً.",
    descEn: "Grow your capital with dynamic competitive interest calculated daily and paid monthly.",
    bulletsAr: ["عائد سنوي متميز يصل لغاية 4.25% متراكم", "لا توجد رسوم صيانة للحساب أو حد أدنى مرتفع", "إمكانية إعداد أوامر تحويل وتوفير تلقائية دورية"],
    bulletsEn: ["Premium interest rate up to 4.25% per annum", "Zero monthly maintenance fees or lock-in penalties", "Automated deposit setups to build consistent habits"],
  },
  {
    slug: "kids-savings",
    group: ProductGroup.ACCOUNT,
    segment: Segment.PERSONAL,
    titleAr: "حساب توفير براعم للأطفال",
    titleEn: "Baraem Kids Savings",
    taglineAr: "أمن مستقبل أطفالك المالي من اليوم",
    taglineEn: "Securing your children's tomorrow",
    descAr: "برنامج توفير الأطفال 'براعم' من بنك فلسطين يهدف إلى تعليم جيل الغد ثقافة التوفير الذكي.",
    descEn: "Baraem Kids account is tailored to instill healthy savings behaviors early on.",
    bulletsAr: ["هدايا وجوائز دورية وسحوبات نقدية طوال العام", "بطاقة صراف مميزة مخصصة وبدون رسوم إصدار لأول مرة", "فوائد ادخارية تفضيلية تضمن نمواً أسرع لمستقبلهم"],
    bulletsEn: ["Enter seasonal prize drawings and educational scholarships", "Custom personalized debit card for young savers", "Higher interest yields dedicated strictly to youth deposits"],
  },
  {
    slug: "corporate-current",
    group: ProductGroup.ACCOUNT,
    segment: Segment.BUSINESS,
    titleAr: "الحساب التجاري للشركات",
    titleEn: "Corporate Current Account",
    taglineAr: "شريكك في إدارة التدفقات النقدية اليومية",
    taglineEn: "Optimizing enterprise cash flows",
    descAr: "حساب الشركات من بنك فلسطين يتيح لك إدارة المعاملات المالية الضخمة لشركتك بمرونة عالية.",
    descEn: "Empower your corporate liquidity with dynamic business expense oversight.",
    bulletsAr: ["مدير علاقات عملاء مخصص لتوفير الدعم المصرفي الفوري", "تكامل سلس مع نظام المدفوعات والرواتب الجماعية الإلكتروني", "تسهيلات سحب على المكشوف وتسهيلات تجارية مرنة"],
    bulletsEn: ["Dedicated Enterprise Relationship Manager for premium assistance", "Bulk corporate payroll execution integration", "Direct linkages to overdraft lines and working capital"],
  },
  {
    slug: "personal-loan",
    group: ProductGroup.LOAN,
    segment: Segment.PERSONAL,
    titleAr: "القرض الشخصي المرن",
    titleEn: "Flexible Personal Loan",
    taglineAr: "حقق طموحاتك الآن مع تمويل فوري",
    taglineEn: "Immediate financing for life goals",
    descAr: "احصل على التمويل الشخصي المناسب لتغطية نفقات السفر، الزواج، التعليم، أو دمج التزاماتك المالية.",
    descEn: "Get instant access to funding for travel, weddings, education, or debt consolidation.",
    bulletsAr: ["تمويل فوري يصل لغاية 100,000 دولار بشروط ميسرة", "فترة سداد مرنة تصل لغاية 84 شهراً لتخفيف الأعباء", "نسبة فائدة متناقصة تفضيلية تبدأ من 4.5% سنوياً"],
    bulletsEn: ["Financing up to $100,000 with swift approvals", "Flexible tenure up to 84 months", "Competitive reducing interest rates from 4.5%"],
  },
  {
    slug: "home-loan",
    group: ProductGroup.LOAN,
    segment: Segment.PERSONAL,
    titleAr: "التمويل العقاري السكني",
    titleEn: "Residential Home Loan",
    taglineAr: "امتلك بيت الأحلام بتمويل يصل لغاية 100%",
    taglineEn: "Own your dream home today",
    descAr: "امتلاك منزلك الخاص بات سهلاً بفضل حلول التمويل العقاري المتكاملة من بنك فلسطين.",
    descEn: "Your dream home is within reach with fully integrated mortgage structures.",
    bulletsAr: ["تمويل يصل لغاية 100% من قيمة العقار أو تقدير البناء", "فترة سداد طويلة جداً تصل لغاية 25 سنة براحة تامة", "إمكانية تمويل المغتربين لشراء وتشييد عقاراتهم"],
    bulletsEn: ["Loan amount up to 100% of property valuation", "Extended repayment tenure up to 25 years", "Expat programs tailored to buy or build homes"],
  },
  {
    slug: "auto-loan",
    group: ProductGroup.LOAN,
    segment: Segment.PERSONAL,
    titleAr: "تمويل سيارة الأحلام",
    titleEn: "Express Auto Finance",
    taglineAr: "انطلق بسيارة جديدة بفائدة تنافسية",
    taglineEn: "Drive home your dream car",
    descAr: "اختر سيارتك المفضلة جديدة أو مستعملة واحصل على موافقة تمويلية سريعة خلال ساعات معدودة.",
    descEn: "Select any new or certified pre-owned vehicle and lock in rapid approvals.",
    bulletsAr: ["تمويل سريع يغطي لغاية 100% من قيمة السيارة", "تمويل بدون كفيل أو رهن إلزامي لعملاء الرواتب", "عروض مميزة وحصرية للسيارات الكهربائية والهجينة"],
    bulletsEn: ["Financing up to 100% of purchase price", "No guarantor needed for qualified clients", "Eco-friendly EV and Hybrid preferred rate plans"],
  },
  {
    slug: "project-finance",
    group: ProductGroup.LOAN,
    segment: Segment.BUSINESS,
    titleAr: "تمويل المشاريع والتوسع الاستثماري",
    titleEn: "Project & Capital Expansion Loans",
    taglineAr: "حلق بأعمالك لآفاق جديدة بلا حدود",
    taglineEn: "Funding institutional scale",
    descAr: "ندعم تطلعات شركتك التوسعية ونوفر قروض تمويل الأصول وتشييد المنشآت.",
    descEn: "Partner with our institutional bankers to secure heavy equipment and scale operations.",
    bulletsAr: ["هيكلة تمويلية مخصصة تلائم طبيعة تدفقاتك النقدية", "أسعار فائدة منافسة لقطاعات الصناعة، الزراعة والتكنولوجيا", "فترات سماح مرنة تبدأ من 6 أشهر"],
    bulletsEn: ["Custom structured loans tailored to cash flow cycles", "Preferred pricing for manufacturing, agro, and tech hubs", "Grace periods up to 24 months"],
  },
  {
    slug: "visa-platinum",
    group: ProductGroup.CARD,
    segment: Segment.PERSONAL,
    titleAr: "فيزا بلاتينيوم الائتمانية",
    titleEn: "Visa Platinum Credit Card",
    taglineAr: "مستوى متقدم من الرفاهية والمكافآت",
    taglineEn: "Premium travel & lifestyle perks",
    descAr: "صممت بطاقة فيزا بلاتينيوم لتمنحك قوة شرائية معززة محلياً ودولياً.",
    descEn: "Crafted for enhanced credit lines, Platinum rewards airport lounge access.",
    bulletsAr: ["استرداد نقدي لغاية 2% على كافة مشترياتك الدولية", "دخول مجاني لصالات المطارات الفاخرة حول العالم", "مزايا حماية المشتريات الممتدة والضمان المضاعف"],
    bulletsEn: ["Earn up to 2% cashback on foreign spends", "Complimentary access to VIP airport lounges", "Extended buyer protection and double warranty"],
  },
  {
    slug: "visa-signature",
    group: ProductGroup.CARD,
    segment: Segment.PERSONAL,
    titleAr: "فيزا سيغنتشر النخبة",
    titleEn: "Visa Signature Elite Card",
    taglineAr: "عالم من الامتيازات الحصرية بلا حدود",
    taglineEn: "A world of endless luxuries",
    descAr: "تعد بطاقة فيزا سيغنتشر بوابتك الفاخرة لتجارب لا تُنسى.",
    descEn: "Unlock unprecedented luxury with round-the-clock concierge assistance.",
    bulletsAr: ["مساعد شخصي مخصص 24/7 لحجز الرحلات والمطاعم", "خصومات حصرية لغاية 50% في أرقى فنادق ومنتجعات العالم", "تأمين سفر طبي وحوادث متكامل ومجاني"],
    bulletsEn: ["Dedicated 24/7 lifestyle concierge", "Up to 50% preferred rates at luxury hotels", "Comprehensive travel health & delay insurance"],
  },
  {
    slug: "visa-corporate",
    group: ProductGroup.CARD,
    segment: Segment.BUSINESS,
    titleAr: "فيزا الشركات الائتمانية",
    titleEn: "Visa Corporate Purchasing Card",
    taglineAr: "إدارة ومراقبة كاملة لمصاريف موظفيك",
    taglineEn: "Simplify company spends",
    descAr: "قم بتبسيط ومتابعة نفقات ومصاريف السفر والعمل لموظفيك.",
    descEn: "Consolidate official traveling and entertainment expenses easily.",
    bulletsAr: ["وضع حد إنفاق مخصص لكل بطاقة وموظف بشكل مستقل", "تقارير مالية دورية مدمجة مع الأنظمة المحاسبية للشركة", "تأمين سفر تجاري متكامل"],
    bulletsEn: ["Set strict individual card limits per employee", "Reports mapped directly into accounting systems", "Corporate travel insurance included free"],
  },
  {
    slug: "mobile-banking",
    group: ProductGroup.ELECTRONIC_SERVICE,
    segment: Segment.PERSONAL,
    titleAr: "تطبيق بنكي المطور",
    titleEn: "Banki Next-Gen App",
    taglineAr: "بنكك بالكامل في جيبك بأمان مطلق",
    taglineEn: "Complete financial control on your phone",
    descAr: "تمتع بأعلى درجات الأمان والتحكم المالي المطلق عبر تطبيقنا.",
    descEn: "Our state-of-the-art mobile banking application offers total biometric security.",
    bulletsAr: ["تسجيل دخول آمن وفوري بالبصمة أو ملامح الوجه", "عرض ومراقبة حدود الإنفاق وبطاقات الائتمان فوراً", "دفع فواتير الخدمات العامة والإنترنت بنقرة واحدة"],
    bulletsEn: ["Secure biometric instant login", "Freeze or update card parameters instantly", "Pay utility invoices in 5 seconds"],
  },
  {
    slug: "qr-withdrawal",
    group: ProductGroup.ELECTRONIC_SERVICE,
    segment: Segment.PERSONAL,
    titleAr: "سحب نقدي بدون بطاقة (QR)",
    titleEn: "Cardless QR Cash",
    taglineAr: "طريقة أسرع وأكثر أماناً للحصول على الكاش",
    taglineEn: "Forget plastic. Withdraw instantly.",
    descAr: "لا حاجة لحمل بطاقة الصراف المادية بعد الآن! امسح رمز الـ QR الظاهر على شاشة الصراف الآلي.",
    descEn: "Generate a secure cash withdrawal token on your mobile app and scan at any ATM.",
    bulletsAr: ["حماية مطلقة من عمليات نسخ وتزوير البطاقات المادية", "إمكانية إرسال كود سحب لصديق لاستخدامه في الحالات الطارئة", "سرعة تنفيذ عملية السحب تتقلص لأقل من 10 ثوانٍ"],
    bulletsEn: ["Eliminates traditional card skimming concerns", "Generate one-time withdrawal tokens for friends", "Complete cash collections in under 10 seconds"],
  },
  {
    slug: "corporate-online",
    group: ProductGroup.ELECTRONIC_SERVICE,
    segment: Segment.BUSINESS,
    titleAr: "بوابة الشركات المصرفية الإلكترونية",
    titleEn: "Corporate Online Banking Suite",
    taglineAr: "منصة آمنة ومتكاملة لإدارة أعمالك 24/7",
    taglineEn: "Enterprise treasury in one secure screen",
    descAr: "تحكم بخزينة شركتك وأجرِ التحويلات الجماعية للرواتب والشركاء التجاريين محلياً ودولياً.",
    descEn: "Take command of corporate treasury with global wire workflows.",
    bulletsAr: ["نظام حوكمة متطور يتطلب اعتماد ثنائي أو ثلاثي للعمليات", "تحويل فوري ومجدول لرواتب الموظفين بنقرة واحدة", "تصدير فوري لكشوفات الحساب بصيغ متعددة"],
    bulletsEn: ["Dual/triple-factor approval matrixes", "Instant scheduled payroll transfers", "Export statements in MT940, CSV formats"],
  },
  {
    slug: "b2b-remittance",
    group: ProductGroup.TRANSFER,
    segment: Segment.BUSINESS,
    titleAr: "الحوالات التجارية الدولية السريعة",
    titleEn: "High-Value Corporate SWIFT",
    taglineAr: "أسرع قنوات تحويل لتجارتك الدولية",
    taglineEn: "Remitting across borders with speed",
    descAr: "أرسل واستقبل مستحقات شركتك الخارجية بأمان عبر أوسع شبكة بنوك مراسلة حول العالم.",
    descEn: "Execute international import/export wires seamlessly via SWIFT GPI.",
    bulletsAr: ["تأكيد فوري بالوصول وتتبع لحظي عبر بوابة الشركات", "أسعار تفضيلية خاصة لتحويل العملات للشركات ذات الأحجام الكبيرة", "توافق تام وأمان مطلق مع معايير مكافحة غسيل الأموال"],
    bulletsEn: ["Real-time status notifications for critical payments", "Volume-based preferential exchange margins", "Automated compliance pre-screenings"],
  },
];

const campaigns = [
  {
    titleAr: "حملة العودة للمدارس: استرداد نقدي 3%",
    titleEn: "Back to School: 3% Cashback Booster",
    descAr: "سدد الرسوم المدرسية والجامعية باستخدام أي من بطاقاتنا الائتمانية واحصل على كاش باك فوري بقيمة 3%.",
    descEn: "Settle educational tuition invoices using our credit lines and receive an instant 3% cashback rebate.",
    badgeAr: "حملة حصرية",
    badgeEn: "Exclusive Campaign",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
    link: "cards",
    segment: Segment.PERSONAL,
  },
  {
    titleAr: "تمويل السيارات الصديقة للبيئة بنسبة 3.9%",
    titleEn: "Go Green: Eco Auto Finance at 3.9%",
    descAr: "تمتع بتمويل فوري لشراء سيارتك الهجينة أو الكهربائية بنسبة فائدة متناقصة تبدأ من 3.9%.",
    descEn: "Finance your eco-friendly hybrid or electric vehicle at a preferred 3.9% reducing rate.",
    badgeAr: "صديق للبيئة",
    badgeEn: "Eco-Friendly",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
    link: "loans",
    segment: Segment.PERSONAL,
  },
  {
    titleAr: "حملة تمويل المنشآت الصغيرة وعوائد تشجيعية",
    titleEn: "SME Growth Accelerator Package",
    descAr: "ندعم قطاع المنشآت الصغيرة والمتوسطة بفائدة تفضيلية منخفضة لتمكينهم من تطوير أعمالهم.",
    descEn: "Elevate your enterprise with subsidized lending rates and credit lines designed for SMEs.",
    badgeAr: "دعم مالي",
    badgeEn: "SME Boost",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop",
    link: "loans",
    segment: Segment.BUSINESS,
  },
];

const branches = [
  {
    nameAr: "الفرع الرئيسي - رام الله",
    nameEn: "Ramallah Main Branch",
    addressAr: "شارع الإرسال، مقابل برج فلسطين، رام الله",
    addressEn: "Al-Irsal Street, Opp Palestine Tower, Ramallah",
    lat: 31.9061,
    lng: 35.2035,
    hoursAr: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً",
    hoursEn: "Sunday - Thursday: 8:30 AM - 3:00 PM",
    phone: "+970-2-2946420",
  },
  {
    nameAr: "الفرع الرئيسي - غزة",
    nameEn: "Gaza Main Branch",
    addressAr: "شارع عمر المختار، غزة",
    addressEn: "Omar Al-Mukhtar Street, Gaza",
    lat: 31.5016,
    lng: 34.4668,
    hoursAr: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً",
    hoursEn: "Sunday - Thursday: 8:30 AM - 3:00 PM",
    phone: "+970-8-2880150",
  },
  {
    nameAr: "فرع نابلس - وسط البلد",
    nameEn: "Nablus Center Branch",
    addressAr: "الدوار الرئيسي، شارع فيصل، نابلس",
    addressEn: "Main Square, Faisal Street, Nablus",
    lat: 32.2227,
    lng: 35.2621,
    hoursAr: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً",
    hoursEn: "Sunday - Thursday: 8:30 AM - 3:00 PM",
    phone: "+970-9-2345600",
  },
  {
    nameAr: "فرع الخليل - عين سارة",
    nameEn: "Hebron Ain Sara Branch",
    addressAr: "شارع عين سارة، الخليل",
    addressEn: "Ain Sara Street, Hebron",
    lat: 31.5326,
    lng: 35.0998,
    hoursAr: "الأحد - الخميس: 8:30 صباحاً - 3:00 مساءً",
    hoursEn: "Sunday - Thursday: 8:30 AM - 3:00 PM",
    phone: "+970-2-2228500",
  },
];

const newsItems = [
  {
    slug: "sustainable-bop",
    titleAr: "بنك فلسطين يتصدر قائمة البنوك المستدامة الصديقة للبيئة في فلسطين",
    titleEn: "Bank of Palestine tops local ESG and Green Finance lists",
    descAr: "حاز بنك فلسطين على المرتبة الأولى في تمويل المشاريع الخضراء والطاقة البديلة.",
    descEn: "Bank of Palestine achieves prime honors in sustainable project funding.",
    contentAr: "<p>في خطوة رائدة تكرس التزامنا بحماية الكوكب وتأمين غدٍ أكثر إشراقاً لأجيالنا القادمة، أعلن بنك فلسطين عن حزمة استثمارية ضخمة لتمويل محطات الطاقة الشمسية.</p>",
    contentEn: "<p>In a pioneering stride consolidating our commitment to protecting our environment, Bank of Palestine unveiled major eco-loans and sustainable treasury funds.</p>",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
  },
  {
    slug: "digital-banki-launch",
    titleAr: "إطلاق الميزات الذكية الجديدة على تطبيق 'بنكي' لتسهيل التحويلات الفورية",
    titleEn: "New AI smart modules rolled out on Banki application",
    descAr: "أعلن البنك عن إطلاق ميزات مبتكرة تتيح التحويل السريع وفتح الحسابات الرقمية بنقرة واحدة.",
    descEn: "We are proud to introduce zero-friction payment gateways and automatic budgeting.",
    contentAr: "<p>تماشياً مع استراتيجيتنا للتحول الرقمي المستمر، أعلن القسم التقني في بنك فلسطين عن تحديث شامل لتطبيق الهواتف الذكية.</p>",
    contentEn: "<p>Consolidating our digital-first strategies, the Innovation core updated its systems with multi-biometric gates and secure chat bots.</p>",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop",
  },
];

async function main() {
  console.log("Seeding database...");

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const editorPassword = process.env.SEED_EDITOR_PASSWORD || "Editor@12345";
  const viewerPassword = process.env.SEED_VIEWER_PASSWORD || "Viewer@12345";

  await prisma.user.upsert({
    where: { email: "admin@bankofpalestine.test" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@bankofpalestine.test",
      passwordHash: await hashPassword(adminPassword),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@bankofpalestine.test" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@bankofpalestine.test",
      passwordHash: await hashPassword(editorPassword),
      role: "EDITOR",
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@bankofpalestine.test" },
    update: {},
    create: {
      name: "Report Viewer",
      email: "viewer@bankofpalestine.test",
      passwordHash: await hashPassword(viewerPassword),
      role: "VIEWER",
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: { ...product, status: ContentStatus.PUBLISHED },
    });
  }

  for (const campaign of campaigns) {
    const existing = await prisma.campaign.findFirst({ where: { titleEn: campaign.titleEn } });
    if (!existing) {
      await prisma.campaign.create({ data: { ...campaign, status: ContentStatus.PUBLISHED } });
    }
  }

  for (const branch of branches) {
    const existing = await prisma.branch.findFirst({ where: { nameEn: branch.nameEn } });
    if (!existing) {
      await prisma.branch.create({ data: branch });
    }
  }

  for (const article of newsItems) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: {},
      create: { ...article, status: ContentStatus.PUBLISHED, publishedAt: new Date() },
    });
  }

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteNameAr: "بنك فلسطين",
      siteNameEn: "Bank of Palestine",
      contactEmail: "info@bankofpalestine.test",
      contactPhone: "+970-2-2946420",
      contactAddressAr: "رام الله، فلسطين",
      contactAddressEn: "Ramallah, Palestine",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: admin@bankofpalestine.test / ${adminPassword}`);
  console.log(`Editor login: editor@bankofpalestine.test / ${editorPassword}`);
  console.log(`Viewer login: viewer@bankofpalestine.test / ${viewerPassword}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
