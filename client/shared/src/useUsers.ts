import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@my-app/shared'

export type UseUsersResult = {
  users: User[]
  loading: boolean
  error: string | null
  refetchUsers: () => void
}

export function useUsers(loadUsers: () => Promise<User[]>): UseUsersResult {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: loadUsers,
    staleTime: 30_000,
    refetchOnMount: 'always',
  })
  const refetchUsers = useCallback(() => { void refetch() }, [refetch])

  return {
    users: data ?? [],
    loading: isPending,
    error: data === undefined && isError
      ? (error instanceof Error ? error.message : 'Failed to load users.')
      : null,
    refetchUsers,
  }
}
