import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'دارة السمعة — إدارة سمعتك الرقمية',
  description: 'منصة ذكية لإدارة تقييمات Google وبناء سمعة مميزة لنشاطك التجاري',
  keywords: 'إدارة السمعة، تقييمات جوجل، سمعة تجارية',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-[#F7FAF9] font-arabic antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
