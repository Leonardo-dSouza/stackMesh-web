import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Cloud } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
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
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">Bem-vindo de volta</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Faça login na sua conta
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
                placeholder="Sua senha"
                className="px-4 py-3 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:border-[#0B5CBE] focus:ring-2 focus:ring-[#0B5CBE]/20 transition-all outline-none text-[#1E293B]"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 bg-[#0B5CBE] text-white hover:bg-[#094A9B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg py-3 px-4 flex items-center justify-center gap-2 w-full font-semibold shadow-sm"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-sm text-[#64748B] text-center mt-6">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-[#0B5CBE] hover:text-[#094A9B] transition-colors font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
