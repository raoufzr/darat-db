# دارة السمعة — Darat Al-Sumaa

منصة SaaS ذكية لإدارة سمعة الأنشطة التجارية المحلية على Google.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS (RTL)
- **Auth**: NextAuth.js + Google OAuth
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Anthropic Claude (ردود تلقائية)
- **WhatsApp**: Twilio
- **Payments**: Stripe
- **Deploy**: Vercel

## الميزات
- 🤖 ردود AI تلقائية على التقييمات (عربي/إنجليزي)
- 📱 إرسال طلبات تقييم عبر WhatsApp
- 📊 QR Code للتقييم الفوري
- 📈 تقارير وإحصائيات شهرية
- 🔔 تنبيهات للتقييمات السلبية
- 🌐 واجهة عربية RTL كاملة

## إعداد المشروع

### 1. تثبيت المتطلبات
```bash
cd darat-al-sumaa
npm install
```

### 2. قاعدة البيانات (Docker)
```bash
docker-compose up -d
```

### 3. متغيرات البيئة
```bash
cp .env.example .env.local
# عدّل القيم حسب حساباتك
```

### 4. Prisma
```bash
npm run db:push
npm run db:generate
```

### 5. Google OAuth
1. اذهب إلى [console.cloud.google.com](https://console.cloud.google.com)
2. أنشئ مشروعاً جديداً
3. فعّل Google+ API
4. أنشئ OAuth credentials
5. أضف `http://localhost:3000/api/auth/callback/google` كـ redirect URI

### 6. تشغيل المشروع
```bash
npm run dev
```
اذهب إلى `http://localhost:3000`

## هيكل الملفات
```
darat/
├── app/
│   ├── page.tsx              # الصفحة الرئيسية
│   ├── dashboard/            # لوحة التحكم
│   ├── reviews/              # إدارة التقييمات
│   ├── requests/             # طلبات التقييم (QR + WhatsApp)
│   ├── settings/             # الإعدادات
│   ├── pricing/              # الأسعار
│   └── api/
│       ├── reviews/reply     # توليد الردود بـ Claude
│       ├── reviews/sync      # مزامنة Google
│       ├── reviews/stats     # إحصائيات
│       ├── requests/send     # إرسال WhatsApp
│       └── stripe/           # المدفوعات
├── lib/
│   ├── claude.ts             # Anthropic client
│   ├── twilio.ts             # WhatsApp sender
│   ├── prisma.ts             # DB client
│   ├── auth.ts               # NextAuth config
│   └── utils.ts              # Utilities
├── prisma/
│   └── schema.prisma         # Database schema
└── types/index.ts            # TypeScript types
```

## النشر على Vercel
```bash
vercel --prod
```
أضف جميع متغيرات البيئة في لوحة Vercel.

## قاعدة البيانات (Supabase بديلاً عن Docker)
بدلاً من Docker، يمكن استخدام [supabase.com](https://supabase.com) مجاناً:
- أنشئ مشروعاً جديداً
- انسخ DATABASE_URL من Settings > Database
