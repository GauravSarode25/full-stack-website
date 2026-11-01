import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      addToast('Welcome back, Admin! Access granted.', 'success');
      const origin = location.state?.from?.pathname || '/admin';
      navigate(origin, { replace: true });
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid admin credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@cafelovebyte.com');
    setPassword('LoveByteAdmin@2026');
    addToast('Admin credentials filled. Ready to sign in.', 'info');
  };

  return (
    <div
      style={{
        paddingTop: '100px',
        paddingBottom: '4rem',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="container" style={{ maxWidth: '480px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card"
          style={{
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Decorative Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                border: '1px solid rgba(199, 139, 36, 0.3)'
              }}
            >
              <ShieldCheck size={30} />
            </div>

            <span className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
              RESTRICTED PORTAL
            </span>

            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Staff & Admin <span className="text-gradient">Sign In</span>
            </h1>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Enter your authorized credentials to manage reservations, menu, and messages.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.4rem'
                }}
              >
                <Mail size={14} color="var(--color-accent)" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                placeholder="admin@cafelovebyte.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  <Lock size={14} color="var(--color-accent)" />
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* Quick Demo Fill Helper */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-subtle)',
                fontSize: '0.8rem'
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Default Credentials</span>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <KeyRound size={13} />
                <span>Auto-Fill</span>
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Footer Back Link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <Link
              to="/"
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>← Return to Public Website</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
