'use client';

import { Users, Activity, TrendingUp, ArrowUpRight, Upload, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Users',
    value: '12,480',
    change: '+8.2%',
    icon: Users,
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.05))',
    iconBg: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    glow: 'rgba(124,58,237,0.2)',
    border: 'rgba(124,58,237,0.3)',
  },
  {
    label: 'Active Sessions',
    value: '3,241',
    change: '+12.5%',
    icon: Activity,
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(6,182,212,0.05))',
    iconBg: 'linear-gradient(135deg, #06b6d4, #0e7490)',
    glow: 'rgba(6,182,212,0.2)',
    border: 'rgba(6,182,212,0.3)',
  },
  {
    label: 'Assessments Done',
    value: '48,921',
    change: '+22.1%',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.05))',
    iconBg: 'linear-gradient(135deg, #10b981, #047857)',
    glow: 'rgba(16,185,129,0.2)',
    border: 'rgba(16,185,129,0.3)',
  },
];

const quickActions = [
  {
    title: 'Upload Files',
    desc: 'Upload and preview files for AI analysis',
    href: '/upload',
    icon: Upload,
    color: '#7c3aed',
  },
  {
    title: 'Manage Users',
    desc: 'View, edit and manage all users',
    href: '/users',
    icon: Users,
    color: '#06b6d4',
  },
  {
    title: 'AI Generate',
    desc: 'Generate content with HuggingFace AI',
    href: '/upload',
    icon: Zap,
    color: '#f59e0b',
  },
  {
    title: 'Relationship Health',
    desc: 'Monitor platform health metrics',
    href: '/',
    icon: Heart,
    color: '#ef4444',
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
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
            }}
          >
            Overview
          </span>
        </div>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#f8fafc',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}
        >
          Welcome back, Admin 👋
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Here&apos;s what&apos;s happening on your platform today.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              background: stat.gradient,
              border: `1px solid ${stat.border}`,
              borderRadius: '16px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 8px 32px ${stat.glow}`,
              animation: `fadeInUp 0.4s ease forwards`,
              animationDelay: `${i * 80}ms`,
              opacity: 0,
              cursor: 'default',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 48px ${stat.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${stat.glow}`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, marginBottom: '8px' }}>
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 800,
                    color: '#f8fafc',
                    letterSpacing: '-1px',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '10px',
                  }}
                >
                  <ArrowUpRight size={14} color="#10b981" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#10b981' }}>
                    {stat.change}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>vs last month</span>
                </div>
              </div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: stat.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 16px ${stat.glow}`,
                  flexShrink: 0,
                }}
              >
                <stat.icon size={20} color="#fff" />
              </div>
            </div>
            {/* Decorative blob */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: stat.iconBg,
                opacity: 0.08,
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#f8fafc',
            marginBottom: '16px',
            letterSpacing: '-0.2px',
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {quickActions.map((action, i) => (
            <Link
              key={action.title}
              href={action.href}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '18px 20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                color: '#f8fafc',
                transition: 'all 0.2s ease',
                animation: `fadeInUp 0.4s ease forwards`,
                animationDelay: `${(i + 3) * 80}ms`,
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${action.color}40`;
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${action.color}20`,
                  border: `1px solid ${action.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <action.icon size={18} color={action.color} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                  {action.title}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Placeholder Chart Area */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          animation: `fadeInUp 0.4s ease forwards`,
          animationDelay: '500ms',
          opacity: 0,
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <TrendingUp size={22} color="#7c3aed" />
        </div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#94a3b8' }}>
          Analytics charts coming soon
        </p>
        <p style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
          Rich data visualizations will appear here
        </p>
      </div>
    </div>
  );
}
