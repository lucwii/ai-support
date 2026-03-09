import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Sign In — TicketPilot AI',
  description: 'Sign in to your TicketPilot AI account.',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full flex flex-col items-center animate-fade-up">
        <LoginForm />
      </div>
    </main>
  )
}
