'use client'
import { useState } from 'react'
import { QrCode, Phone, Send, Download, Copy, Check, Plus, X, MessageSquare, Users } from 'lucide-react'
import DashboardLayout from '../dashboard/layout'

// Mock QR data
const mockPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4'
const reviewLink = `https://search.google.com/local/writereview?placeid=${mockPlaceId}`

const mockRequests = [
  { id: '1', customerName: 'محمد العتيبي', customerPhone: '+966501234567', sentAt: new Date(Date.now() - 3600000), opened: true, converted: true },
  { id: '2', customerName: 'هند الزهراني', customerPhone: '+966509876543', sentAt: new Date(Date.now() - 86400000), opened: true, converted: false },
  { id: '3', customerName: 'عبدالله المطيري', customerPhone: '+966551234567', sentAt: new Date(Date.now() - 172800000), opened: false, converted: false },
]

function QRCodePlaceholder({ link }: { link: string }) {
  return (
    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center mx-auto p-4">
      <div className="grid grid-cols-7 gap-0.5 w-full h-full">
        {Array.from({ length: 49 }).map((_, i) => (
          <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'}`} />
        ))}
      </div>
    </div>
  )
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'qr' | 'whatsapp' | 'history'>('qr')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bulkPhones, setBulkPhones] = useState('')

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendWhatsApp = async () => {
    if (!phone.trim()) return
    setSending(true)
    try {
      const res = await fetch('/api/requests/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, businessId: 'demo' }),
      })
      if (res.ok) { setSent(true); setPhone(''); setName('') }
    } finally {
      setSending(false)
    }
  }

  const conversionRate = Math.round((mockRequests.filter(r => r.converted).length / mockRequests.length) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلب تقييمات جديدة</h1>
          <p className="text-gray-500 text-sm mt-1">شجّع عملاءك على مشاركة تجربتهم</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'طلبات مُرسلة', value: mockRequests.length, icon: Send, color: 'bg-blue-50 text-blue-600' },
            { label: 'تم الفتح', value: mockRequests.filter(r => r.opened).length, icon: MessageSquare, color: 'bg-amber-50 text-amber-600' },
            { label: 'معدل التحويل', value: `${conversionRate}%`, icon: Users, color: 'bg-teal-50 text-teal-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900 num">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm p-1 gap-1">
          {[
            { key: 'qr', label: 'رمز QR', icon: QrCode },
            { key: 'whatsapp', label: 'WhatsApp', icon: Phone },
            { key: 'history', label: 'السجل', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key ? 'bg-[#0F6E56] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">رمز QR للتقييم</h2>
              <p className="text-gray-500 text-sm mb-8">اطبع هذا الرمز وضعه في مكان مرئي في نشاطك التجاري</p>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
                <QRCodePlaceholder link={reviewLink} />
                <p className="text-xs text-gray-400 mt-4">امسح للتقييم على Google</p>
              </div>

              <div className="flex gap-3">
                <button onClick={handleCopyLink} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:border-[#0F6E56]/30 hover:text-[#0F6E56] transition-all">
                  {copied ? <><Check className="w-4 h-4 text-green-500" /> تم النسخ!</> : <><Copy className="w-4 h-4" /> نسخ الرابط</>}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F6E56] text-white text-sm font-semibold hover:bg-[#0B5743] transition-all">
                  <Download className="w-4 h-4" />
                  تحميل PNG
                </button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#EF9F27]/10 border border-[#EF9F27]/20">
                <p className="text-sm text-[#D4850F] font-medium">💡 نصيحة</p>
                <p className="text-xs text-[#D4850F]/80 mt-1">ضع رمز QR على منضدة الاستقبال وعلى الطاولات لمضاعفة عدد التقييمات</p>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Tab */}
        {activeTab === 'whatsapp' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Single send */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-1">إرسال فردي</h2>
              <p className="text-gray-500 text-sm mb-5">أرسل لعميل واحد بعد زيارته مباشرة</p>

              {sent && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100 mb-4 text-green-700 text-sm">
                  <Check className="w-4 h-4" /> تم إرسال الرسالة بنجاح!
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">اسم العميل (اختياري)</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="مثال: محمد"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-medium mb-1.5">رقم الهاتف *</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+966501234567"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all text-left"
                  />
                </div>
              </div>

              {/* Message preview */}
              <div className="mt-4 p-4 rounded-xl bg-[#DCF8C6] border border-green-200">
                <p className="text-xs text-gray-600 leading-relaxed">
                  مرحباً {name || 'عزيزنا'} 👋<br /><br />
                  شكراً لزيارتكم <strong>نشاطك التجاري</strong> 🙏<br /><br />
                  كيف كانت تجربتكم معنا؟ نود سماع رأيكم الكريم...<br /><br />
                  ⭐ شاركونا تقييمكم: <span className="text-blue-600 underline">رابط التقييم</span>
                </p>
              </div>

              <button
                onClick={handleSendWhatsApp}
                disabled={!phone.trim() || sending}
                className="w-full mt-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ea855] text-white font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                إرسال عبر WhatsApp
              </button>
            </div>

            {/* Bulk send */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-1">إرسال جماعي</h2>
              <p className="text-gray-500 text-sm mb-5">أرسل لعدة عملاء دفعة واحدة</p>

              <label className="block text-xs text-gray-500 font-medium mb-1.5">أرقام الهواتف (رقم في كل سطر)</label>
              <textarea
                value={bulkPhones}
                onChange={e => setBulkPhones(e.target.value)}
                placeholder={`+966501234567\n+966509876543\n+966551234567`}
                rows={6}
                dir="ltr"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all font-mono text-left resize-none"
              />

              <div className="mt-3 text-xs text-gray-400">
                {bulkPhones.split('\n').filter(p => p.trim()).length} رقم مُدخل
              </div>

              <button className="w-full mt-4 py-3 rounded-xl bg-[#0F6E56] hover:bg-[#0B5743] text-white font-bold text-sm transition-all">
                إرسال للجميع
              </button>

              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-700">⚠️ تأكد من حصولك على إذن العملاء قبل الإرسال</p>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">سجل الطلبات المُرسلة</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {mockRequests.map(req => (
                <div key={req.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0F6E56]/10 flex items-center justify-center text-[#0F6E56] font-bold text-sm">
                    {req.customerName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{req.customerName}</div>
                    <div className="text-xs text-gray-400 dir-ltr">{req.customerPhone}</div>
                  </div>
                  <div className="text-xs text-gray-400">{req.sentAt.toLocaleDateString('ar-SA')}</div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${req.opened ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                      {req.opened ? 'فُتح' : 'لم يُفتح'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${req.converted ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                      {req.converted ? '✓ قيّم' : 'لم يقيّم'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
