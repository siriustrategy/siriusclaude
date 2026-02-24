'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!authData.user) {
        setError('Erro ao criar conta');
        return;
      }

      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([
          {
            name: companyName,
            slug: companyName.toLowerCase().replace(/\s+/g, '-'),
            branding_color: '#FF6B00',
          },
        ])
        .select()
        .single();

      if (orgError) {
        setError('Erro ao criar empresa');
        return;
      }

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          organization_id: orgData.id,
          full_name: fullName,
          email,
          role: 'admin',
        },
      ]);

      if (profileError) {
        setError('Erro ao criar perfil');
        return;
      }

      router.push('/dashboard/assessment');
    } catch (err) {
      setError('Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">🧠 Zona de Genialidade</h1>
            <p className="text-gray-600 mt-2">Crie sua conta</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                className="form-input"
                placeholder="Seu nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="form-label">Empresa</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nome da sua empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Criando conta...' : 'Registrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Já tem conta?{' '}
              <Link href="/auth/login" className="text-orange-600 hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
