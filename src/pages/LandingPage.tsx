import { Hero }       from '@/components/landing/Hero'
import { Stats }      from '@/components/landing/Stats'
import { Features }   from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CtaBanner }  from '@/components/landing/CtaBanner'
import { Reviews }    from '@/components/landing/Reviews'
import { AboutUs }    from '@/components/landing/AboutUs'
import { Location }   from '@/components/landing/Location'
import { Contact }    from '@/components/landing/Contact'
import { Footer }     from '@/components/landing/Footer'

export function LandingPage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CtaBanner />
      <Reviews />
      <AboutUs />
      <Location />
      <Contact />
      <Footer />
    </>
  )
}