import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Healthy Relationship — Admin',
  description: 'Admin Panel for the Healthy Relationship platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: '#0a0a0f',
          color: '#f8fafc',
          fontFamily: "'Inter', system-ui, sans-serif",
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        {/* Ambient background orbs */}
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />

        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Sidebar />

          {/* Main content area */}
          <main
            style={{
              marginLeft: '260px',
              flex: 1,
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top Bar */}
            <header
              style={{
                height: '64px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(10,10,15,0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 32px',
                gap: '16px',
                position: 'sticky',
                top: 0,
                zIndex: 40,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  color: '#94a3b8',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px rgba(16,185,129,0.6)',
                    display: 'inline-block',
                    animation: 'pulse-ring 2s ease-in-out infinite',
                  }}
                />
                API Online
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(124,58,237,0.3)',
                }}
              >
                A
              </div>
            </header>

            {/* Page Content */}
            <div style={{ flex: 1, padding: '32px', maxWidth: '1200px', width: '100%' }}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
