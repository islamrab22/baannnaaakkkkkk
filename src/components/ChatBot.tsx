import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Landmark, ShieldAlert, CreditCard, ChevronLeft } from 'lucide-react';
import { Language, translations } from '../types';

interface ChatBotProps {
  lang: Language;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function ChatBot({ lang }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversations when opened
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: lang === 'ar' 
            ? 'مرحباً بك في بنك الابتكار الدولي! أنا مساعدك الآلي الذكي. كيف يمكنني خدمتك اليوم؟'
            : 'Hello! Welcome to Innovation International Bank. I am your smart virtual assistant. How can I help you today?',
          time: '10:19 AM',
        }
      ]);
    }
  }, [lang]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text: textToSend, time: currentTime };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate smart bot response
    setTimeout(() => {
      const botResponseText = generateBotReply(textToSend);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponseText, time: currentTime }]);
    }, 850);
  };

  const generateBotReply = (text: string): string => {
    const q = text.toLowerCase();
    
    if (lang === 'ar') {
      if (q.includes('بطاق') || q.includes('فيزا') || q.includes('مسروق') || q.includes('فقدت')) {
        return '🚨 للأمان الفوري: لإيقاف بطاقتك الصراف أو الفيزا المفقودة فوراً، يرجى النقر على خيار "إيقاف البطاقات" أو الاتصال برقم الطوارئ الموحد الخاص بنا 1800-555-000 لحمايتها على مدار الساعة.';
      }
      if (q.includes('قرض') || q.includes('تمويل') || q.includes('حاسبة') || q.includes('فائدة')) {
        return '💰 قروضنا مرنة ومتوافقة مع تطلعاتك! انتقل إلى صفحة "القروض والتمويل" في القائمة الرئيسية لاستخدام الحاسبة التفاعلية وحساب القسط الشهري بدقة تامة.';
      }
      if (q.includes('فرع') || q.includes('صراف') || q.includes('موقع')) {
        return '📍 فروعنا وصرافاتنا الآلية متواجدة لتغطية كافة الاحتياجات. فرعنا الرئيسي يقع في الدوار الخامس ويستقبلكم من الساعة 8:30 صباحاً حتى 3:00 مساءً.';
      }
      if (q.includes('فتح حساب') || q.includes('حساب جديد') || q.includes('توفير')) {
        return '✨ يمكنك فتح حساب توفير أو حساب جارٍ رقمي بالكامل في أقل من 5 دقائق وبدون أي حاجة لزيارة الفرع! تفضل بزيارة علامة تبويب "الحسابات" لتقديم طلبك الفوري.';
      }
      if (q.includes('شكرا') || q.includes('مرحبا') || q.includes('سلام')) {
        return 'أهلاً بك دائماً وأبداً! يسعدنا جداً خدمتك وتلبية متطلباتك المصرفية بكل احترافية وأمان.';
      }
      return 'شكراً لتواصلك معنا. لم أفهم طلبك بدقة، يمكنك اختيار أحد المواضيع السريعة المقترحة في الأسفل للمساعدة الفورية، أو الاتصال بالدعم الفني المباشر على 1800-555-000.';
    } else {
      if (q.includes('card') || q.includes('lost') || q.includes('stolen') || q.includes('block')) {
        return '🚨 EMERGENCY BLOCK: To suspend a lost or stolen payment card immediately, select "Block Card" or call our emergency hotline at 1800-555-000 to secure your funds.';
      }
      if (q.includes('loan') || q.includes('finance') || q.includes('calculator') || q.includes('interest')) {
        return '💰 Smart Financing: Our loan packages offer extremely competitive rates. Head to the "Loans" page in our menu to compute your installments interactively using our slider widget.';
      }
      if (q.includes('branch') || q.includes('atm') || q.includes('location') || q.includes('address')) {
        return '📍 Main branches are open Sunday to Thursday, 8:30 AM to 3:00 PM. Our headquarters is located centrally at 5th Circle.';
      }
      if (q.includes('open') || q.includes('account') || q.includes('savings')) {
        return '✨ Fast Onboarding: You can set up a premium digital savings or current account in less than 5 minutes online. Navigate to the "Accounts" section to fill the fast registration form.';
      }
      if (q.includes('thank') || q.includes('hello') || q.includes('hi')) {
        return 'You are welcome! Our absolute pleasure to assist you. Let me know if you need help with any other services.';
      }
      return 'I appreciate your query. For immediate resolution, feel free to use one of our quick action buttons or reach our direct line at 1800-555-000.';
    }
  };

  const quickPrompts = lang === 'ar' 
    ? [
        { label: '🚨 إيقاف بطاقة فوراً', text: 'أريد إيقاف بطاقتي المفقودة فورا' },
        { label: '✨ فتح حساب رقمي', text: 'كيف أفتح حساب جديد عبر الإنترنت؟' },
        { label: '💰 حاسبة القروض', text: 'كيف أحسب القسط الشهري للقرض؟' },
        { label: '📍 موقع أقرب فرع', text: 'أين يقع أقرب فرع للبنك؟' },
      ]
    : [
        { label: '🚨 Stop Lost Card', text: 'I want to block my card immediately' },
        { label: '✨ Open Digital Account', text: 'How can I open a digital account online?' },
        { label: '💰 Loan Calculator', text: 'How do I calculate loan installments?' },
        { label: '📍 Main Branch Hours', text: 'What are the main branch hours?' },
      ];

  return (
    <div className={`fixed z-50 transition-all ${lang === 'ar' ? 'bottom-6 left-6' : 'bottom-6 right-6'}`}>
      
      {/* FLOATING CHAT BALLOON BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="chat-toggle-btn"
          className="w-14 h-14 bg-brand hover:bg-brand-dark text-white rounded-full shadow-[0_10px_25px_rgba(155,26,92,0.4)] hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer relative"
        >
          <MessageSquare className="w-6 h-6" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-bounce" />
        </button>
      )}

      {/* CHAT WINDOW EXPANDED */}
      {isOpen && (
        <div 
          id="chat-window"
          className="w-[340px] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up"
        >
          {/* Header */}
          <div className="bg-brand text-white px-4 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5 text-right">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold">
                AI
              </div>
              <div>
                <h4 className="text-sm font-black leading-tight">
                  {lang === 'ar' ? 'المساعد الرقمي الذكي' : 'Smart Digital Guide'}
                </h4>
                <span className="text-[10px] text-green-300 font-bold block mt-0.5">● Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    isBot 
                      ? lang === 'ar' ? 'self-start text-right items-start' : 'self-start text-left items-start'
                      : lang === 'ar' ? 'self-end text-right items-end mr-auto' : 'self-end text-left items-end ml-auto'
                  }`}
                >
                  <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    isBot 
                      ? 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tr-none'
                      : 'bg-brand text-white shadow-md rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 block">
                    {msg.time}
                  </span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick options panel */}
          <div className="px-4 py-2 border-t border-gray-100 bg-white flex flex-wrap gap-1.5 select-none max-h-24 overflow-y-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                className="text-[10px] font-extrabold bg-gray-50 hover:bg-brand-light text-gray-700 hover:text-brand border border-gray-100 px-2.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'ar' ? 'اسأل عن أي خدمة...' : 'Ask about services...'}
              className="flex-1 text-xs border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              type="submit"
              className="p-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 transform rotate-180" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
