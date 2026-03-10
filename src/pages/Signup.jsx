import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { data, error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    // If Supabase email confirmation is enabled, data.session will be null.
    // Show a confirmation message instead of redirecting.
    if (data.session) {
      navigate('/recipes')
    } else {
      setConfirmationSent(true)
      setSubmitting(false)
    }
  }

  if (confirmationSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <ChefHat size={40} strokeWidth={1.5} />
          </div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link to="/login" className="btn btn-primary btn-full">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <ChefHat size={40} strokeWidth={1.5} />
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join Recipe Vault and start building your cookbook</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
