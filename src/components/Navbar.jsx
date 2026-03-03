import { NavLink } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/recipes', label: 'Recipes' },
  { to: '/add-recipe', label: 'Add Recipe' },
  { to: '/favorites', label: 'Favorites' },
]

export default function Navbar() {
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

        <div className="navbar-auth">
          <NavLink
            to="/login"
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            Login
          </NavLink>
          <NavLink to="/signup" className="btn btn-primary btn-sm">
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  )
}
