'use client'
import { useState } from 'react'
import { Check, Star, Zap, Building2, Crown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '../dashboard/layout'

const plans = [
  {
    id: 'basic',
    name: 'أساسي',
    nameEn: 'Basic',
    price: 29,
    icon: Star,
    color: 'border-gray-200',
    desc: 'مثالي للنشاط التجاري المنفرد',
    features: [
      'موقع واحد',
      'ردود AI غير محدودة',
      'رمز QR للتقييم',
      'إشعارات التقييمات الجديدة',
      'تقارير أساسية',
    ],
    notIncluded: ['WhatsApp تلقائي', 'تحليل المنافسين', 'تقارير PDF', 'API access'],
    cta: 'ابدأ بالخطة الأساسية',
    highlight: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE,
  },
  {
    id: 'pro',
    name: 'احترافي',
    nameEn: 'Pro',
    price: 49,
    icon: Zap,
    color: 'border-[#0F6E56]',
    desc: 'للنشاط الجاد في بناء سمعته',
    features: [
      'موقع واحد',
      'ردود AI غير محدودة',
      'WhatsApp تلقائي للعملاء',
      'تحليل المنافسين',
      'تقارير PDF شهرية',
      'إشعارات فورية',
      'دعم أولوي',
    ],
    notIncluded: [],
    cta: 'ابدأ تجربة مجانية 14 يوم',
    highlight: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE,
  },
  {
    id: 'multi',
    name: 'متعدد الفروع',
    nameEn: 'Multi-Location',
    price: 99,
    icon: Building2,
    color: 'border-gray-200',
    desc: 'للسلاسل والأعمال متعددة الفروع',
    features: [
      'حتى 5 مواقع',
      'كل مزايا الاحترافي',
      'لوحة مركزية للفروع',
      'تقارير مقارنة الفروع',
      'API access',
      'مدير حساب مخصص',
    ],
    notIncluded: [],
    cta: 'تواصل مع الفريق',
    highlight: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_MULTI_PRICE,
  },
]

const faqs = [
  { q: 'هل هناك تجربة مجانية؟', a: 'نعم، الخطة الاحترافية تأتي بتجربة مجانية 14 يوماً بدون أي التزام.' },
  { q: 'كيف يعمل الرد التلقائي بالذكاء الاصطناعي؟', a: 'عند وصول تقييم جديد، يقرأ النظام محتواه ويولد رداً مناسباً بأسلوبك. يمكنك مراجعته وتعديله قبل النشر.' },
  { q: 'هل يمكن إلغاء الاشتراك في أي وقت؟', a: 'نعم، يمكنك الإلغاء في أي وقت دون أي رسوم إضافية.' },
  { q: 'ما هي طرق الدفع المقبولة؟', a: 'نقبل جميع بطاقات Visa وMastercard وAmerican Express.' },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (planId === 'multi') {
      window.open('https://wa.me/966500000000?text=أريد الاشتراك في خطة متعددة الفروع', '_blank')
      return
    }
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">اختر خطتك</h1>
          <p className="text-gray-500">ابدأ مجاناً. لا حاجة لبطاقة ائتمان.</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`relative bg-white rounded-2xl border-2 shadow-sm p-7 flex flex-col ${plan.color} ${plan.highlight ? 'shadow-lg shadow-teal-100' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3 right-1/2 translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-[#0F6E56] text-white text-xs font-bold whitespace-nowrap">
                  <Crown className="w-3 h-3" /> الأكثر طلباً
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? 'bg-[#0F6E56] text-white' : 'bg-gray-100 text-gray-600'}`}>
                <plan.icon className="w-6 h-6" />
              </div>

              <div className="mb-1">
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 my-5">
                <span className="text-5xl font-bold text-gray-900 num">${plan.price}</span>
                <span className="text-gray-400">/شهر</span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#0F6E56] flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      <div className="w-3 h-px bg-gray-300" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-[#0F6E56] hover:bg-[#0B5743] text-white shadow-sm'
                    : 'border-2 border-gray-200 hover:border-[#0F6E56]/30 hover:text-[#0F6E56] text-gray-700'
                }`}
              >
                {loading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Done-for-you */}
        <div className="bg-gradient-to-l from-[#0F6E56] to-[#1a9471] rounded-2xl p-7 text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">خدمة متكاملة</div>
            <h3 className="text-2xl font-bold mb-1">Done-for-You</h3>
            <p className="text-white/80">نُدير سمعتك كاملاً — الردود، الطلبات، التقارير، كل شيء.</p>
          </div>
          <div className="text-left flex-shrink-0 mr-8">
            <div className="text-4xl font-bold num">$299</div>
            <div className="text-white/60 text-sm">/شهر</div>
            <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer"
              className="mt-3 block text-center px-6 py-2.5 rounded-xl bg-[#EF9F27] hover:bg-[#D4850F] text-white font-bold text-sm transition-all">
              تواصل معنا
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-6">أسئلة شائعة</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i} className="pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-1.5">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
