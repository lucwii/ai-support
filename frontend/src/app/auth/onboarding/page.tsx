import OnboardingForm from '@/components/auth/onboarding/OnboardingForm'

export default function OnboardingPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: '#080C18' }}
    >
      {/* Subtle glow behind the card — same as ProductDemo */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 500,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 w-full flex justify-center">
        <OnboardingForm />
      </div>
    </main>
  )
}
