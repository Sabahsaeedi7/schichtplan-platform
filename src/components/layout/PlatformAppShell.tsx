import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard, Building2, CreditCard, Package,
  Settings, FileText, LogOut, Menu, X, ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tenants',     icon: Building2,       label: 'Tenants'   },
  { to: '/billing',     icon: CreditCard,      label: 'Billing'   },
  { to: '/plans',       icon: Package,         label: 'Plans'     },
  { to: '/audit',       icon: FileText,        label: 'Audit Logs'},
  { to: '/settings',    icon: Settings,        label: 'Settings'  },
]

export function PlatformAppShell({ children }: { children: React.ReactNode }) {
  const { admin, logout } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col',
          'bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[hsl(var(--sidebar-border))]">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">SchichtPlan+</div>
            <div className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Platform Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-600/25'
                  : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {admin?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{admin?.name}</div>
              <div className="text-[11px] text-[hsl(var(--muted-foreground))] truncate">{admin?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[hsl(var(--muted-foreground))] hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center px-4 h-14 border-b border-[hsl(var(--border))] lg:hidden">
          <button onClick={() => setOpen(true)} className="btn-ghost p-2">
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 font-semibold">Platform Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
