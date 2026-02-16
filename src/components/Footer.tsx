import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Fight&Flight" width={60} height={60} />
              <span className="headline-font text-2xl text-white">
                FIGHT<span className="text-neonGreen">&</span><span className="text-neonPink">FLIGHT</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Where grit meets grace. A luxury boutique fitness experience combining Muay Thai intensity with aerial artistry.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-neonGreen hover:bg-neonGreen/10 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-neonPink hover:bg-neonPink/10 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:border-neonGreen hover:bg-neonGreen/10 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="headline-font text-xl text-white mb-6">QUICK LINKS</h4>
            <ul className="space-y-3">
              {["Home", "Founders", "Offerings", "Pricing", "Schedule"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-neonGreen transition-colors uppercase text-sm tracking-wider"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="headline-font text-xl text-white mb-6">CONTACT</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neonGreen flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Power Street
                  <br />
                  Downtown, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-neonPink flex-shrink-0" />
                <span className="text-gray-400 text-sm">(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neonGreen flex-shrink-0" />
                <span className="text-gray-400 text-sm">hello@fightandflight.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Fight&Flight. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}