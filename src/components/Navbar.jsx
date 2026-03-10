import { NavLink, useNavigate } from 'react-router-dom'
import { ChefHat, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/recipes', label: 'Recipes' },
  { to: '/add-recipe', label: 'Add Recipe' },
  { to: '/favorites', label: 'Favorites' },
]

export default function Navbar() {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">
            <ChefHat size={22} strokeWidth={1.75} />
          </span>
          <span className="logo-text">Recipe Vault</span>
        </NavLink>

        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {!loading && (
          <div className="navbar-auth">
            {user ? (
              <>
                <span className="nav-user-email">{user.email}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>
                  <LogOut size={15} strokeWidth={2} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
                >
                  Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
