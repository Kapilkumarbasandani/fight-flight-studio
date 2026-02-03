'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isPricingPage = pathname === '/pricing'
  const isClassesPage = pathname === '/classes'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > 50) {
        setIsScrolled(true)
        // Show header when scrolling up, hide when scrolling down
        setIsVisible(currentScrollY < lastScrollY)
      } else {
        setIsScrolled(false)
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const navLinks = [
    { href: '#home', label: 'HOME' },
    { href: '#founders', label: 'FOUNDERS' },
    { href: '#offerings', label: 'OFFERINGS' },
    { href: '#pricing', label: 'PRICING' },
    { href: '#schedule', label: 'SCHEDULE' },
  ]

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${isPricingPage || isClassesPage ? 'bg-brand-black/95 backdrop-blur-sm shadow-lg' : isScrolled ? 'bg-brand-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold">
              <span className="text-brand-neon">FIGHT</span>
              <span className="text-brand-white"> & </span>
              <span className="text-brand-pink">FLIGHT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-brand-white hover:text-brand-green transition-colors duration-300 font-bold uppercase text-sm tracking-wider cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={(e) => handleClick(e, '#pricing')}
              className="btn-primary text-sm py-3 px-6 cursor-pointer"
            >
              JOIN NOW
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-brand-white hover:text-brand-neon transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 animate-fade-in bg-brand-black/95 backdrop-blur-sm rounded-b-3xl">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="block text-brand-white hover:text-brand-green transition-colors duration-300 font-bold uppercase text-sm tracking-wider py-2 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={(e) => handleClick(e, '#pricing')}
              className="block btn-primary text-sm py-3 px-6 text-center cursor-pointer"
            >
              JOIN NOW
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
