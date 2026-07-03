import { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, ShieldCheck, HelpCircle, DollarSign, TrendingUp, RefreshCw, Landmark } from 'lucide-react';
import { Language } from '../types';

interface TransfersTabProps {
  lang: Language;
}

interface RateRow {
  currency: string;
  buy: number;
  sell: number;
  change: number; // positive or negative percentage
}

export default function TransfersTab({ lang }: TransfersTabProps) {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('JOD');
  const [amount, setAmount] = useState('100');
  const [convertedResult, setConvertedResult] = useState(0);

  // Fee estimator state
  const [transferDest, setTransferDest] = useState('local');
  const [transferAmt, setTransferAmt] = useState('500');

  // Static mock exchange rates table relative to USD
  const baseRates: Record<string, number> = {
    USD: 1.000,
    JOD: 0.709,
    EUR: 0.915,
    GBP: 0.784,
    AED: 3.673,
    SAR: 3.750,
  };

  // Live market rate indexes
  const rateTable: RateRow[] = [
    { currency: 'USD / JOD', buy: 0.7080, sell: 0.7100, change: 0.00 },
    { currency: 'EUR / JOD', buy: 0.7715, sell: 0.7760, change: 0.12 },
    { currency: 'GBP / JOD', buy: 0.9010, sell: 0.9070, change: -0.05 },
    { currency: 'AED / JOD', buy: 0.1925, sell: 0.1934, change: 0.01 },
    { currency: 'SAR / JOD', buy: 0.1882, sell: 0.1895, change: 0.04 },
  ];

  // Perform dynamic exchange math
  useEffect(() => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setConvertedResult(0);
      return;
    }

    // Convert From -> USD -> To
    const amountInUSD = amt / baseRates[fromCurrency];
    const convertedAmount = amountInUSD * baseRates[toCurrency];
    setConvertedResult(convertedAmount);
  }, [fromCurrency, toCurrency, amount]);

  // Handle reciprocal swapping
  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Dynamic fee calculation
  const getTransferFees = () => {
    const amt = parseFloat(transferAmt) || 0;
    if (transferDest === 'local') {
      return { fee: 0, speed: lang === 'ar' ? 'فوري (أقل من دقيقة)' : 'Instant (under 1 min)' };
    } else if (transferDest === 'regional') {
      return { fee: Math.max(5, amt * 0.002), speed: lang === 'ar' ? 'بنفس اليوم (أقل من ساعتين)' : 'Same day (under 2 hrs)' };
    } else {
      return { fee: Math.max(15, amt * 0.005), speed: lang === 'ar' ? '1 - 2 أيام عمل (سويفت)' : '1 - 2 Business Days (SWIFT)' };
    }
  };

  const { fee, speed } = getTransferFees();

  return (
    <div id="transfers-page" className="py-12 bg-white text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black text-brand uppercase tracking-widest block mb-2 font-mono">
            {lang === 'ar' ? 'بوابة التحويلات وصرف العملات' : 'Remittance & Exchange Portals'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nearblack mb-4">
            {lang === 'ar' ? 'التحويلات المالية وأسعار العملات' : 'Global Transfers & Currency Rates'}
          </h2>
          <p className="text-sm sm:text-base font-medium text-gray-500 leading-relaxed">
            {lang === 'ar' 
              ? 'حوّل أموالك محلياً ودولياً بأمان تام وسرعة فائقة. تمتع بأقل رسوم تحويل على مستوى المملكة وبأسعار تفضيلية حية لتبادل العملات الأجنبية.'
              : 'Safely transfer capitals locally or globally with speed. Settle international transactions at preferred rates using our SWIFT integrations.'}
          </p>
        </div>

        {/* INTERACTIVE EXCHANGE LAYOUT GRID */}
        <div id="exchange-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          {/* LEFT: LIVE CALCULATOR BLOCK */}
          <div className="lg:col-span-7 bg-slate-50 border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">
                  {lang === 'ar' ? 'آلة تحويل العملات الحية' : 'Live Currency Exchange Calculator'}
                </h3>
                <TrendingUp className="w-5 h-5 text-brand" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* From currency card */}
                <div className="sm:col-span-5 bg-white border border-gray-150 p-4 rounded-2xl shadow-sm text-right space-y-2">
                  <label className="text-[10px] font-black text-gray-400 block uppercase tracking-wider">
                    {lang === 'ar' ? 'من العملة' : 'FROM CURRENCY'}
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full bg-transparent border-none text-base font-extrabold focus:outline-none text-right font-mono"
                  >
                    {Object.keys(baseRates).map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent border-b border-gray-150 text-xl font-black text-brand text-right focus:outline-none focus:border-brand py-1 font-mono"
                  />
                </div>

                {/* Swapping arrow button */}
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    onClick={handleSwapCurrencies}
                    className="w-10 h-10 rounded-full bg-brand text-white shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center cursor-pointer"
                    title="Swap"
                  >
                    <ArrowLeftRight className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* To currency card */}
                <div className="sm:col-span-5 bg-white border border-gray-150 p-4 rounded-2xl shadow-sm text-right space-y-2">
                  <label className="text-[10px] font-black text-gray-400 block uppercase tracking-wider">
                    {lang === 'ar' ? 'إلى العملة' : 'TO CURRENCY'}
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full bg-transparent border-none text-base font-extrabold focus:outline-none text-right font-mono"
                  >
                    {Object.keys(baseRates).map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                  <div className="h-px bg-gray-150 my-1" />
                  <span className="text-xl font-black text-gray-800 text-right block py-1 font-mono">
                    {convertedResult.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                  </span>
                </div>

              </div>

              {/* Formula details */}
              <div className="bg-brand-light/20 border border-brand/5 p-3 rounded-xl text-[11px] text-gray-600 font-medium text-right leading-relaxed">
                <span>
                  💡 {lang === 'ar' ? 'التحويل يعتمد على أسعار صرف البنك المركزي التنافسية لليوم.' : 'Calculations based on competitive daily Interbank Central Rates.'}{' '}
                </span>
                <span className="font-mono font-bold text-brand">
                  1 {fromCurrency} = {(baseRates[toCurrency] / baseRates[fromCurrency]).toFixed(4)} {toCurrency}
                </span>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-200 mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => alert(lang === 'ar' ? 'يرجى تسجيل الدخول لحسابك المصرفي لإتمام بيع أو شراء العملات الأجنبية فوراً.' : 'Login to execute foreign exchange transactions.')}
                className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-extrabold text-xs px-8 py-3.5 rounded-lg shadow-md transition-all cursor-pointer text-center"
              >
                {lang === 'ar' ? 'نفذ معاملة صرف العملة' : 'Execute Foreign Exchange'}
              </button>
              <button
                onClick={() => alert(lang === 'ar' ? '✓ تم تحديث أسعار التداول حية للتو.' : '✓ Exchange index refreshed successfully.')}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs px-6 py-3.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand" />
                <span>{lang === 'ar' ? 'تحديث الأسعار حية' : 'Refresh Rates'}</span>
              </button>
            </div>

          </div>

          {/* RIGHT: LIVE MARKET TABLE */}
          <div className="lg:col-span-5 border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-start mb-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-base font-black text-gray-900">
                  {lang === 'ar' ? 'مؤشر أسعار الصرف الحية مقابل الدينار' : 'Live JOD Exchange Index'}
                </h3>
              </div>

              {/* Table header */}
              <div className="bg-gray-100 p-3 rounded-lg grid grid-cols-12 gap-1 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">
                <span className="col-span-4">{lang === 'ar' ? 'العملة' : 'CURRENCY'}</span>
                <span className="col-span-3 text-center">{lang === 'ar' ? 'شراء' : 'BUY'}</span>
                <span className="col-span-3 text-center">{lang === 'ar' ? 'بيع' : 'SELL'}</span>
                <span className="col-span-2 text-center">{lang === 'ar' ? 'تغير' : 'CHG'}</span>
              </div>

              {/* Table rows */}
              <div className="space-y-1">
                {rateTable.map((row, idx) => (
                  <div key={idx} className="hover:bg-gray-50 p-3 rounded-lg grid grid-cols-12 gap-1 text-xs font-bold text-gray-800 text-right border-b border-gray-50 items-center">
                    <span className="col-span-4 font-mono font-black">{row.currency}</span>
                    <span className="col-span-3 text-center font-mono text-gray-600">{row.buy.toFixed(4)}</span>
                    <span className="col-span-3 text-center font-mono text-gray-600">{row.sell.toFixed(4)}</span>
                    <span className={`col-span-2 text-center font-mono ${
                      row.change > 0 ? 'text-green-600' : row.change < 0 ? 'text-rose-600' : 'text-gray-400'
                    }`}>
                      {row.change > 0 ? '+' : ''}{row.change.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-normal text-center mt-6">
              {lang === 'ar' ? '⚠️ الأسعار استرشادية وتتغير بناءً على تذبذب الأسواق المالية الدولية.' : '⚠️ Rates are indicative and fluctuate according to international market indices.'}
            </p>
          </div>

        </div>

        {/* FEE ESTIMATOR & REMITTANCE INFO */}
        <div className="bg-neutral-50 rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Fee Input and Result */}
          <div className="space-y-6 order-2 md:order-none text-right">
            <h3 className="text-lg font-black text-gray-900">
              {lang === 'ar' ? 'مخمن رسوم وسرعة الحوالات المالية' : 'Remittance Fee & Speed Estimator'}
            </h3>

            <div className="space-y-4">
              {/* Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'ar' ? 'جهة التحويل المقصودة' : 'Transfer Destination'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'local', label: lang === 'ar' ? 'محلي (فوري)' : 'Local Instant' },
                    { id: 'regional', label: lang === 'ar' ? 'إقليمي (عربي)' : 'Regional Arab' },
                    { id: 'intl', label: lang === 'ar' ? 'دولي (سويفت)' : 'Global SWIFT' },
                  ].map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setTransferDest(dest.id)}
                      className={`py-2 px-1 text-center font-bold text-[10px] border rounded-lg transition-all cursor-pointer ${
                        transferDest === dest.id
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {dest.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === 'ar' ? 'المبلغ المراد تحويله ($)' : 'Amount to Transfer ($)'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferAmt}
                  onChange={(e) => setTransferAmt(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right"
                />
              </div>

              {/* Output Result box */}
              <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-sm grid grid-cols-2 gap-4 text-center items-center">
                <div>
                  <span className="text-[9px] font-black text-gray-400 block uppercase mb-1">
                    {lang === 'ar' ? 'رسوم التحويل المقدرة' : 'Estimated Fee'}
                  </span>
                  <span className="text-base font-black text-brand font-mono">
                    ${fee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-r border-gray-150 h-10" />
                <div>
                  <span className="text-[9px] font-black text-gray-400 block uppercase mb-1">
                    {lang === 'ar' ? 'سرعة الوصول المتوقعة' : 'Estimated Arrival'}
                  </span>
                  <span className="text-xs font-extrabold text-gray-800 whitespace-nowrap">
                    {speed}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Transfer features description */}
          <div className="text-right space-y-4 order-1 md:order-none">
            <h4 className="text-base font-black text-gray-900 leading-tight">
              {lang === 'ar' ? 'لماذا تعتمد تحويلات بنك الابتكار الدولي؟' : 'Why route with Innovation International?'}
            </h4>
            <ul className="space-y-3 font-medium text-xs text-gray-500">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'ar' ? 'حماية فائقة الأمان:' : 'Multi-layered Encryption:'}</strong>{' '}
                  {lang === 'ar' ? 'معالجة الحوالات تحت رقابة مشددة والتحقق الثنائي لضمان وصولها بأمان.' : 'All payments screened for compliance and secured via 3D biometric verifications.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Landmark className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                <span>
                  <strong>{lang === 'ar' ? 'ربط مباشر وسريع:' : 'SWIFT GPI Tracking:'}</strong>{' '}
                  {lang === 'ar' ? 'شبكة متطورة تتيح تتبع الحوالة في الوقت الفعلي ومعرفة موعد وصولها بدقة.' : 'Track remittance flows in real-time from sender up to beneficiary accounts.'}
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
