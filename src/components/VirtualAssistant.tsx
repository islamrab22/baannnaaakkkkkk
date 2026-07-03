import { useState } from 'react';
import { User, X, Landmark, ShieldCheck, HeartHandshake, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface VirtualAssistantProps {
  lang: Language;
}

export default function VirtualAssistant({ lang }: VirtualAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tips = lang === 'ar' 
    ? [
        '🔒 لا تشارك أبداً كلمة المرور المؤقتة (OTP) مع أي جهة تدعي أنها تمثل البنك.',
        '📱 قم دائماً بتحديث تطبيق البنك الخاص بنا من المتاجر الرسمية الموثوقة.',
        '✉️ البنك لن يطلب منك أبداً تحديث بياناتك المصرفية الشخصية عبر رابط رسالة نصية.'
      ]
    : [
        '🔒 Never share your One-Time Password (OTP) with anyone claiming to represent the bank.',
        '📱 Always update your banking application exclusively from official app stores.',
        '✉️ Innovation Bank will never request personal authentication credentials via text links.'
      ];

  const handleFeedbackSubmit = () => {
    if (feedbackRating) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFeedbackRating(null);
        setIsOpen(false);
      }, 2000);
    }
  };

  return (
    <div className={`fixed z-50 transition-all ${lang === 'ar' ? 'bottom-6 right-6' : 'bottom-6 left-6'}`}>
      
      {/* TRIGGER LAUNCHER */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="assistant-toggle-btn"
          className="w-10 h-10 bg-charcoal hover:bg-neutral-800 text-brand-light rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
          title="Virtual Assistant Hub"
        >
          <User className="w-5 h-5 text-brand" />
        </button>
      )}

      {/* POPUP MENU */}
      {isOpen && (
        <div 
          id="assistant-popup"
          className="w-80 bg-white border border-gray-100 rounded-xl shadow-2xl p-5 flex flex-col overflow-hidden animate-scale-up text-right text-sm"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-brand-light text-brand rounded-full">
                <User className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-gray-800">
                {lang === 'ar' ? 'بوابة الأمان والملاحظات' : 'Security & Quality Hub'}
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Core content */}
          <div className="space-y-4">
            
            {/* Cybersecurity Tip Section */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-3.5 text-xs text-amber-800 text-left">
              <h5 className="font-black flex items-center gap-1.5 mb-1.5 text-right">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? 'نصيحة أمنية هامة' : 'Cybersecurity Alert'}</span>
              </h5>
              <p className="font-medium text-amber-950/80 leading-relaxed text-right">
                {tips[Math.floor(Date.now() / 86400000) % tips.length]}
              </p>
            </div>

            {/* Quick Rating Form */}
            <div className="space-y-2 border-t border-gray-100 pt-3">
              <h5 className="font-extrabold text-xs text-gray-800 text-right flex items-center gap-1.5 justify-start">
                <HeartHandshake className="w-4 h-4 text-brand" />
                <span>{lang === 'ar' ? 'ما تقييمك لتجربتك اليوم؟' : 'How is your experience today?'}</span>
              </h5>
              
              {!isSubmitted ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 py-1 select-none">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border cursor-pointer ${
                          feedbackRating === star
                            ? 'bg-brand text-white border-brand shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-brand/50'
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                  {feedbackRating && (
                    <button
                      onClick={handleFeedbackSubmit}
                      className="w-full bg-brand hover:bg-brand-dark text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? 'إرسال التقييم' : 'Send Rating'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-2 text-green-600 font-bold text-xs animate-scale-up">
                  {lang === 'ar' ? '✓ نشكرك على ملاحظاتك الثمينة!' : '✓ Thank you for your feedback!'}
                </div>
              )}
            </div>

            {/* Institutional compliance badge */}
            <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 border-t border-gray-100 pt-3 font-medium">
              <Landmark className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'ودائعكم محمية بالكامل بموجب القانون' : 'Deposits fully guaranteed by Central Bank'}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
