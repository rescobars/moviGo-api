'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { getUserPermissions, getAvailableOrganizationsForInvite, canInviteToOrganization, type UserPermissions } from '@/lib/permissions';
import { 
  Users, 
  Plus, 
  Building2, 
  Mail,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Package,
  Truck
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

  // Calculate user permissions
  const userPermissions: UserPermissions = useMemo(() => {
    if (!user || !sessionData?.organizations) {
      return {
        canInviteToAnyOrganization: false,
        canInviteToOwnOrganization: false,
        canCreateOrganizations: false,
        canManageMembers: false,
        canViewAllOrganizations: false,
        canManageOwnOrganization: false,
      };
    }

    const userRoles = sessionData.organizations.flatMap(org => org.roles);
    return getUserPermissions(userRoles, sessionData.organizations, user.id);
  }, [user, sessionData]);

  // Get available organizations for inviting
  const availableOrganizations = useMemo(() => {
    if (!sessionData?.organizations) return [];
    return getAvailableOrganizationsForInvite(userPermissions, sessionData.organizations);
  }, [sessionData, userPermissions]);

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteError('');
    setInviteSuccess(false);

    try {
      // Use the first available organization or the selected one
      const organizationId = availableOrganizations[0]?.id || 1;
      
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
    <DashboardLayout user={user} onLogout={logout}>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {user.name}
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu actividad y organizaciones
        </p>
        {/* Show user role info */}
        <div className="mt-2 text-sm text-gray-500">
          {userPermissions.canInviteToAnyOrganization && (
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
              Administrador
            </span>
          )}
          {userPermissions.canCreateOrganizations && (
            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
              Creador de Organizaciones
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={Building2}
          title="Organizaciones"
          value={sessionData?.organizations?.length || 0}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        <StatCard
          icon={Users}
          title="Miembros"
          value="12"
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />

        <StatCard
          icon={Truck}
          title="Conductores"
          value="8"
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />

        <StatCard
          icon={Package}
          title="Pedidos Hoy"
          value="24"
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Organizations Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Tus Organizaciones</h2>
          <div className="flex space-x-2">
            {userPermissions.canCreateOrganizations && (
              <Button
                variant="outline"
                className="hidden md:flex"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Organización
              </Button>
            )}
            {(userPermissions.canInviteToAnyOrganization || userPermissions.canInviteToOwnOrganization) && (
              <Button
                onClick={() => setShowInviteForm(true)}
                className="hidden md:flex"
              >
                <Plus className="w-4 h-4 mr-2" />
                Invitar Miembro
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionData?.organizations?.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-primary-600 mr-2" />
                    {org.name}
                  </div>
                  {(org as any).owner_id === user.id && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Owner
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Roles: {org.roles.join(', ')}
                  </div>
                  {canInviteToOrganization(userPermissions, org.id, sessionData.organizations || []) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:hidden"
                      onClick={() => setShowInviteForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Invitar Miembro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
              {userPermissions.canCreateOrganizations && (
                <Button
                  variant="outline"
                  onClick={() => setShowInviteForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Organización
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invite Member Form */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
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
        </div>
      )}
    </DashboardLayout>
  );
}
