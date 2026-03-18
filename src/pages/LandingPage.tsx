// import { Hero }       from '@/components/landing/Hero'
// import { Stats }      from '@/components/landing/Stats'
// import { Features }   from '@/components/landing/Features'
// import { HowItWorks } from '@/components/landing/HowItWorks'
// import { CtaBanner }  from '@/components/landing/CtaBanner'
// import { Reviews }    from '@/components/landing/Reviews'
// import { AboutUs }    from '@/components/landing/AboutUs'
// import { Location }   from '@/components/landing/Location'
// import { Contact }    from '@/components/landing/Contact'
// import { Footer }     from '@/components/landing/Footer'

// export function LandingPage() {
//   return (
//     <>
//       <Hero />
//       <Stats />
//       <Features />
//       <HowItWorks />
//       <CtaBanner />
//       <Reviews />
//       <AboutUs />
//       <Location />
//       <Contact />
//       <Footer />
//     </>
//   )
// }


import { useState, useEffect } from 'react'
import { Hero }            from '@/components/landing/Hero'
import { Stats }           from '@/components/landing/Stats'
import { Features }        from '@/components/landing/Features'
import { HowItWorks }      from '@/components/landing/HowItWorks'
import { CtaBanner }       from '@/components/landing/CtaBanner'
import { Reviews }         from '@/components/landing/Reviews'
import { AboutUs }         from '@/components/landing/AboutUs'
import { Location }        from '@/components/landing/Location'
import { Contact }         from '@/components/landing/Contact'
import { Footer }          from '@/components/landing/Footer'
import { WhatsAppButton }  from '@/components/landing/WhatsAppButton'
import { Button }          from '@/components/ui/button'
import { ChevronUp }       from 'lucide-react'

export function LandingPage() {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        

        <Button
          onClick={scrollToTop}
          size="icon"
          variant="default"
          className={`
            h-12 w-12 rounded-full 
            bg-primary hover:bg-primary/90 
            shadow-[0_4px_20px_rgba(0,0,0,0.3)] 
            hover:shadow-[0_6px_30px_rgba(0,0,0,0.4)]
            hover:scale-110
            transition-all duration-300 ease-in-out
            ${showButton 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10 pointer-events-none'}
          `}
          aria-label="Volver arriba"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>

        <WhatsAppButton />
      </div>
    </>
  )
}