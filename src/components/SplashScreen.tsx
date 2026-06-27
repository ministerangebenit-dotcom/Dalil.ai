import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 400);
    const t2 = setTimeout(() => setPhase('exit'), 2800);
    const t3 = setTimeout(() => onComplete(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 30% 40%, #064e3b 0%, #032b22 50%, #1a0a00 100%)',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)',
        opacity: phase === 'exit' ? 0 : 1,
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.06,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(251,191,36,0.3) 40px, rgba(251,191,36,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(251,191,36,0.3) 40px, rgba(251,191,36,0.3) 41px)',
      }} />

      {/* Red stripe accent top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #064e3b, #dc2626, #fbbf24, #064e3b)' }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
        transform: phase === 'enter' ? 'translateY(20px)' : 'translateY(0)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'rgba(251,191,36,0.12)',
          border: '1px solid rgba(251,191,36,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(251,191,36,0.15)',
        }}>
          <Shield size={32} color="#fbbf24" />
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 56, fontWeight: 100, letterSpacing: '0.15em',
            color: '#ffffff', margin: 0, lineHeight: 1,
            fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
          }}>
            DALIL
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
            <div style={{ height: 1, width: 40, background: 'rgba(251,191,36,0.4)' }} />
            <p style={{ fontSize: 11, letterSpacing: '0.25em', color: '#fbbf24', margin: 0, fontWeight: 500 }}>
              CAMEROON'S KNOWLEDGE ENGINE
            </p>
            <div style={{ height: 1, width: 40, background: 'rgba(251,191,36,0.4)' }} />
          </div>
        </div>

        {/* Flag color bar */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['#064e3b', '#dc2626', '#fbbf24'].map((c, i) => (
            <div key={i} style={{ width: 32, height: 4, borderRadius: 99, background: c, opacity: 0.9 }} />
          ))}
        </div>

        {/* Tagline */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', margin: 0, textAlign: 'center' }}>
          Ask anything about Cameroon.
        </p>
      </div>

      {/* Bottom stripe */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #064e3b, #dc2626, #fbbf24, #064e3b)' }} />
    </div>
  );
}
