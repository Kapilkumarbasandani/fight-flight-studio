import type { Metadata } from 'next'
import { Oswald, Work_Sans } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const oswald = Oswald({ 
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Fight & Flight Studio | Muay Thai & Aerial Dance in Bangkok',
  description: 'Turn ordinary into superhero. Master Muay Thai and Aerial Dance at Bangkok\'s most inclusive movement studio. No judgment. No intimidation. Just transformation.',
  keywords: 'Muay Thai, Aerial Dance, Bangkok, Movement Studio, Fitness, Lyra, Silks, Martial Arts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${workSans.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
