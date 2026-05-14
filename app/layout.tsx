import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Providers from "@/components/providers"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from 'next'

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL 
      ? process.env.NEXT_PUBLIC_SITE_URL 
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://localhost:3000'
  ),
  title: {
    template: '%s | MyLink',
    default: 'MyLink - 나만의 모든 링크를 하나의 페이지로',
  },
  description: '여러 곳에 흩어져 있는 나의 소셜 미디어, 포트폴리오를 MyLink에서 쉽고 빠르게 정리하고 공유하세요.',
  openGraph: {
    title: 'MyLink',
    description: '나만의 모든 링크를 하나의 페이지로',
    url: 'https://mylink.com',
    siteName: 'MyLink',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyLink',
    description: '나만의 모든 링크를 하나의 페이지로',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
