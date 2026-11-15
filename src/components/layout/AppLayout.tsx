import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/courses', label: 'My Courses' },
  { to: '/practice', label: 'Practice' },
  { to: '/projects', label: 'Projects' },
  { to: '/progress', label: 'Progress' },
  { to: '/settings', label: 'Settings' },
]

export default function AppLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen md:flex">
      <header className="flex items-center justify-between border-b border-slate-200 p-3 md:w-56 md:flex-col md:items-stretch md:justify-start md:border-r md:border-b-0">
        <span className="font-bold">Personal Coding Academy</span>
        <button
          type="button"
          className="rounded border px-2 py-1 md:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          Menu
        </button>
        <nav
          id="main-nav"
          aria-label="Main"
          className={`${open ? 'block' : 'hidden'} absolute top-12 right-0 left-0 bg-white p-3 md:static md:mt-4 md:block md:p-0`}
        >
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 ${isActive ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
