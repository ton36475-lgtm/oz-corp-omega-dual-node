'use client'
import { useEffect, useRef, useCallback } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

interface UseRealtimeOptions<T> {
  table: string
  event?: RealtimeEvent
  filter?: string
  onEvent: (payload: { eventType: string; new: T; old: Partial<T> }) => void
}

export function useRealtime<T>({ table, event = '*', filter, onEvent }: UseRealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const onEventRef = useRef(onEvent)
  onEventRef.current = onEvent

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    let channel = supabase.channel(`realtime:${table}`)

    const config: Parameters<typeof channel.on>[1] = {
      event,
      schema: 'public',
      table,
      ...(filter ? { filter } : {}),
    }

    channel = channel.on(
      'postgres_changes' as Parameters<typeof channel.on>[0],
      config,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload: any) => {
        onEventRef.current({
          eventType: payload.eventType,
          new: payload.new as T,
          old: payload.old as Partial<T>,
        })
      },
    )

    channel.subscribe()
    channelRef.current = channel

    return () => {
      supabase!.removeChannel(channel)
    }
  }, [table, event, filter])
}

// Convenience: subscribe to a table and call a refetch function on any change
export function useRealtimeRefetch(table: string, refetch: () => void) {
  const refetchRef = useRef(refetch)
  refetchRef.current = refetch

  const handler = useCallback(() => { refetchRef.current() }, [])

  useRealtime({
    table,
    event: '*',
    onEvent: handler,
  })
}
