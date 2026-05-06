import { Outlet, NavLink } from 'react-router-dom'
import Corujinha from './Corujinha'
import AdminModal from './AdminModal'
import JustificativaModal from './JustificativaModal'
import Narrator from './Narrator'
import ptBR from '../i18n/pt-BR'

const navItems = [
  { to: '/', label: ptBR.nav.home, icon: '♞' },
  { to: '/aprender', label: ptBR.nav.aprender, icon: '📖' },
  { to: '/jogar', label: ptBR.nav.jogar, icon: '🎮' },
  { to: '/exercicios', label: ptBR.nav.exercicios, icon: '🎯' },
]

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold hover:scale-105 transition-transform">
            <span className="text-3xl">♞</span>
            <span>{ptBR.app.title}</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 nav-link-underline ${
                    isActive
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:-translate-y-0.5'
                  }`
                }
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-gray-400 text-center py-4 text-sm" style={{ background: 'linear-gradient(270deg, #1a1a2e, #16213e, #1a1a2e)', backgroundSize: '200% 200%', animation: 'gradient-shift 8s ease infinite' }}>
        {ptBR.app.title} &copy; {new Date().getFullYear()} &mdash;{' '}
        {ptBR.app.subtitle}
      </footer>
      <JustificativaModal />
      <Corujinha />
      <AdminModal />
      <Narrator />
    </div>
  )
}

export default Layout
