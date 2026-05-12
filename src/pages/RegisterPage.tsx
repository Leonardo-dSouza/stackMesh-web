import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading, error, mockLogin } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleDemoRegister = () => {
    mockLogin(email || 'demo@stackmesh.com');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary icon-fill text-3xl">
              cloud_sync
            </span>
          </div>
          <h1 className="text-headline-md font-headline-md text-primary dark:text-primary-fixed">
            stackMesh
          </h1>
        </div>

        {/* Form */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
          <h2 className="text-title-sm font-title-sm text-on-surface mb-2">Create account</h2>
          <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">
            Sign up to get started
          </p>

          {error && (
            <div className="mb-4 p-3 bg-error-container rounded-lg border border-error">
              <p className="text-body-sm font-body-sm text-on-error-container">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-label-caps font-label-caps text-on-surface">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm font-body-sm focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-label-caps font-label-caps text-on-surface">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm font-body-sm focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-label-caps font-label-caps text-on-surface">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-sm font-body-sm focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all outline-none"
                required
              />
            </div>

            {passwordError && (
              <p className="text-error text-body-sm font-body-sm">{passwordError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-primary text-on-primary hover:bg-primary-fixed-variant disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg py-3 px-4 flex items-center justify-center gap-2 w-full font-title-sm text-title-sm shadow-sm"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Demo Register Button */}
            <button
              type="button"
              onClick={handleDemoRegister}
              className="mt-2 w-full bg-surface-container-low text-primary hover:bg-surface-container border border-outline-variant transition-colors rounded-lg py-2 px-4 font-title-sm text-title-sm"
            >
              Demo Sign Up
            </button>
          </form>

          {/* Login Link */}
          <p className="text-body-sm font-body-sm text-on-surface-variant text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-fixed transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
