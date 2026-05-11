'use client'
import Link from 'next/link'
import { Star, MessageSquare, QrCode, BarChart3, Shield, Zap, Check, ArrowLeft, Phone } from 'lucide-react'

const features = [
  { icon: Star, title: 'رصد التقييمات', desc: 'تابع كل تقييم جديد على Google فور نشره مع إشعارات فورية', color: 'bg-amber-50 text-amber-600' },
  { icon: MessageSquare, title: 'ردود بالذكاء الاصطناعي', desc: 'احصل على ردود احترافية مخصصة بلمسة واحدة — عربي أو إنجليزي', color: 'bg-teal-50 text-teal-600' },
  { icon: Phone, title: 'طلب تقييمات بـ WhatsApp', desc: 'أرسل رسائل WhatsApp لعملائك بعد الزيارة لتشجيعهم على التقييم', color: 'bg-green-50 text-green-600' },
  { icon: QrCode, title: 'رمز QR للتقييم', desc: 'اطبع رمز QR في عيادتك أو صالونك لتسهيل التقييم الفوري', color: 'bg-blue-50 text-blue-600' },
  { icon: BarChart3, title: 'تقارير شهرية', desc: 'PDF تلقائي بأداء سمعتك وأبرز الكلمات والتحليلات', color: 'bg-purple-50 text-purple-600' },
  { icon: Shield, title: 'حماية سمعتك', desc: 'تنبيهات فورية للتقييمات السلبية قبل أن تؤثر على عملك', color: 'bg-red-50 text-red-600' },
]

const plans = [
  { name: 'أساسي', price: 29, desc: 'للنشاط التجاري الواحد', features: ['موقع واحد', 'ردود AI غير محدودة', 'رمز QR', 'تقارير أساسية'], cta: 'ابدأ الآن', highlight: false },
  { name: 'احترافي', price: 49, desc: 'الأكثر طلباً', features: ['موقع واحد', 'WhatsApp تلقائي', 'تحليل المنافسين', 'تقارير PDF شهرية', 'دعم أولوي'], cta: 'ابدأ مجاناً', highlight: true },
  { name: 'متعدد الفروع', price: 99, desc: 'للسلاسل والفروع', features: ['حتى 5 مواقع', 'كل مزايا الاحترافي', 'لوحة مركزية', 'API access'], cta: 'تواصل معنا', highlight: false },
]

const niches = [
  { emoji: '🦷', name: 'عيادات الأسنان' },
  { emoji: '💇', name: 'صالونات التجميل' },
  { emoji: '🧖', name: 'السبا والمساج' },
  { emoji: '🍽️', name: 'المطاعم والكافيهات' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-arabic" dir="rtl">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg leading-none">دارة السمعة</div>
              <div className="text-xs text-[#0F6E56]">Darat Al-Sumaa</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-[#0F6E56] transition-colors">المزايا</a>
            <a href="#niches" className="hover:text-[#0F6E56] transition-colors">لمن؟</a>
            <a href="#pricing" className="hover:text-[#0F6E56] transition-colors">الأسعار</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-gray-600 hover:text-[#0F6E56] transition-colors">دخول</Link>
            <Link href="/auth/signin" className="px-5 py-2.5 rounded-xl bg-[#0F6E56] hover:bg-[#0B5743] text-white text-sm font-semibold transition-all shadow-sm">
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pattern-bg pt-20 pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F6E56]/10 text-[#0F6E56] text-sm font-medium mb-8 border border-[#0F6E56]/20">
            <Zap className="w-4 h-4" />
            مخصص لعيادات الأسنان والصالونات والمطاعم
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            سمعتك على Google
            <br />
            <span className="text-[#0F6E56]">تُدار تلقائياً</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            ردّ على التقييمات بالذكاء الاصطناعي، اطلب تقييمات جديدة عبر WhatsApp، وتابع سمعتك كلها من مكان واحد.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signin" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0F6E56] hover:bg-[#0B5743] text-white font-bold text-lg transition-all shadow-lg shadow-teal-200">
              ابدأ تجربتك المجانية
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <a href="#features" className="px-8 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-[#0F6E56] hover:text-[#0F6E56] transition-all">
              شاهد كيف يعمل
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 mt-16 text-sm text-gray-500">
            {[['٢٠٠+', 'نشاط تجاري'], ['٥٠,٠٠٠+', 'رد تلقائي'], ['٤.٩', 'تقييم المنصة']].map(([val, label], i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-gray-900 num">{val}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niches */}
      <section id="niches" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">مخصص لهذه الأنشطة</h2>
          <p className="text-gray-500 mb-10">قوالب وردود مصممة خصيصاً لكل نوع نشاط</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {niches.map((n, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0F6E56]/30 transition-all card-hover">
                <div className="text-4xl mb-3">{n.emoji}</div>
                <div className="font-semibold text-gray-800">{n.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-gray-500 text-lg">من رصد التقييمات إلى الردود التلقائية وطلب التقييمات الجديدة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-7 rounded-2xl border border-gray-100 bg-white shadow-sm card-hover">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">أسعار بسيطة وشفافة</h2>
            <p className="text-gray-500">ابدأ مجاناً. لا حاجة لبطاقة ائتمان.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-7 ${plan.highlight ? 'bg-[#0F6E56] text-white shadow-xl shadow-teal-200' : 'bg-white border border-gray-100'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 right-6 px-4 py-1 rounded-full bg-[#EF9F27] text-white text-xs font-bold">
                    الأكثر طلباً
                  </div>
                )}
                <h3 className={`font-bold text-xl mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.highlight ? 'text-white/70' : 'text-gray-400'}`}>{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-bold num ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                  <span className={plan.highlight ? 'text-white/70' : 'text-gray-400'}>/شهر</span>
                </div>
                <ul className="space-y-3 mb-7">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#0F6E56]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signin" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlight ? 'bg-white text-[#0F6E56] hover:bg-gray-50' : 'bg-[#0F6E56] text-white hover:bg-[#0B5743]'
                }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0F6E56]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">ابدأ اليوم — مجاناً</h2>
          <p className="text-white/70 mb-8 text-lg">انضم لأكثر من ٢٠٠ نشاط تجاري يديرون سمعتهم بذكاء</p>
          <Link href="/auth/signin" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#EF9F27] hover:bg-[#D4850F] text-white font-bold text-xl transition-all shadow-xl">
            ابدأ مجاناً الآن
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-gray-700">دارة السمعة</span>
        </div>
        <p>© {new Date().getFullYear()} دارة السمعة. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  )
}
