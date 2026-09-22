import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../api/client'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    setSubmitting(true)

    try {
      const user = await api.users.register({ name, email })
      setMessage(`Welcome, ${user.name}. Your account is ready.`)
      setName('')
      setEmail('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="register-panel" aria-labelledby="register-title">
      <p className="eyebrow">Create your profile</p>
      <h1 id="register-title">Start with a name and email.</h1>
      <p className="intro">This form is powered by the shared oRPC contract.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      {message && <p className="form-message" role="status">{message}</p>}
    </section>
  )
}