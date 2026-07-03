import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, Check, ShieldCheck, HelpCircle, DollarSign, Calculator } from 'lucide-react';
import { Language, translations } from '../types';

interface LoansTabProps {
  lang: Language;
}

type LoanType = 'personal' | 'housing' | 'auto';

export default function LoansTab({ lang }: LoansTabProps) {
  const t = translations[lang];
  const [loanType, setLoanType] = useState<LoanType>('personal');
  const [amount, setAmount] = useState(25000);
  const [tenure, setTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(4.5);
  
  // Results
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Pre-approval
  const [monthlySalary, setMonthlySalary] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<'idle' | 'approved' | 'rejected'>('idle');

  const loanTypesConfig = {
    personal: { minAmt: 5000, maxAmt: 75000, defaultRate: 4.5, maxYrs: 10, titleAr: 'القرض الشخصي المرن', titleEn: 'Flexible Personal Loan' },
    housing: { minAmt: 20000, maxAmt: 500000, defaultRate: 3.9, maxYrs: 25, titleAr: 'التمويل العقاري السكني', titleEn: 'Residential Mortgage' },
    auto: { minAmt: 5000, maxAmt: 100000, defaultRate: 4.1, maxYrs: 8, titleAr: 'قرض تمويل السيارات الفوري', titleEn: 'Instant Auto Loan' }
  };

  // Recalculate EMI whenever amount, tenure, or interestRate changes
  useEffect(() => {
    const p = amount;
    const annualRate = interestRate / 100;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = tenure * 12;

    if (monthlyRate === 0) {
      setEmi(p / numberOfPayments);
      setTotalPayment(p);
      setTotalInterest(0);
    } else {
      const calculatedEmi = (p * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalPay = calculatedEmi * numberOfPayments;
      const totalInt = totalPay - p;

      setEmi(calculatedEmi);
      setTotalPayment(totalPay);
      setTotalInterest(totalInt);
    }
  }, [amount, tenure, interestRate]);

  // Adjust parameters when loan type changes
  const handleLoanTypeChange = (type: LoanType) => {
    setLoanType(type);
    const config = loanTypesConfig[type];
    setInterestRate(config.defaultRate);
    if (amount < config.minAmt) setAmount(config.minAmt);
    if (amount > config.maxAmt) setAmount(config.maxAmt);
    if (tenure > config.maxYrs) setTenure(config.maxYrs);
  };

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = parseFloat(monthlySalary);
    if (!salary || salary <= 0) return;

    // Debt Service Ratio limit is 45% of income for personal, housing can be up to 50%
    const maxInstallment = salary * (loanType === 'housing' ? 0.50 : 0.45);
    if (emi <= maxInstallment) {
      setApprovalStatus('approved');
    } else {
      setApprovalStatus('rejected');
    }
  };

  // Percentage calculations for graphical ratio bar
  const principalPercentage = (amount / totalPayment) * 100 || 0;
  const interestPercentage = (totalInterest / totalPayment) * 100 || 0;

  return (
    <div id="loans-page" className="py-12 bg-white text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand uppercase tracking-widest block mb-2 font-mono">
            {lang === 'ar' ? 'حلول التمويل والتسهيلات الائتمانية' : 'Financing & Loan Solutions'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nearblack mb-4">
            {t.loanCalculatorTitle}
          </h2>
          <p className="text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
            {lang === 'ar' 
              ? 'احسب قيمة تمويلك العقاري، الشخصي أو سيارتك بثوانٍ معدودة. نقدّم أسعار فائدة متناقصه مخفضة ومريحة وفترات سداد مرنة صممت لتبسط مشاريعك الاستثمارية والشخصية.' 
              : 'Compute mortgage, personal, or auto interest rates instantly. Benefit from our highly competitive compounding interest structures and generous repayment frameworks.'}
          </p>
        </div>

        {/* LOAN CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {(['personal', 'housing', 'auto'] as const).map((id) => (
            <button
              key={id}
              onClick={() => handleLoanTypeChange(id)}
              className={`p-5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                loanType === id
                  ? 'border-brand bg-brand-light/20 text-brand ring-1 ring-brand shadow-sm'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base font-black">
                  {lang === 'ar' ? loanTypesConfig[id].titleAr : loanTypesConfig[id].titleEn}
                </span>
                <Landmark className={`w-5 h-5 ${loanType === id ? 'text-brand' : 'text-gray-400'}`} />
              </div>
              <p className="text-xs font-bold text-gray-500 mt-4 leading-relaxed">
                {lang === 'ar' 
                  ? `فائدة تبدأ من ${loanTypesConfig[id].defaultRate}% • سداد لغاية ${loanTypesConfig[id].maxYrs} سنة`
                  : `Rates starting at ${loanTypesConfig[id].defaultRate}% • Terms up to ${loanTypesConfig[id].maxYrs} yrs`}
              </p>
            </button>
          ))}
        </div>

        {/* MAIN CALCULATOR LAYOUT CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-50 border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-lg items-stretch">
          
          {/* LEFT: SLIDERS & CONTROLS */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Slider 1: Amount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {lang === 'ar' ? 'مبلغ التمويل المطلوب' : 'Required Loan Amount'}
                  </span>
                  <span className="text-lg font-black text-brand font-mono">
                    ${amount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={loanTypesConfig[loanType].minAmt}
                  max={loanTypesConfig[loanType].maxAmt}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>${loanTypesConfig[loanType].minAmt.toLocaleString()}</span>
                  <span>${loanTypesConfig[loanType].maxAmt.toLocaleString()}</span>
                </div>
              </div>

              {/* Slider 2: Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {lang === 'ar' ? 'مدة سداد القرض (بالسنوات)' : 'Repayment Term (Years)'}
                  </span>
                  <span className="text-lg font-black text-brand font-mono">
                    {tenure} {lang === 'ar' ? 'سنة' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={loanTypesConfig[loanType].maxYrs}
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>1 {lang === 'ar' ? 'سنة' : 'Yr'}</span>
                  <span>{loanTypesConfig[loanType].maxYrs} {lang === 'ar' ? 'سنة' : 'Yrs'}</span>
                </div>
              </div>

              {/* Slider 3: Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {lang === 'ar' ? 'نسبة الفائدة السنوية المتناقصة' : 'Annual Reducing Interest Rate'}
                  </span>
                  <span className="text-lg font-black text-brand font-mono">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>2.5%</span>
                  <span>15.0%</span>
                </div>
              </div>

            </div>

            {/* PRE-APPROVAL SIMULATION CARD */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm mt-6">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-start">
                <Calculator className="w-4 h-4 text-brand" />
                <span>{lang === 'ar' ? 'مستكشف الأهلية والموافقة المبدئية السريعة' : 'Check Eligibility & Pre-Approval'}</span>
              </h4>
              <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                {lang === 'ar' 
                  ? 'أدخل راتبك الشهري الصافي لمعرفة ما إذا كان يطابق معايير عبء الدين والتحصيل القانوني للبنك المركزي.'
                  : 'Enter net monthly income to ensure your debt service ratio conforms to Central Bank restrictions.'}
              </p>

              <form onSubmit={handleCheckEligibility} className="flex gap-2">
                <input
                  type="number"
                  required
                  placeholder={lang === 'ar' ? 'ادخل الراتب الشهري الصافي' : 'Monthly net income'}
                  value={monthlySalary}
                  onChange={(e) => { setMonthlySalary(e.target.value); setApprovalStatus('idle'); }}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                />
                <button
                  type="submit"
                  className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'تحقق الآن' : 'Verify'}
                </button>
              </form>

              {/* Status Output */}
              {approvalStatus === 'approved' && (
                <div className="mt-4 bg-green-50 text-green-700 text-xs font-bold p-3 rounded-lg border border-green-100 flex items-center gap-2 justify-start animate-scale-up">
                  <ShieldCheck className="w-4.5 h-4.5 text-green-500" />
                  <span>{lang === 'ar' ? '✓ تهانينا! طلبك المبدئي مؤهل للموافقة الفورية!' : '✓ Approved! Your loan installment matches your net earnings!'}</span>
                </div>
              )}
              {approvalStatus === 'rejected' && (
                <div className="mt-4 bg-rose-50 text-rose-700 text-xs font-bold p-3 rounded-lg border border-rose-100 text-right animate-scale-up">
                  {lang === 'ar' 
                    ? '⚠️ عذراً، القسط الشهري يتجاوز 45% من قيمة الدخل المحدد. يرجى تمديد سنوات السداد أو تقليص مبلغ التمويل.'
                    : '⚠️ Debt limit exceeded. Repayment exceeds 45% of earnings. Reduce principal or extend years.'}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: DETAILED COMPUTATIONS BREAKDOWN */}
          <div className="lg:col-span-5 bg-gradient-to-b from-brand to-brand-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-inner">
            <div className="space-y-6">
              <span className="text-[10px] text-brand-light font-black uppercase tracking-wider block">
                {lang === 'ar' ? 'التفاصيل المالية لتمويلك' : 'FINANCING BREAKDOWN'}
              </span>

              {/* Monthly Installment (Largest) */}
              <div className="space-y-1">
                <span className="text-xs text-white/70 block">
                  {lang === 'ar' ? 'القسط الشهري التقريبي المتوقع' : 'Estimated Monthly Installment (EMI)'}
                </span>
                <span id="loan-result-emi" className="text-4xl font-black block leading-none py-1">
                  ${emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-white/10 my-4" />

              {/* Statistics lists */}
              <div className="space-y-3.5 text-xs font-medium">
                <div className="flex justify-between items-center text-white/80">
                  <span>{lang === 'ar' ? 'مبلغ التمويل الأصلي:' : 'Principal Amount:'}</span>
                  <span className="font-extrabold text-white">${amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>{lang === 'ar' ? 'إجمالي الفوائد المترتبة:' : 'Total Interest Charged:'}</span>
                  <span className="font-extrabold text-white">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>{lang === 'ar' ? 'إجمالي الدفعات التراكمي:' : 'Total Cost of Loan:'}</span>
                  <span className="font-extrabold text-white">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* GRAPHICAL PRINCIPAL VS INTEREST RATIO BAR */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] text-brand-light font-bold">
                  <span>{lang === 'ar' ? 'الأصل:' : 'Principal:'} {principalPercentage.toFixed(0)}%</span>
                  <span>{lang === 'ar' ? 'الفائدة:' : 'Interest:'} {interestPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-white transition-all duration-500 rounded-l-full" 
                    style={{ width: `${principalPercentage}%` }}
                  />
                  <div 
                    className="h-full bg-brand-light/60 transition-all duration-500" 
                    style={{ width: `${interestPercentage}%` }}
                  />
                </div>
              </div>

            </div>

            <div className="mt-8 pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => alert(lang === 'ar' ? '✓ تم إرسال طلب التمويل المبدئي بنجاح! سيتم مراجعة سجلاتك الائتمانية والرد عبر البريد الإلكتروني.' : '✓ Applied successfully! Credit screening initialized.')}
                className="w-full bg-white hover:bg-gray-50 text-brand font-black text-xs py-3.5 rounded-lg shadow-md transition-all cursor-pointer text-center"
              >
                {lang === 'ar' ? 'تأكيد وحجز القرض المبدئي' : 'Confirm & Apply for Loan'}
              </button>
              <p className="text-[9px] text-white/60 leading-normal text-center">
                {lang === 'ar' 
                  ? 'خاضع لموافقة البنك المركزي والتحقق من سجل المديونية الائتمانية CRIF.' 
                  : 'Subject to central regulatory credit rating approvals and CRIF scores.'}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
