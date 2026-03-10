import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import SocialProof from '@/components/landing/SocialProof'
import HowItWorks from '@/components/landing/HowItWorks'
import Stats from '@/components/landing/Stats'
import Features from '@/components/landing/Features'
import ProductDemo from '@/components/landing/ProductDemo'
import Pricing from '@/components/landing/Pricing'
import Testimonials from '@/components/landing/Testimonials'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <Stats />
        <Features />
        <ProductDemo />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
