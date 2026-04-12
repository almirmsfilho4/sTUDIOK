'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const redirect = '/dashboard';
  const { signIn, resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

try {
    await signIn(email, password);
    router.push(redirect);
  } catch (err: any) {
    console.error('Login error:', err);
    if (err.code === 'auth/invalid-email') {
      setError('Email inválido');
    } else if (err.code === 'auth/user-not-found') {
      setError('Usuário não encontrado');
    } else if (err.code === 'auth/wrong-password') {
      setError('Senha incorreta');
    } else if (err.code === 'auth/too-many-requests') {
      setError('Muitas tentativas. Tente novamente mais tarde.');
    } else if (err.code === 'auth/network-request-failed') {
      setError('Erro de conexão. Verifique sua internet.');
} else {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    }
  } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado');
      } else {
        setError('Erro ao enviar email de recuperação');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] to-[#000] p-4">
       <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <img 
              src="/logo.png" 
              alt="ESTUDIOK"
              className="w-40 h-40 object-contain"
            />
          </Link>

         <div className="card">
            {resetSent ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Email Enviado!</h2>
                <p className="text-gray-400 mb-6">
                  Verifique sua caixa de entrada para redefinir sua senha.
                </p>
                <button
                  onClick={() => {
                    setShowReset(false);
                    setResetSent(false);
                  }}
                  className="btn-secondary w-full"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Recuperar Senha</h2>
                <p className="text-gray-400 mb-6">
                  Digite seu email para receber o link de recuperação.
                </p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </button>
                </form>

                <button
                  onClick={() => setShowReset(false)}
                  className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
                >
                  ← Voltar ao Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0A0A0A] to-[#000] p-4">
       <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <img 
              src="/logo.png" 
              alt="ESTUDIOK"
              className="w-40 h-40 object-contain"
            />
          </Link>

        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h2>
          <p className="text-gray-400 mb-6">
            Entre com sua conta para continuar
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-sm text-[#00D4FF] hover:underline"
            >
              Esqueceu sua senha?
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

           <div className="text-center space-y-4 mt-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 text-[#00D4FF] hover:text-white transition-colors py-2 px-4 rounded-lg border border-[#00D4FF]/30 hover:bg-[#00D4FF]/10"
            >
              <span>←</span>
              Voltar para o início
            </button>
             
             <p className="text-gray-400">
               Não tem conta?{' '}
               <Link 
                 href={redirect ? `/cadastro?redirect=${redirect}` : '/cadastro'}
                 className="text-[#00D4FF] hover:underline"
               >
                 Criar conta
               </Link>
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}