import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateReply(
  reviewText: string,
  authorName: string,
  rating: number,
  businessName: string,
  niche: string
): Promise<string> {
  const nicheArabic: Record<string, string> = {
    dentist: 'عيادة أسنان',
    salon: 'صالون تجميل',
    spa: 'سبا',
    restaurant: 'مطعم',
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: `أنت مدير سمعة احترافي لـ${nicheArabic[niche] || 'نشاط تجاري'} يُدعى "${businessName}". 
اكتب ردًا دافئًا واحترافيًا وموجزًا على تقييم العميل. 
قواعد مهمة:
- رد بنفس لغة التقييم (عربي أو إنجليزي)
- شخصن الرد باسم العميل
- لا تكن ردك نمطيًا أو مكررًا  
- إذا كان التقييم سلبيًا، اعتذر وأبدِ استعدادك للتحسين
- إذا كان إيجابيًا، اشكر واذكر شيئًا محددًا
- الحد الأقصى 80 كلمة`,
    messages: [
      {
        role: 'user',
        content: `اسم العميل: ${authorName}
التقييم: ${rating}/5 نجوم
نص التقييم: "${reviewText || 'بدون نص'}"

اكتب الرد فقط بدون أي مقدمة أو تعليق.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response')
  return content.text
}

export async function analyzeReviews(reviews: { text: string; rating: number }[]): Promise<{
  keywords: string[]
  sentiment: string
  suggestions: string[]
}> {
  const reviewsText = reviews
    .slice(0, 20)
    .map(r => `(${r.rating}⭐) ${r.text}`)
    .join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: 'أنت محلل بيانات للتقييمات. رد بـ JSON فقط.',
    messages: [
      {
        role: 'user',
        content: `حلل هذه التقييمات وأعطني JSON بهذا الشكل:
{
  "keywords": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"],
  "sentiment": "إيجابي/محايد/سلبي",
  "suggestions": ["اقتراح1", "اقتراح2", "اقتراح3"]
}

التقييمات:
${reviewsText}`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected')
  const json = content.text.match(/\{[\s\S]*\}/)
  if (!json) throw new Error('No JSON')
  return JSON.parse(json[0])
}
