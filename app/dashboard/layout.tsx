'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard, Star, MessageSquare, QrCode,
  Settings, LogOut, Bell, ChevronDown, Building2
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/reviews', label: 'التقييمات', icon: Star },
  { href: '/requests', label: 'طلب تقييمات', icon: QrCode },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-l border-gray-100 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F6E56] flex items-center justify-center">
              <Star className="w-4.5 h-4.5 text-white fill-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-none">دارة السمعة</div>
              <div className="text-xs text-[#0F6E56] mt-0.5">لوحة التحكم</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#0F6E56] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F6E56]'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Plan badge */}
        <div className="p-4 border-t border-gray-100">
          <div className="p-3 rounded-xl bg-[#EF9F27]/10 border border-[#EF9F27]/20 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#D4850F]">الخطة المجانية</span>
              <Building2 className="w-3.5 h-3.5 text-[#D4850F]" />
            </div>
            <Link href="/pricing" className="text-xs text-[#0F6E56] font-medium hover:underline">
              ترقية الآن ←
            </Link>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#0F6E56]/20 flex items-center justify-center text-[#0F6E56] font-bold text-sm">
                {session?.user?.name?.charAt(0) || 'م'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{session?.user?.name || 'المستخدم'}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="text-gray-300 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {navItems.find(n => n.href === pathname)?.label || 'لوحة التحكم'}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF9F27] alert-pulse" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
