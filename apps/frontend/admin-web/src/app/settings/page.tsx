'use client';

import { Settings, Bell, Shield, Palette, Database } from 'lucide-react';

const settingSections = [
  { icon: Bell, label: 'Notifications', desc: 'Configure alert preferences', color: '#f59e0b' },
  { icon: Shield, label: 'Security', desc: 'Password, 2FA, and access control', color: '#10b981' },
  { icon: Palette, label: 'Appearance', desc: 'Theme and display settings', color: '#7c3aed' },
  { icon: Database, label: 'Data & Storage', desc: 'Manage data and storage usage', color: '#06b6d4' },
];

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#7c3aed',
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '999px',
            padding: '3px 10px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '10px',
          }}
        >
          Configuration
        </span>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.5px',
          }}
        >
          Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Customize the admin panel and platform configuration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {settingSections.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              animation: 'fadeInUp 0.4s ease forwards',
              animationDelay: `${i * 80}ms`,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}30`;
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `${s.color}18`,
                border: `1px solid ${s.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <s.icon size={20} color={s.color} />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
              {s.label}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{s.desc}</p>
            <p
              style={{
                fontSize: '12px',
                color: s.color,
                marginTop: '16px',
                fontWeight: 600,
              }}
            >
              Coming soon →
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
