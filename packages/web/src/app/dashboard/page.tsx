'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Users, 
  Plus, 
  LogOut, 
  User, 
  Building2, 
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { InviteMemberFormData } from '@/types';

export default function DashboardPage() {
  const { user, sessionData, logout } = useAuth();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  
  const [formData, setFormData] = useState<InviteMemberFormData>({
    email: '',
    name: '',
    title: '',
    roles: ['MANAGER']
  });

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteError('');
    setInviteSuccess(false);

    try {
      // Por ahora usamos la primera organización disponible
      const organizationId = sessionData?.organizations?.[0]?.id || 1;
      
      const response = await apiService.inviteMember(
        {
          ...formData,
          organization_id: organizationId,
        },
        'dummy-token' // Esto se manejará automáticamente en el contexto
      );

      if (response.success) {
        setInviteSuccess(true);
        setFormData({ email: '', name: '', title: '', roles: ['MANAGER'] });
        setShowInviteForm(false);
      } else {
        setInviteError(response.error || 'Error al invitar miembro');
      }
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : 'Error al invitar miembro');
    } finally {
      setIsInviting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center">
            <p className="text-gray-600">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">moviGo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user.name}
          </h2>
          <p className="text-gray-600">
            Gestiona tus organizaciones y miembros desde aquí
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sessionData?.organizations?.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 text-primary-600 mr-2" />
                  {org.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Roles: {org.roles.join(', ')}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowInviteForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Invitar Miembro
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invite Member Form */}
        {showInviteForm && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 text-primary-600 mr-2" />
                Invitar Nuevo Miembro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="nuevo@miembro.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Cargo"
                  type="text"
                  placeholder="Gerente, Conductor, etc."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                
                {inviteError && (
                  <div className="flex items-center text-red-600 text-sm">
                    <XCircle className="w-4 h-4 mr-2" />
                    {inviteError}
                  </div>
                )}
                
                {inviteSuccess && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Miembro invitado exitosamente
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    loading={isInviting}
                    disabled={!formData.email || !formData.name}
                    className="flex-1"
                  >
                    Invitar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* No Organizations Message */}
        {(!sessionData?.organizations || sessionData.organizations.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes organizaciones
              </h3>
              <p className="text-gray-600 mb-4">
                Aún no has sido agregado a ninguna organización.
              </p>
              <Button
                variant="outline"
                onClick={() => setShowInviteForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Organización
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
