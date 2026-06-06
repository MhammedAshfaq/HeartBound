import { LayoutDashboard, Users, Settings, LogIn } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Login', href: '/login', icon: LogIn },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted p-6">
        <h1 className="mb-8 text-lg font-bold">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-background hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="mb-6 text-2xl font-semibold">Dashboard</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {['Total Users', 'Active Sessions', 'Revenue'].map((title) => (
            <div key={title} className="rounded-xl border p-6">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-2 text-3xl font-bold">--</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border p-8 text-center text-muted-foreground">
          Dashboard content — Coming Soon
        </div>
      </main>
    </div>
  );
}
