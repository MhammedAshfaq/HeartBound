'use client';

import { Users, UserPlus, Search } from 'lucide-react';

export default function UsersPage() {
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
          People
        </span>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#f8fafc',
                letterSpacing: '-0.5px',
              }}
            >
              Users
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
              Manage all platform users and their data.
            </p>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              border: 'none',
              borderRadius: '12px',
              padding: '11px 20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
            }}
          >
            <UserPlus size={15} />
            Add User
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '24px',
        }}
      >
        <Search size={16} color="#64748b" />
        <input
          type="text"
          placeholder="Search users by name or email…"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#f8fafc',
            width: '100%',
          }}
        />
      </div>

      {/* Coming soon placeholder */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '64px 32px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'rgba(6,182,212,0.12)',
            border: '1px solid rgba(6,182,212,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Users size={24} color="#06b6d4" />
        </div>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
          User management coming soon
        </p>
        <p style={{ fontSize: '13px', color: '#475569' }}>
          Full CRUD for users will appear here
        </p>
      </div>
    </div>
  );
}
