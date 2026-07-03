import React, { useState, useEffect } from 'react';
import { Lock, LogOut, CheckCircle, Trash2, Edit2, Plus, Users, FolderOpen, MapPin, Award, RefreshCw, Layers, ShieldAlert, Eye } from 'lucide-react';
import { Language } from '../types';

interface AdminCMSProps {
  lang: Language;
  onClose: () => void;
}

export default function AdminCMS({ lang, onClose }: AdminCMSProps) {
  const isRtl = lang === 'ar';
  
  // Authentication states
  const [username, setUsername] = useState('staff_editor');
  const [password, setPassword] = useState('Palestine2026!');
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Active view tab inside CMS
  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'campaigns' | 'branches'>('leads');

  // Interactive data pools fetched from API
  const [leads, setLeads] = useState<any[]>([]);
  const [leadFilter, setLeadFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [productType, setProductType] = useState<'accounts' | 'loans' | 'cards'>('accounts');
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  // Editing / Creating Modals & forms
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [prodFormTitleAr, setProdFormTitleAr] = useState('');
  const [prodFormTitleEn, setProdFormTitleEn] = useState('');
  const [prodFormSlug, setProdFormSlug] = useState('');
  const [prodFormTaglineAr, setProdFormTaglineAr] = useState('');
  const [prodFormTaglineEn, setProdFormTaglineEn] = useState('');
  const [prodFormDescAr, setProdFormDescAr] = useState('');
  const [prodFormDescEn, setProdFormDescEn] = useState('');
  const [prodFormBulletsAr, setProdFormBulletsAr] = useState('');
  const [prodFormBulletsEn, setProdFormBulletsEn] = useState('');

  // Status/Toast alert
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto clear toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Fetching procedures
  const fetchLeads = async (currentTok: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${currentTok}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error("Error retrieving leads", e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/accounts?category=personal`);
      if (res.ok) {
        const accs = await res.json();
        const resLoans = await fetch(`/api/loans?category=personal`);
        const loans = await resLoans.json();
        const resCards = await fetch(`/api/cards?category=personal`);
        const cards = await resCards.json();

        // Tag each with their backend model name
        const formattedAccs = accs.map((a: any) => ({ ...a, type: 'accounts' }));
        const formattedLoans = loans.map((l: any) => ({ ...l, type: 'loans' }));
        const formattedCards = cards.map((c: any) => ({ ...c, type: 'cards' }));

        setProducts([...formattedAccs, ...formattedLoans, ...formattedCards]);
      }
    } catch (e) {
      console.error("Error retrieving products", e);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Perform login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setToast({
          message: isRtl ? 'تم تسجيل الدخول بنجاح إلى نظام CMS بنك فلسطين' : 'Successfully logged in to Bank of Palestine CMS',
          type: 'success'
        });
        fetchLeads(data.token);
        fetchProducts();
        fetchCampaigns();
        fetchBranches();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Error connecting to Server API. Please try again.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Log out
  const handleLogout = () => {
    setToken(null);
    setLeads([]);
    setToast({
      message: isRtl ? 'تم تسجيل خروج الموظف بأمان.' : 'Staff logged out securely.',
      type: 'success'
    });
  };

  // Submit product creation/update
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      id: editingProduct ? editingProduct.id : prodFormSlug || `p-${Date.now()}`,
      slug: prodFormSlug || `p-${Date.now()}`,
      title: { ar: prodFormTitleAr, en: prodFormTitleEn },
      tagline: { ar: prodFormTaglineAr, en: prodFormTaglineEn },
      desc: { ar: prodFormDescAr, en: prodFormDescEn },
      bullets: {
        ar: prodFormBulletsAr.split('\n').filter(b => b.trim() !== ''),
        en: prodFormBulletsEn.split('\n').filter(b => b.trim() !== '')
      }
    };

    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct 
      ? `/api/admin/products/${productType}/${editingProduct.id}`
      : `/api/admin/products/${productType}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({
          message: isRtl ? 'تم حفظ بيانات المنتج بنجاح في قاعدة البيانات' : 'Product configurations saved successfully.',
          type: 'success'
        });
        setShowProductForm(false);
        setEditingProduct(null);
        fetchProducts();
      } else {
        setToast({ message: data.error || 'Error processing', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Communication error with API', type: 'error' });
    }
  };

  // Delete product
  const handleDeleteProduct = async (type: string, id: string) => {
    if (!token) return;
    if (!window.confirm(isRtl ? 'هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من العرض العام؟' : 'Are you sure you want to permanently delete this product entry?')) return;

    try {
      const res = await fetch(`/api/admin/products/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setToast({
          message: isRtl ? 'تم حذف المنتج من قاعدة البيانات المباشرة.' : 'Product purged from directory successfully.',
          type: 'success'
        });
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Open product for edit
  const openEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductType(prod.type);
    setProdFormTitleAr(prod.title.ar);
    setProdFormTitleEn(prod.title.en);
    setProdFormSlug(prod.slug);
    setProdFormTaglineAr(prod.tagline.ar);
    setProdFormTaglineEn(prod.tagline.en);
    setProdFormDescAr(prod.desc.ar);
    setProdFormDescEn(prod.desc.en);
    setProdFormBulletsAr(prod.bullets.ar.join('\n'));
    setProdFormBulletsEn(prod.bullets.en.join('\n'));
    setShowProductForm(true);
  };

  // Open new product form
  const openNewProduct = () => {
    setEditingProduct(null);
    setProdFormTitleAr('');
    setProdFormTitleEn('');
    setProdFormSlug('');
    setProdFormTaglineAr('');
    setProdFormTaglineEn('');
    setProdFormDescAr('');
    setProdFormDescEn('');
    setProdFormBulletsAr('');
    setProdFormBulletsEn('');
    setShowProductForm(true);
  };

  // Filter leads list
  const filteredLeads = leadFilter === 'all' 
    ? leads 
    : leads.filter(l => l.type === leadFilter);

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        dir={isRtl ? 'rtl' : 'ltr'}
        className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200"
      >
        
        {/* Header / Brand Rail */}
        <div className="bg-brand text-white p-5 px-6 sm:px-8 shrink-0 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Layers className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none">
                {isRtl ? 'نظام إدارة المحتوى والعلاقات بنك فلسطين (CMS)' : 'Bank of Palestine CMS & Lead Control'}
              </h2>
              <p className="text-[10px] text-brand-light font-bold mt-1 uppercase tracking-widest">
                {isRtl ? 'محيط آمن ومحمي لموظفي البنك وأمناء التحرير' : 'Staff Secure Editorial & CRM Workspace'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-white/15 hover:bg-white/25 text-white text-xs font-black px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            {isRtl ? 'إغلاق ومغادرة الخادم' : 'Close CMS'}
          </button>
        </div>

        {/* CMS Notification Toast */}
        {toast && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className={`p-4 rounded-xl shadow-xl text-xs font-black border ${
              toast.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {toast.message}
            </div>
          </div>
        )}

        {/* Core Screen */}
        {!token ? (
          /* ==========================================
             1. SECURE LOGIN VIEW FOR CMS
             ========================================== */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6">
            <div className="bg-white rounded-2xl border border-gray-150 p-8 w-full max-w-md shadow-lg text-right">
              
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-gray-900">
                  {isRtl ? 'بوابة الموظفين المصرح لهم' : 'Authorized Staff Core Entry'}
                </h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  {isRtl 
                    ? 'الرجاء إدخال بيانات الاعتماد الممنوحة لك لتفعيل خط التحرير المصرفي المباشر.'
                    : 'Access is restricted to authorized marketing, sales, and content editing staff.'}
                </p>
              </div>

              {loginError && (
                <div className="bg-rose-50 text-rose-700 border border-rose-150 p-3.5 rounded-xl text-xs font-bold text-center mb-4">
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-right">
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    {isRtl ? 'اسم مستخدم المحرر (Staff ID)' : 'Editor Username (Staff ID)'}
                  </label>
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    {isRtl ? 'كلمة المرور السرية' : 'Security Password'}
                  </label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold focus:ring-1 focus:ring-brand focus:outline-none text-right font-mono"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-[11px] text-emerald-800 leading-relaxed font-medium">
                  💡 {isRtl ? 'معلومات تجريبية جاهزة للمصادقة السريعة المباشرة.' : 'Seeded credentials loaded for instant testing.'}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingLogin}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingLogin ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{isRtl ? 'تحقق ومصادقة الدخول' : 'Authorize Secure Access'}</span>
                  )}
                </button>
              </form>

            </div>
          </div>
        ) : (
          /* ==========================================
             2. CMS LOGGED-IN WORKSPACE
             ========================================== */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left/Sidebar navigation options inside CMS */}
            <div className="w-full md:w-64 bg-slate-50 border-r md:border-b-0 border-gray-200 shrink-0 p-4 space-y-2 text-right flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
              
              <div className="hidden md:block pb-4 mb-4 border-b border-gray-200 text-center">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-widest">
                  {isRtl ? 'المستخدم النشط' : 'Active Personnel'}
                </span>
                <span className="text-xs font-black text-gray-800 block mt-1">
                  staff_editor (Content Master)
                </span>
              </div>

              {[
                { id: 'leads', label: isRtl ? 'صندوق الوارد والطلبات' : 'Leads Inbox (CRM)', icon: Users },
                { id: 'products', label: isRtl ? 'إدارة المنتجات البنكية' : 'Manage Products', icon: FolderOpen },
                { id: 'campaigns', label: isRtl ? 'الحملات الترويجية' : 'Manage Campaigns', icon: Award },
                { id: 'branches', label: isRtl ? 'الفروع والمواقع' : 'Manage Branches', icon: MapPin }
              ].map((opt) => {
                const isActive = activeTab === opt.id;
                const IconComp = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setActiveTab(opt.id as any)}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer whitespace-nowrap ${
                      isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'
                    } ${
                      isActive 
                        ? 'bg-brand text-white shadow-md' 
                        : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}

              <div className="hidden md:block pt-8 mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isRtl ? 'تسجيل الخروج الآمن' : 'Logout Editor'}</span>
                </button>
              </div>

            </div>

            {/* Main Content Workspace viewport */}
            <div className="flex-1 p-6 overflow-y-auto bg-white text-right">
              
              {/* ==========================================
                 TAB 1: LEADS INBOX (CRM VIEW)
                 ========================================== */}
              {activeTab === 'leads' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        {isRtl ? 'صندوق الطلبات واستمارات الاهتمام الواردة' : 'CRM Leads Intake Management'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">
                        {isRtl 
                          ? 'استعرض وقم بتتبع كافة العملاء المحتملين الذين أبدوا اهتماماً بالتمويل أو تقدموا بشكاوى.'
                          : 'Review real-time registrations submitted via public forms, inquiries, and job applications.'}
                      </p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        { id: 'all', label: isRtl ? 'الكل' : 'All' },
                        { id: 'contact', label: isRtl ? 'اتصال بنا' : 'Contacts' },
                        { id: 'newsletter', label: isRtl ? 'نشرة بريدية' : 'Newsletters' },
                        { id: 'loan-inquiry', label: isRtl ? 'طلبات التمويل' : 'Loan Inquiries' },
                        { id: 'card-inquiry', label: isRtl ? 'طلب بطاقات' : 'Card Inquiries' },
                        { id: 'career', label: isRtl ? 'طلبات توظيف' : 'Career Apps' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setLeadFilter(f.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            leadFilter === f.id 
                              ? 'bg-brand text-white border-brand' 
                              : 'bg-slate-50 text-gray-500 border-gray-200 hover:bg-slate-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leads data layout */}
                  {filteredLeads.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 border border-gray-150 border-dashed rounded-2xl">
                      <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-gray-400">
                        {isRtl ? 'لا توجد طلبات واردة مطابقة لهذا الفلتر حالياً.' : 'No active client leads correspond to this criteria.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left: Leads Table */}
                      <div className="lg:col-span-8 overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-xs text-right">
                          <thead className="bg-slate-50 text-gray-600 font-extrabold border-b border-gray-200">
                            <tr>
                              <th className="p-3">{isRtl ? 'نوع الطلب' : 'Type'}</th>
                              <th className="p-3">{isRtl ? 'الاسم / البيانات' : 'Identifier'}</th>
                              <th className="p-3">{isRtl ? 'التاريخ والوقت' : 'Timestamp'}</th>
                              <th className="p-3 text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-150">
                            {filteredLeads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-slate-50/50">
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    lead.type === 'contact' ? 'bg-blue-100 text-blue-700' :
                                    lead.type === 'newsletter' ? 'bg-amber-100 text-amber-700' :
                                    lead.type === 'loan-inquiry' ? 'bg-emerald-100 text-emerald-700' :
                                    lead.type === 'card-inquiry' ? 'bg-purple-100 text-purple-700' :
                                    'bg-indigo-100 text-indigo-700'
                                  }`}>
                                    {lead.type}
                                  </span>
                                </td>
                                <td className="p-3 font-bold text-gray-800">
                                  {lead.data.name || lead.data.email || 'Anonymous Participant'}
                                </td>
                                <td className="p-3 font-mono text-gray-400">
                                  {lead.timestamp.substring(0, 16).replace('T', ' ')}
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => setSelectedLead(lead)}
                                    className="p-1.5 bg-gray-100 hover:bg-brand hover:text-white rounded text-gray-600 transition-all cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Right: Lead details viewer */}
                      <div className="lg:col-span-4 bg-slate-50 border border-gray-150 rounded-xl p-5 space-y-4">
                        <h4 className="text-xs font-black text-gray-900 border-b border-gray-200 pb-2 uppercase tracking-wider">
                          {isRtl ? 'تفاصيل الطلب المحدد' : 'Selected Lead Metadata'}
                        </h4>

                        {selectedLead ? (
                          <div className="space-y-3.5 text-xs">
                            <div>
                              <span className="text-gray-400 block">{isRtl ? 'مُعرّف الطلب:' : 'Lead Unique ID:'}</span>
                              <strong className="text-gray-800 font-mono">{selectedLead.id}</strong>
                            </div>
                            <div>
                              <span className="text-gray-400 block">{isRtl ? 'التاريخ والوقت:' : 'Received at:'}</span>
                              <strong className="text-gray-800">{selectedLead.timestamp}</strong>
                            </div>

                            <div className="bg-white p-3.5 border border-gray-200 rounded-lg space-y-2.5">
                              {Object.entries(selectedLead.data).map(([key, val]: any) => (
                                <div key={key} className="border-b border-slate-50 pb-1.5 last:border-0">
                                  <span className="text-[10px] font-bold text-brand uppercase block">{key}:</span>
                                  <span className="text-gray-800 font-bold block mt-0.5">{String(val)}</span>
                                </div>
                              ))}
                            </div>

                            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded text-emerald-700 font-bold">
                              ✓ {isRtl ? 'هذا الطلب نشط ومحفوظ بأمان في خط تتبع المبيعات.' : 'Lead secured and cached in marketing channels.'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-10 text-gray-400 text-xs">
                            {isRtl ? 'يرجى اختيار طلب من الجدول لعرض تفاصيله الكاملة هنا.' : 'Select a registration from the table to audit detailed parameters.'}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* ==========================================
                 TAB 2: PRODUCTS CATALOG MANAGER
                 ========================================== */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-150 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        {isRtl ? 'إدارة كتالوج المنتجات المعروضة' : 'Bilingual Products Catalog Editor'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">
                        {isRtl 
                          ? 'قم بتعديل، إضافة، أو حذف أنواع الحسابات، القروض، والبطاقات الائتمانية المعروضة في الصفحات العامة للموقع.'
                          : 'Create, update, or delete bank offerings in real-time. Changes propagate instantly.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={openNewProduct}
                        className="bg-brand hover:bg-brand-dark text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isRtl ? 'إضافة منتج مصرفي جديد' : 'Register New Offering'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Form Overlay inside the CMS container */}
                  {showProductForm && (
                    <div className="bg-slate-50 border-2 border-brand/20 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h4 className="text-sm font-black text-brand">
                          {editingProduct 
                            ? (isRtl ? 'تعديل منتج مصرفي' : 'Update Bank Product') 
                            : (isRtl ? 'إنشاء منتج مصرفي جديد' : 'Configure New Bank Offering')}
                        </h4>
                        <button 
                          onClick={() => setShowProductForm(false)}
                          className="text-xs font-bold text-gray-400 hover:text-gray-600"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-gray-700">
                        <div>
                          <label className="block mb-1">{isRtl ? 'نوع المنتج البنكي:' : 'Asset Type:'}</label>
                          <select 
                            value={productType}
                            onChange={(e) => setProductType(e.target.value as any)}
                            disabled={!!editingProduct}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2"
                          >
                            <option value="accounts">{isRtl ? 'حساب مصرفي (Accounts)' : 'Bank Account'}</option>
                            <option value="loans">{isRtl ? 'منتج تمويل وقروض (Loans)' : 'Lending Product'}</option>
                            <option value="cards">{isRtl ? 'بطاقة ائتمانية (Cards)' : 'Credit Card'}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-1">{isRtl ? 'الرابط الفرعي (Slug):' : 'Web URL Slug:'}</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="e.g. platinum-savings"
                            value={prodFormSlug}
                            onChange={(e) => setProdFormSlug(e.target.value)}
                            disabled={!!editingProduct}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2 font-mono text-right"
                          />
                        </div>

                        <div className="border-t border-gray-200 md:col-span-2 pt-2 mt-2">
                          <span className="text-[10px] text-brand uppercase tracking-widest block mb-2">{isRtl ? 'البيانات باللغة العربية' : 'Arabic Localizations'}</span>
                        </div>

                        <div>
                          <label className="block mb-1">{isRtl ? 'اسم المنتج (العربية):' : 'Title (Arabic):'}</label>
                          <input 
                            type="text" 
                            required 
                            value={prodFormTitleAr}
                            onChange={(e) => setProdFormTitleAr(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2 text-right"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">{isRtl ? 'العبارة الترويجية (العربية):' : 'Tagline (Arabic):'}</label>
                          <input 
                            type="text" 
                            required 
                            value={prodFormTaglineAr}
                            onChange={(e) => setProdFormTaglineAr(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2 text-right"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block mb-1">{isRtl ? 'شرح وصفي للمنتج (العربية):' : 'Description (Arabic):'}</label>
                          <textarea 
                            rows={3}
                            required 
                            value={prodFormDescAr}
                            onChange={(e) => setProdFormDescAr(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2 text-right"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block mb-1">{isRtl ? 'ميزات ومزايا المنتج (سطر لكل ميزة باللغة العربية):' : 'Bullets / Features (One per line - Arabic):'}</label>
                          <textarea 
                            rows={3}
                            required 
                            placeholder={isRtl ? 'موافقات سريعة فورية\nلا توجد رسوم صيانة شهرياً' : 'Line 1\nLine 2'}
                            value={prodFormBulletsAr}
                            onChange={(e) => setProdFormBulletsAr(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2 text-right"
                          />
                        </div>

                        <div className="border-t border-gray-200 md:col-span-2 pt-2 mt-2">
                          <span className="text-[10px] text-brand uppercase tracking-widest block mb-2">{isRtl ? 'البيانات باللغة الإنجليزية' : 'English Localizations'}</span>
                        </div>

                        <div>
                          <label className="block mb-1">{isRtl ? 'اسم المنتج (الانجليزية):' : 'Title (English):'}</label>
                          <input 
                            type="text" 
                            required 
                            value={prodFormTitleEn}
                            onChange={(e) => setProdFormTitleEn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">{isRtl ? 'العبارة الترويجية (الانجليزية):' : 'Tagline (English):'}</label>
                          <input 
                            type="text" 
                            required 
                            value={prodFormTaglineEn}
                            onChange={(e) => setProdFormTaglineEn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block mb-1">{isRtl ? 'شرح وصفي للمنتج (الانجليزية):' : 'Description (English):'}</label>
                          <textarea 
                            rows={3}
                            required 
                            value={prodFormDescEn}
                            onChange={(e) => setProdFormDescEn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block mb-1">{isRtl ? 'ميزات ومزايا المنتج (سطر لكل ميزة باللغة الإنجليزية):' : 'Bullets / Features (One per line - English):'}</label>
                          <textarea 
                            rows={3}
                            required 
                            placeholder="Line 1\nLine 2"
                            value={prodFormBulletsEn}
                            onChange={(e) => setProdFormBulletsEn(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-2"
                          />
                        </div>

                        <div className="md:col-span-2 pt-4 flex gap-3">
                          <button
                            type="submit"
                            className="flex-1 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs py-3 rounded-lg shadow-md transition-all cursor-pointer"
                          >
                            {isRtl ? 'حفظ ونشر التعديلات المصرفية' : 'Publish to Live Catalog'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowProductForm(false)}
                            className="px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Live lists */}
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-right">
                        <thead className="bg-slate-50 text-gray-600 font-extrabold border-b border-gray-200">
                          <tr>
                            <th className="p-3">{isRtl ? 'النوع' : 'Type'}</th>
                            <th className="p-3">{isRtl ? 'اسم المنتج البنكي' : 'Product Name'}</th>
                            <th className="p-3">{isRtl ? 'الرابط الفرعي (Slug)' : 'Slug'}</th>
                            <th className="p-3 text-center">{isRtl ? 'إجراءات تفعيل' : 'Publish Tools'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-150">
                          {products.map((prod) => (
                            <tr key={`${prod.type}-${prod.id}`} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                                  prod.type === 'accounts' ? 'bg-indigo-100 text-indigo-700' :
                                  prod.type === 'loans' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {prod.type}
                                </span>
                              </td>
                              <td className="p-3 font-bold text-gray-800">
                                <div className="text-sm font-black">{prod.title[lang]}</div>
                                <div className="text-[10px] text-gray-400 font-medium mt-0.5">{prod.tagline[lang]}</div>
                              </td>
                              <td className="p-3 font-mono text-gray-400">{prod.slug}</td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditProduct(prod)}
                                    className="p-1.5 bg-gray-100 hover:bg-brand hover:text-white rounded text-gray-600 transition-all cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.type, prod.id)}
                                    className="p-1.5 bg-gray-100 hover:bg-rose-600 hover:text-white rounded text-gray-600 transition-all cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ==========================================
                 TAB 3: PROMOTIONS AND CAMPAIGNS
                 ========================================== */}
              {activeTab === 'campaigns' && (
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-gray-150 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        {isRtl ? 'أحدث العروض والحملات المصرفية النشطة' : 'Active Promotions & Campaigns'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">
                        {isRtl 
                          ? 'استعرض الحملات التسويقية النشطة على الصفحة الرئيسية وقم بتعديل أو سحب أي عرض بشكل مباشر.'
                          : 'Monitor active promo banners in real-time.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaigns.map((camp) => (
                      <div key={camp.id} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden flex flex-col justify-between">
                        <img src={camp.image} alt="" className="h-40 w-full object-cover" />
                        <div className="p-5 space-y-2">
                          <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded">{camp.badge[lang]}</span>
                          <h4 className="text-sm font-black text-gray-900">{camp.title[lang]}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{camp.desc[lang]}</p>
                        </div>
                        <div className="p-4 bg-gray-100 border-t border-gray-200/50 text-left">
                          <button 
                            onClick={async () => {
                              if (!token) return;
                              if (!window.confirm('Delete Campaign?')) return;
                              const res = await fetch(`/api/admin/campaigns/${camp.id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              if (res.ok) {
                                setToast({ message: 'Campaign withdrawn successfully', type: 'success' });
                                fetchCampaigns();
                              }
                            }}
                            className="p-1.5 bg-white hover:bg-rose-600 hover:text-white border border-gray-200 text-gray-500 rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ==========================================
                 TAB 4: BRANCHES MANAGER
                 ========================================== */}
              {activeTab === 'branches' && (
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-gray-150 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        {isRtl ? 'شبكة الفروع والمكاتب والصرافات' : 'Bank of Palestine Branch Network'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-1">
                        {isRtl 
                          ? 'تتبع مواقع الفروع، وساعات العمل الرسمية، وأرقام هواتف الدعم المباشرة للزبائن.'
                          : 'Monitor physical presence centers across geographic locations.'}
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50 text-gray-600 font-extrabold border-b border-gray-200">
                        <tr>
                          <th className="p-3">{isRtl ? 'اسم الفرع' : 'Branch Title'}</th>
                          <th className="p-3">{isRtl ? 'العنوان الجغرافي' : 'Address'}</th>
                          <th className="p-3">{isRtl ? 'ساعات العمل' : 'Hours'}</th>
                          <th className="p-3">{isRtl ? 'رقم الهاتف' : 'Phone'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150">
                        {branches.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50">
                            <td className="p-3 font-extrabold text-gray-800">{b.name[lang]}</td>
                            <td className="p-3 text-gray-500">{b.address[lang]}</td>
                            <td className="p-3 font-bold text-gray-600">{b.hours[lang]}</td>
                            <td className="p-3 font-mono text-gray-400">{b.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
