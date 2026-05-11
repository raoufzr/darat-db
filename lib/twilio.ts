import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendWhatsAppReviewRequest(
  to: string,
  customerName: string,
  businessName: string,
  reviewLink: string
): Promise<boolean> {
  try {
    const message = `مرحباً ${customerName || 'عزيزنا'} 👋

شكراً لزيارتكم *${businessName}* 🙏

كيف كانت تجربتكم معنا؟ نود سماع رأيكم الكريم — يساعدنا ذلك على تحسين خدمتنا لكم دائماً.

⭐ شاركونا تقييمكم من هنا:
${reviewLink}

يستغرق الأمر دقيقة واحدة فقط 😊`

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
      body: message,
    })

    return true
  } catch (error) {
    console.error('Twilio error:', error)
    return false
  }
}

export async function sendSMSReviewRequest(
  to: string,
  customerName: string,
  businessName: string,
  reviewLink: string
): Promise<boolean> {
  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_FROM,
      to,
      body: `${customerName ? `مرحباً ${customerName}، ` : ''}شكراً لزيارتك ${businessName}! شاركنا تقييمك: ${reviewLink}`,
    })
    return true
  } catch (error) {
    console.error('SMS error:', error)
    return false
  }
}
