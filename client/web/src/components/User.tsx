import { useUsers } from '@my-app/client-shared'
import { api } from '../api/client'

export default function User() {
  const { users, loading, error } = useUsers(() => api.users.list())

  return (
    <section className="register-panel" aria-labelledby="users-title">
      <p className="eyebrow">Users</p>
      <h1 id="users-title">User directory</h1>

      {loading && <p className="intro">Loading users...</p>}
      {error && <p className="form-message" role="alert">{error}</p>}

      {!loading && !error && users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={String(user.id)}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && users.length === 0 && (
        <p className="intro">No users found.</p>
      )}
    </section>
  )
}
