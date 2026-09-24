import { useEffect, useState } from 'react'
import type { User } from '@my-app/shared'

export type UseUsersResult = {
  users: User[]
  loading: boolean
  error: string | null
}

export function useUsers(loadUsers: () => Promise<User[]>): UseUsersResult {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchUsers() {
      try {
        setLoading(true)
        setError(null)
        const nextUsers = await loadUsers()

        if (!active) {
          return
        }

        setUsers(nextUsers)
      } catch (err) {
        if (!active) {
          return
        }

        setError(err instanceof Error ? err.message : 'Failed to load users.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void fetchUsers()

    return () => {
      active = false
    }
  }, [loadUsers])

  return { users, loading, error }
}
