'use client'
import { useState } from 'react'
import { Save, Building2, Phone, MapPin, Tag, Check, ExternalLink } from 'lucide-react'
import DashboardLayout from '../dashboard/layout'
import { NICHE_LABELS, NICHE_ICONS } from '@/types'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: 'عيادة الابتسامة لطب الأسنان',
    googlePlaceId: '',
    phone: '+966501234567',
    niche: 'dentist',
  })

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة بيانات نشاطك التجاري</p>
        </div>

        {/* Business profile */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F6E56]" />
            بيانات النشاط التجاري
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">اسم النشاط التجاري</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all"
                placeholder="مثال: صالون الأناقة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all"
                  placeholder="+966501234567"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">نوع النشاط</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(NICHE_LABELS) as Array<keyof typeof NICHE_LABELS>).map(key => (
                  <button
                    key={key}
                    onClick={() => setForm(p => ({ ...p, niche: key }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      form.niche === key
                        ? 'border-[#0F6E56] bg-[#0F6E56]/5 text-[#0F6E56]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{NICHE_ICONS[key]}</span>
                    {NICHE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Google Connect */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0F6E56]" />
            ربط Google Business
          </h2>
          <p className="text-gray-500 text-sm mb-5">اربط حسابك لجلب التقييمات تلقائياً</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Google Place ID
              <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" className="mr-2 text-xs text-[#0F6E56] hover:underline inline-flex items-center gap-0.5">
                كيف أجده؟ <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              value={form.googlePlaceId}
              onChange={e => setForm(p => ({ ...p, googlePlaceId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all font-mono"
              placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
              dir="ltr"
            />
            <p className="text-xs text-gray-400 mt-2">ستجد Place ID عبر الرابط أعلاه بكتابة اسم نشاطك على الخريطة</p>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm text-blue-700 font-medium">🔗 ربط Google OAuth</p>
            <p className="text-xs text-blue-600 mt-1 mb-3">للرد التلقائي على التقييمات مباشرة من المنصة</p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-blue-200 text-blue-700 text-sm font-medium hover:bg-blue-50 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              ربط Google Business Profile
            </button>
          </div>
        </div>

        {/* Notification settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#0F6E56]" />
            إعدادات التنبيهات
          </h2>
          <div className="space-y-4">
            {[
              { label: 'تنبيه عند وصول تقييم جديد', sub: 'إشعار فوري عند كل تقييم جديد على Google', defaultOn: true },
              { label: 'تنبيه للتقييمات السلبية', sub: 'تنبيه خاص لأي تقييم بنجمتين أو أقل', defaultOn: true },
              { label: 'تذكير الردود المعلقة', sub: 'تذكير يومي بالتقييمات التي لم يُرد عليها', defaultOn: false },
              { label: 'تقرير أسبوعي', sub: 'ملخص أسبوعي لأداء سمعتك على WhatsApp', defaultOn: false },
            ].map((item, i) => {
              const [on, setOn] = useState(item.defaultOn)
              return (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
                  </div>
                  <button
                    onClick={() => setOn(!on)}
                    className={`w-11 h-6 rounded-full transition-all relative ${on ? 'bg-[#0F6E56]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${on ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl bg-[#0F6E56] hover:bg-[#0B5743] text-white font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
        >
          {saved ? <><Check className="w-5 h-5" /> تم الحفظ!</> : <><Save className="w-5 h-5" /> حفظ الإعدادات</>}
        </button>
      </div>
    </DashboardLayout>
  )
}
