'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import type { UserProfile } from '@/lib/types'

interface Props {
  profile: UserProfile
  onUpload: (file: File) => Promise<string>
}

function getInitials(name: string) {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

// Deterministic boja bazirana na imenu — uvek ista boja za istog korisnika
const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
]

function getAvatarColor(name: string) {
  const index = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export default function AvatarSection({ profile, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setLoading(true)
    try {
      await onUpload(file)
    } catch {
      setError('Failed to upload image')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  const initials = getInitials(profile.full_name || profile.email)
  const colorClass = getAvatarColor(profile.full_name || profile.id)

  return (
    <div className="bg-[#0F172A] border border-white/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6">
      <div className="flex items-center gap-5">

        {/* Avatar */}
        <div className="relative shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white/[0.06]"
            />
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold ${colorClass}`}>
              {initials}
            </div>
          )}

          {/* Upload button overlay */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#6366F1] hover:bg-[#4F46E5] rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="w-3 h-3 text-white animate-spin" />
              : <Camera className="w-3 h-3 text-white" />
            }
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Info pored avatara */}
        <div>
          <p className="text-base font-semibold text-[#F1F5F9]">{profile.full_name || '—'}</p>
          <p className="text-sm text-[#475569] mt-0.5">{profile.email}</p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  )
}
