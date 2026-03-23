'use client'

import PageHeader from '@/components/ui/PageHeader'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import AvatarSection from '@/components/profile/AvatarSection'
import PersonalInfoSection from '@/components/profile/PersonalInfoSection'
import PasswordSection from '@/components/profile/PasswordSection'
import AccountInfoSection from '@/components/profile/AccountInfoSection'
import DangerZoneSection from '@/components/profile/DangerZoneSection'
import { useProfile } from '@/hooks/useProfile'

export default function ProfilePage() {
  const { profile, loading, error, updateProfile, updatePassword, uploadAvatar, deleteAccount } = useProfile()

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information and password" />

      {loading && <LoadingSkeleton type="stat" />}

      {error && !loading && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {!loading && profile && (
        <div className="flex flex-col gap-6">
          <AvatarSection profile={profile} onUpload={uploadAvatar} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PersonalInfoSection profile={profile} onUpdate={updateProfile} />
            <AccountInfoSection profile={profile} />
          </div>

          {profile.provider !== 'google' && (
            <PasswordSection onUpdatePassword={updatePassword} />
          )}

          <DangerZoneSection onDelete={deleteAccount} />
        </div>
      )}
    </div>
  )
}
