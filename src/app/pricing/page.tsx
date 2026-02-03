import { PricingTiers } from '@/components/PricingTiers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-24">
      {/* Back Link */}
      <div className="container-custom mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-black/60 hover:text-brand-green transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      <PricingTiers />
    </div>
  )
}
