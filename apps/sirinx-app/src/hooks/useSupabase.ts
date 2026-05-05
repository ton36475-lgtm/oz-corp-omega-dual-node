'use client'
import { useState, useEffect, useCallback } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'

// Generic query hook with fallback support
export function useQuery<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(String(err))
      setData(fallback)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, loading, error, refetch: run, isSupabase: isSupabaseConfigured }
}

// Generic mutation hook
export function useMutation<TArgs, TResult>(
  mutator: (args: TArgs) => Promise<TResult>,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (args: TArgs): Promise<TResult | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mutator(args)
      return result
    } catch (err) {
      setError(String(err))
      return null
    } finally {
      setLoading(false)
    }
  }, [mutator])

  return { mutate, loading, error }
}
