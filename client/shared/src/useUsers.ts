import { useQuery } from '@tanstack/react-query'
import type { User } from '@my-app/shared'

export type UseUsersResult = {
  users: User[]
  loading: boolean
  error: string | null
}

export function useUsers(loadUsers: () => Promise<User[]>): UseUsersResult {
  const { data = [], isPending, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: loadUsers,
    staleTime: 30_000,
  })

  return {
    users: data,
    loading: isPending,
    error: isError ? (error instanceof Error ? error.message : 'Failed to load users.') : null,
  }
}
