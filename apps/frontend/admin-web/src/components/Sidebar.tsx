'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogIn,
  Upload,
  Heart,
  ChevronRight,
  Bell,
  Search,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'File Upload', href: '/upload', icon: Upload },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Login', href: '/login', icon: LogIn },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        background: 'rgba(18, 18, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        padding: '0',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            }}
          >
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '-0.3px',
              }}
            >
              Healthy Rel.
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '9px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Search size={14} color="#64748b" />
          <span style={{ fontSize: '13px', color: '#64748b' }}>Search…</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '11px',
              color: '#475569',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '4px',
              padding: '2px 5px',
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Nav label */}
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '1px',
          color: '#475569',
          textTransform: 'uppercase',
          padding: '16px 20px 8px',
        }}
      >
        Navigation
      </p>

      {/* Nav items */}
      <nav style={{ padding: '0 12px', flex: 1 }}>
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '11px 12px',
                borderRadius: '10px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f8fafc' : '#94a3b8',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.1))'
                  : 'transparent',
                border: isActive
                  ? '1px solid rgba(124,58,237,0.4)'
                  : '1px solid transparent',
                boxShadow: isActive ? '0 0 20px rgba(124,58,237,0.12)' : 'none',
                transition: 'all 0.2s ease',
                animationDelay: `${i * 50}ms`,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#f8fafc';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    'transparent';
                }
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.2))'
                    : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <item.icon
                  size={15}
                  color={isActive ? '#a78bfa' : '#64748b'}
                />
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && (
                <ChevronRight size={14} color="#7c3aed" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Admin User
            </p>
            <p
              style={{
                fontSize: '11px',
                color: '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              admin@healthy.app
            </p>
          </div>
          <Bell size={14} color="#64748b" />
        </div>
      </div>
    </aside>
  );
}
