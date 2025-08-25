'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  // Función para validar email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Verificar si el botón debe estar habilitado
  const isButtonEnabled = email.trim().length > 0 && isValidEmail(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isButtonEnabled) return;
    
    setIsLoading(true);
    setError('');

    try {
      await login(email.trim());
      setIsEmailSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Limpiar errores cuando el usuario empiece a escribir
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">¡Email enviado!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de acceso a <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Revisa tu bandeja de entrada y haz clic en el enlace para acceder a tu cuenta.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsEmailSent(false);
                setEmail('');
              }}
              className="w-full"
            >
              Enviar otro email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
          </div>
          <CardTitle className="text-2xl">Bienvenido a moviGo</CardTitle>
          <p className="text-gray-600 mt-2">
            Ingresa tu email para acceder a tu cuenta
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={handleEmailChange}
              required
              error={error}
            />
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isButtonEnabled}
              className="w-full"
            >
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
