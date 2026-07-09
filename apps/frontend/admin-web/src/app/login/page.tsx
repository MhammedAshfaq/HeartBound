'use client';

import { useState } from 'react';
import { Heart, Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animation: 'fadeInUp 0.4s ease forwards',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 0 32px rgba(124,58,237,0.4)',
            }}
          >
            <Heart size={24} color="#fff" fill="#fff" />
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.4px',
              marginBottom: '6px',
            }}
          >
            Admin Sign In
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Sign in to access the admin panel
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Email */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#94a3b8',
                display: 'block',
                marginBottom: '7px',
                letterSpacing: '0.3px',
              }}
            >
              Email
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <Mail size={15} color="#64748b" style={{ flexShrink: 0 }} />
              <input
                type="email"
                placeholder="admin@healthy.app"
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
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#94a3b8',
                display: 'block',
                marginBottom: '7px',
                letterSpacing: '0.3px',
              }}
            >
              Password
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <Lock size={15} color="#64748b" style={{ flexShrink: 0 }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#f8fafc',
                  width: '100%',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {showPass ? (
                  <EyeOff size={15} color="#64748b" />
                ) : (
                  <Eye size={15} color="#64748b" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(124,58,237,0.35)',
            letterSpacing: '0.2px',
            marginBottom: '16px',
          }}
        >
          Sign In
          <ArrowRight size={16} />
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#475569' }}>
          Authentication integration coming soon
        </p>
      </div>
    </div>
  );
}
