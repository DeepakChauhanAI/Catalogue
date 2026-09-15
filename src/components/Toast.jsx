import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 74,
        right: 24,
        zIndex: 100,
        background: 'var(--bg-surface-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 1.1rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <CheckCircle size={16} color="var(--color-health)" />
      <span>{message}</span>
    </div>
  );
}
