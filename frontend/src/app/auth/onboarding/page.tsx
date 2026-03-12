import OnboardingForm from '@/components/auth/onboarding/OnboardingForm'

export default function OnboardingPage() {
  return (
    <main
      className="min-h-screen flex items-start md:items-center justify-center md:px-4 md:py-12"
      style={{ background: '#080C18' }}
    >
      {/* Glow */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 w-full md:flex md:justify-center">
        <OnboardingForm />
      </div>
    </main>
  )
}
