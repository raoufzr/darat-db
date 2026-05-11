'use client'
import { useState } from 'react'
import { Star, Zap, ThumbsUp, Search, Filter, RefreshCw, X, CheckCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import DashboardLayout from '../dashboard/layout'

const allReviews = [
  { id: '1', authorName: 'أحمد محمد', rating: 5, text: 'خدمة ممتازة جداً! الطاقم محترف ومهتم بكل التفاصيل. سأعود بالتأكيد.', publishedAt: new Date(Date.now() - 3600000), replied: false },
  { id: '2', authorName: 'سارة العلي', rating: 4, text: 'تجربة جيدة بشكل عام. النظافة ممتازة والخدمة سريعة.', publishedAt: new Date(Date.now() - 86400000), replied: true, replyText: 'شكراً جزيلاً سارة! يسعدنا أن تجربتك كانت رائعة.' },
  { id: '3', authorName: 'محمد الأحمد', rating: 3, text: 'الخدمة متوسطة، كان ينقصها بعض الاهتمام بالتفاصيل.', publishedAt: new Date(Date.now() - 172800000), replied: false },
  { id: '4', authorName: 'فاطمة النعيم', rating: 5, text: 'أفضل تجربة! كل شيء كان مثالياً من البداية للنهاية. شكراً للفريق كله.', publishedAt: new Date(Date.now() - 259200000), replied: true, replyText: 'يسعدنا ذلك فاطمة!' },
  { id: '5', authorName: 'عمر القحطاني', rating: 2, text: 'انتظرت وقتاً طويلاً ولم أحصل على الاهتمام المطلوب. آمل التحسن.', publishedAt: new Date(Date.now() - 345600000), replied: false },
  { id: '6', authorName: 'نورة السالم', rating: 5, text: 'رائع! التجربة كانت استثنائية وسأنصح أصدقائي بالمجيء.', publishedAt: new Date(Date.now() - 432000000), replied: false },
  { id: '7', authorName: 'خالد المنصور', rating: 4, text: 'جيد جداً، الخدمة ممتازة لكن الانتظار كان طويلاً بعض الشيء.', publishedAt: new Date(Date.now() - 518400000), replied: true, replyText: 'نعتذر عن وقت الانتظار!' },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${s} ${i <= rating ? 'star-filled' : 'star-empty'}`} />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied' | 'negative'>('all')
  const [search, setSearch] = useState('')
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({})
  const [editingReply, setEditingReply] = useState<Record<string, string>>({})
  const [selectedReview, setSelectedReview] = useState<typeof allReviews[0] | null>(null)

  const filtered = allReviews.filter(r => {
    if (filter === 'pending') return !r.replied
    if (filter === 'replied') return r.replied
    if (filter === 'negative') return r.rating <= 3
    return true
  }).filter(r =>
    !search || r.authorName.includes(search) || r.text?.includes(search)
  )

  const handleGenerate = async (review: typeof allReviews[0]) => {
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
        setEditingReply(prev => ({ ...prev, [review.id]: data.reply }))
      }
    } finally {
      setGeneratingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة التقييمات</h1>
            <p className="text-gray-500 text-sm mt-1">{allReviews.length} تقييم إجمالاً</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F6E56] text-white text-sm font-semibold hover:bg-[#0B5743] transition-all">
            <RefreshCw className="w-4 h-4" />
            مزامنة Google
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث في التقييمات..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#0F6E56]/50 transition-all"
            />
          </div>
          <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'pending', label: 'بدون رد' },
              { key: 'replied', label: 'تم الرد' },
              { key: 'negative', label: 'سلبية' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as any)}
                className={`px-4 py-2.5 text-sm font-medium transition-all ${
                  filter === f.key ? 'bg-[#0F6E56] text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
          {filtered.map(review => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm card-hover">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#0F6E56]/10 flex items-center justify-center text-[#0F6E56] font-bold flex-shrink-0">
                  {review.authorName.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{review.authorName}</span>
                    <StarRating rating={review.rating} size="md" />
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      review.rating >= 4 ? 'rating-4' : review.rating === 3 ? 'rating-3' : 'rating-1'
                    }`}>
                      {review.rating >= 4 ? 'إيجابي' : review.rating === 3 ? 'محايد' : 'سلبي'}
                    </span>
                    <span className="text-xs text-gray-400 mr-auto">{formatRelativeTime(review.publishedAt)}</span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">{review.text}</p>

                  {/* Existing reply */}
                  {review.replied && review.replyText && !aiReplies[review.id] && (
                    <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mb-1">
                        <CheckCircle className="w-3.5 h-3.5" /> ردك على هذا التقييم:
                      </div>
                      <p className="text-gray-700 text-sm">{review.replyText}</p>
                    </div>
                  )}

                  {/* AI Reply */}
                  {aiReplies[review.id] && (
                    <div className="p-4 rounded-xl bg-[#0F6E56]/5 border border-[#0F6E56]/15">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#0F6E56] font-semibold flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> رد مقترح
                        </span>
                        <button onClick={() => setAiReplies(prev => { const n = {...prev}; delete n[review.id]; return n })} className="text-gray-400 hover:text-gray-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        value={editingReply[review.id] || aiReplies[review.id]}
                        onChange={e => setEditingReply(prev => ({ ...prev, [review.id]: e.target.value }))}
                        rows={3}
                        className="w-full text-sm text-gray-700 bg-transparent resize-none focus:outline-none leading-relaxed"
                      />
                      <div className="flex gap-2 mt-3">
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F6E56] text-white text-xs font-semibold hover:bg-[#0B5743] transition-all">
                          <CheckCircle className="w-3.5 h-3.5" /> نشر على Google
                        </button>
                        <button onClick={() => handleGenerate(review)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs hover:bg-gray-50 transition-all">
                          إعادة توليد
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!review.replied && !aiReplies[review.id] && (
                  <button
                    onClick={() => handleGenerate(review)}
                    disabled={generatingId === review.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0F6E56]/20 bg-[#0F6E56]/5 text-[#0F6E56] text-xs font-semibold hover:bg-[#0F6E56] hover:text-white transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    {generatingId === review.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    رد بالذكاء
                  </button>
                )}

                {review.replied && !aiReplies[review.id] && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full border border-green-100 flex-shrink-0">
                    <ThumbsUp className="w-3 h-3" /> تم الرد
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
