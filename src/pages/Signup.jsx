import { Link } from 'react-router-dom'
import { ChefHat } from 'lucide-react'

export default function Signup() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <ChefHat size={40} strokeWidth={1.5} />
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Join Recipe Vault and start building your cookbook</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Jane Smith"
              autoComplete="name"
              disabled
            />
          </div>
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
              placeholder="Create a strong password"
              autoComplete="new-password"
              disabled
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled>
            Create Account
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
        <p className="form-note">Authentication coming soon.</p>
      </div>
    </div>
  )
}
