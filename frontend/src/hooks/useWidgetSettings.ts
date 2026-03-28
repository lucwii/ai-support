'use client'

import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/lib/axios'
import type { Organization, WidgetSettings } from '@/lib/types'

const DEFAULTS: WidgetSettings = {
  accent_color: '#6366F1',
  position: 'bottom-right',
  placeholder_text: 'How can we help you today?',
  button_text: 'Send message',
}

export function useWidgetSettings(organization: Organization | null) {
  const [settings, setSettings] = useState<WidgetSettings>(DEFAULTS)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!organization) return
    setSettings({
      accent_color: organization.widget_accent_color ?? DEFAULTS.accent_color,
      position: organization.widget_position ?? DEFAULTS.position,
      placeholder_text: organization.widget_placeholder_text ?? DEFAULTS.placeholder_text,
      button_text: organization.widget_button_text ?? DEFAULTS.button_text,
    })
  }, [organization])

  const setField = useCallback(<K extends keyof WidgetSettings>(key: K, value: WidgetSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    try {
      await apiClient.patch('/organizations/me/widget-settings', settings)
    } finally {
      setSaving(false)
    }
  }, [settings])

  return { settings, setField, saving, save }
}
