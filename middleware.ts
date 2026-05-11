export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/reviews/:path*', '/requests/:path*', '/settings/:path*', '/pricing/:path*']
}
