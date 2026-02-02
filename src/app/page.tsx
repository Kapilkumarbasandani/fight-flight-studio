import { Hero } from '@/components/Hero'
import { VideoShowcase } from '@/components/VideoShowcase'
import { BrandStory } from '@/components/BrandStory'
import { Offerings } from '@/components/Offerings'
import { Founders } from '@/components/Founders'
import { Community } from '@/components/Community'
import { CTASection } from '@/components/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <VideoShowcase />
      <BrandStory />
      <Offerings />
      <Founders />
      <Community />
      <CTASection />
    </>
  )
}
