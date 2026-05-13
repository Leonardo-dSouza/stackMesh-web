import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Cloud } from 'lucide-react';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (password.length < 8) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Cloud className="text-[#0B5CBE]" size={48} />
          <h1 className="text-4xl font-semibold text-[#0B3B7C] tracking-tight">
            StackMesh
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">Criar conta</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Cadastre-se para começar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#FEF2F2] rounded-lg border border-[#F87171]">
              <p className="text-sm text-[#B91C1C]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#1E293B]">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:border-[#0B5CBE] focus:ring-2 focus:ring-[#0B5CBE]/20 transition-all outline-none text-[#1E293B]"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-[#1E293B]">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo de 8 caracteres"
                className="px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:border-[#0B5CBE] focus:ring-2 focus:ring-[#0B5CBE]/20 transition-all outline-none text-[#1E293B]"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1E293B]">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:border-[#0B5CBE] focus:ring-2 focus:ring-[#0B5CBE]/20 transition-all outline-none text-[#1E293B]"
                required
              />
            </div>

            {passwordError && (
              <p className="text-sm font-medium text-[#DC2626]">{passwordError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-[#0B5CBE] text-white hover:bg-[#094A9B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg py-3 px-4 flex items-center justify-center gap-2 w-full font-semibold shadow-sm"
            >
              {isLoading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-[#64748B] text-center mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#0B5CBE] hover:text-[#094A9B] transition-colors font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
