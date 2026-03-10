import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Get Started — SupportAI',
  description: 'Create your SupportAI account and start resolving tickets automatically.',
}

export default function RegisterPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 w-full flex flex-col items-center animate-fade-up">
        <RegisterForm />
      </div>
    </main>
  )
}
