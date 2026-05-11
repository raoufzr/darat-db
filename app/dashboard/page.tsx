'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Star, TrendingUp, MessageSquare, Clock, AlertCircle,
  RefreshCw, ThumbsUp, Zap, ArrowUpRight
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import { formatRelativeTime, getRatingColor } from '@/lib/utils'

// Mock data for demo
const mockMonthlyData = [
  { month: 'يناير', avgRating: 4.1, count: 8 },
  { month: 'فبراير', avgRating: 4.3, count: 12 },
  { month: 'مارس', avgRating: 4.0, count: 9 },
  { month: 'أبريل', avgRating: 4.5, count: 15 },
  { month: 'مايو', avgRating: 4.7, count: 20 },
  { month: 'يونيو', avgRating: 4.6, count: 17 },
]

const mockReviews = [
  { id: '1', authorName: 'أحمد محمد', rating: 5, text: 'خدمة ممتازة جداً! الطاقم محترف ومهتم بكل التفاصيل. سأعود بالتأكيد.', publishedAt: new Date(Date.now() - 3600000), replied: false, replyText: null },
  { id: '2', authorName: 'سارة العلي', rating: 4, text: 'تجربة جيدة بشكل عام. النظافة ممتازة والخدمة سريعة.', publishedAt: new Date(Date.now() - 86400000), replied: true, replyText: 'شكراً جزيلاً سارة!' },
  { id: '3', authorName: 'محمد الأحمد', rating: 3, text: 'الخدمة متوسطة، كان ينقصها بعض الاهتمام بالتفاصيل.', publishedAt: new Date(Date.now() - 172800000), replied: false, replyText: null },
  { id: '4', authorName: 'فاطمة النعيم', rating: 5, text: 'أفضل تجربة! كل شيء كان مثالياً من البداية للنهاية.', publishedAt: new Date(Date.now() - 259200000), replied: true, replyText: 'يسعدنا ذلك!' },
  { id: '5', authorName: 'عمر القحطاني', rating: 2, text: 'انتظرت وقتاً طويلاً ولم أحصل على الاهتمام المطلوب.', publishedAt: new Date(Date.now() - 345600000), replied: false, replyText: null },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'star-filled' : 'star-empty'}`} />
      ))}
    </div>
  )
}

function StatCard({ title, value, sub, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 card-hover shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="font-bold text-3xl text-gray-900 num mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({})

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status])

  const handleGenerateReply = async (review: typeof mockReviews[0]) => {
    setGeneratingId(review.id)
    try {
      const res = await fetch('/api/reviews/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId: review.id,
          reviewText: review.text,
          authorName: review.authorName,
          rating: review.rating,
          generateOnly: true,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setAiReplies(prev => ({ ...prev, [review.id]: data.reply }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setGeneratingId(null)
    }
  }

  const pendingReviews = mockReviews.filter(r => !r.replied)
  const alertReviews = mockReviews.filter(r => !r.replied && r.rating <= 3)

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#0F6E56] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            مرحباً {session?.user?.name?.split(' ')[0] || 'بك'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">هذا ملخص أداء سمعتك اليوم</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-[#0F6E56]/30 hover:text-[#0F6E56] transition-all">
          <RefreshCw className="w-4 h-4" />
          تحديث
        </button>
      </div>

      {/* Alert banner */}
      {alertReviews.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 alert-pulse" />
          <div>
            <span className="font-semibold text-red-700">تنبيه:</span>
            <span className="text-red-600 text-sm"> لديك {alertReviews.length} تقييم سلبي بدون رد منذ أكثر من 24 ساعة</span>
          </div>
          <a href="/reviews" className="mr-auto text-red-600 text-sm font-semibold hover:underline">عرض الكل ←</a>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي التقييمات" value="47" icon={Star} color="bg-amber-50 text-amber-600" trend="+12%" />
        <StatCard title="متوسط التقييم" value="4.6" sub="من 5 نجوم" icon={TrendingUp} color="bg-teal-50 text-teal-600" trend="+0.2" />
        <StatCard title="تقييمات هذا الشهر" value="17" icon={MessageSquare} color="bg-blue-50 text-blue-600" trend="+5" />
        <StatCard title="نسبة الردود" value="68%" sub={`${pendingReviews.length} بدون رد`} icon={Clock} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Chart + Quick actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">تطور التقييم (آخر 6 أشهر)</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#0F6E56] bg-[#0F6E56]/10 px-3 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              صاعد
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockMonthlyData}>
              <defs>
                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F6E56" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0F6E56" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Noto Sans Arabic' }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }}
                formatter={(val: any) => [`${val} ⭐`, 'متوسط التقييم']}
              />
              <Area type="monotone" dataKey="avgRating" stroke="#0F6E56" strokeWidth={2.5} fill="url(#tealGradient)" dot={{ fill: '#0F6E56', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-700 text-sm mb-4">توزيع التقييمات</h3>
            {[5, 4, 3, 2, 1].map(r => {
              const count = mockReviews.filter(rv => rv.rating === r).length
              const pct = Math.round((count / mockReviews.length) * 100)
              return (
                <div key={r} className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-500 w-4 num">{r}</span>
                  <Star className="w-3 h-3 star-filled" />
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-[#0F6E56] transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6 num">{count}</span>
                </div>
              )
            })}
          </div>

          <div className="bg-[#0F6E56] rounded-2xl p-5 text-white">
            <Zap className="w-6 h-6 mb-3 text-white/80" />
            <h3 className="font-bold mb-1">اطلب تقييمات جديدة</h3>
            <p className="text-white/70 text-xs mb-4">أرسل رمز QR أو WhatsApp لعملائك</p>
            <a href="/requests" className="block text-center py-2.5 rounded-xl bg-white text-[#0F6E56] font-semibold text-sm hover:bg-gray-50 transition-all">
              ابدأ الآن
            </a>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">أحدث التقييمات</h2>
          <a href="/reviews" className="text-sm text-[#0F6E56] hover:underline font-medium">عرض الكل ←</a>
        </div>

        <div className="divide-y divide-gray-50">
          {mockReviews.slice(0, 5).map(review => (
            <div key={review.id} className="p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#0F6E56]/10 flex items-center justify-center text-[#0F6E56] font-bold text-sm flex-shrink-0">
                  {review.authorName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-semibold text-gray-900 text-sm">{review.authorName}</span>
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-gray-400">{formatRelativeTime(review.publishedAt)}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>

                  {/* AI Reply box */}
                  {aiReplies[review.id] && (
                    <div className="mt-3 p-3 rounded-xl bg-[#0F6E56]/5 border border-[#0F6E56]/10">
                      <div className="text-xs text-[#0F6E56] font-semibold mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> رد مقترح بالذكاء الاصطناعي
                      </div>
                      <p className="text-gray-700 text-sm">{aiReplies[review.id]}</p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-[#0F6E56] text-white hover:bg-[#0B5743] transition-all">نشر الرد</button>
                        <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">تعديل</button>
                      </div>
                    </div>
                  )}

                  {review.replied && review.replyText && !aiReplies[review.id] && (
                    <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="text-xs text-gray-400 mb-1">ردك:</div>
                      <p className="text-gray-600 text-xs">{review.replyText}</p>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  {!review.replied && !aiReplies[review.id] ? (
                    <button
                      onClick={() => handleGenerateReply(review)}
                      disabled={generatingId === review.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F6E56]/10 text-[#0F6E56] text-xs font-semibold hover:bg-[#0F6E56] hover:text-white transition-all disabled:opacity-50"
                    >
                      {generatingId === review.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Zap className="w-3.5 h-3.5" />
                      )}
                      رد بالذكاء
                    </button>
                  ) : review.replied ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                      <ThumbsUp className="w-3 h-3" /> تم الرد
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
