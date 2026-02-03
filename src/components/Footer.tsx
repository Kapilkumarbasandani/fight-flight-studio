import Link from 'next/link'
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-black border-t border-brand-white/10">
      <div className="container-custom py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-brand-neon">FIGHT</span>
              <span className="text-brand-white"> & </span>
              <span className="text-brand-pink">FLIGHT</span>
            </div>
            <p className="text-brand-white/70 text-sm">
              Bangkok&apos;s premier Muay Thai & aerial dance movement studio.
            </p>
            <p className="text-brand-white/50 text-xs mt-4 italic">
              Where superheroes are made.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-white font-bold mb-4 uppercase tracking-wide text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/classes" className="text-brand-white/70 hover:text-brand-neon transition-colors text-sm">
                  Classes
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-brand-white/70 hover:text-brand-neon transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-brand-white/70 hover:text-brand-neon transition-colors text-sm">
                  Book Now
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-brand-white/70 hover:text-brand-neon transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-brand-white/70 hover:text-brand-neon transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-brand-white font-bold mb-4 uppercase tracking-wide text-sm">
              Studio Location
            </h3>
            <div className="space-y-2 text-sm text-brand-white/70">
              <p>[Address]<br />Bangkok, Thailand</p>
              <p className="mt-4">
                <a href="tel:+66XXXXXXXX" className="hover:text-brand-neon transition-colors">
                  +66 XX XXX XXXX
                </a>
              </p>
              <p>
                <a href="mailto:hello@fightandflightstudio.com" className="hover:text-brand-neon transition-colors">
                  hello@fightandflightstudio.com
                </a>
              </p>
            </div>
            <div className="mt-4 text-sm">
              <p className="text-brand-white/70 font-semibold mb-1">Hours</p>
              <p className="text-brand-white/60 text-xs">Mon–Fri: 6:00 AM – 9:00 PM</p>
              <p className="text-brand-white/60 text-xs">Sat–Sun: 8:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-brand-white font-bold mb-4 uppercase tracking-wide text-sm">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/fightandflightstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-white/70 hover:text-brand-pink transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://facebook.com/fightandflightstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-white/70 hover:text-brand-pink transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://youtube.com/@fightandflightstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-white/70 hover:text-brand-pink transition-colors"
              >
                <Youtube size={24} />
              </a>
              <a
                href="mailto:hello@fightandflightstudio.com"
                className="text-brand-white/70 hover:text-brand-pink transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-brand-white/50 text-sm">
              © {currentYear} Fight & Flight Studio. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/terms" className="text-brand-white/50 hover:text-brand-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-brand-white/50 hover:text-brand-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cancellation" className="text-brand-white/50 hover:text-brand-white transition-colors">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
