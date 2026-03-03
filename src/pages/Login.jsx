import { Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'

export default function Login() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <ChefHat size={40} strokeWidth={1.5} />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Recipe Vault account</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled>
            Sign In
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
        <p className="form-note">Authentication coming soon.</p>
      </div>
    </div>
  )
}
