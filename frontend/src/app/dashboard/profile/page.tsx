'use client'

import PageHeader from '@/components/ui/PageHeader'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import PersonalInfoSection from '@/components/profile/PersonalInfoSection'
import PasswordSection from '@/components/profile/PasswordSection'
import { useProfile } from '@/hooks/useProfile'

export default function ProfilePage() {
  const { profile, loading, error, updateProfile, updatePassword } = useProfile()

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information and password" />

      {loading && <LoadingSkeleton type="stat" />}

      {error && !loading && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {!loading && profile && (
        <div className="flex flex-col gap-6">
          <PersonalInfoSection profile={profile} onUpdate={updateProfile} />
          {profile.provider !== 'google' && (
            <PasswordSection onUpdatePassword={updatePassword} />
          )}
        </div>
      )}
    </div>
  )
}
