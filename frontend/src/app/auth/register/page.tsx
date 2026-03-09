import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
  title: 'Get Started — TicketPilot AI',
  description: 'Create your TicketPilot AI account and start your free trial.',
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full flex flex-col items-center animate-fade-up">
        <RegisterForm />
      </div>
    </main>
  )
}
