'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument } from '@/lib/firebase-services';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  addedAt: any;
}

export default function TeamPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadTeamMembers();
    }
  }, [user]);

  const loadTeamMembers = async () => {
    try {
      const data = await getDocuments('team_members');
      const userTeamData = (data as any[]).filter(tm => tm.userId === user?.uid);
      
      const teamMembers: TeamMember[] = userTeamData.map(tm => ({
        id: tm.id,
        email: tm.email,
        name: tm.name || tm.email.split('@')[0],
        role: tm.role || 'member',
        addedAt: tm.addedAt
      }));

if (user?.email) {
 teamMembers.unshift({
  id: 'owner',
  email: user.email,
  name: user.displayName || user.email?.split('@')[0] || 'Membro',
  role: 'owner',
  addedAt: new Date()
 });
}

      setMembers(teamMembers);
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteEmail) return;

    try {
      await createDocument('team_members', {
        userId: user.uid,
        email: inviteEmail,
        name: inviteEmail.split('@')[0],
        role: 'member',
        invitedBy: user.email,
        addedAt: new Date(),
        status: 'pending'
      });
      setInviteEmail('');
      alert('Convite enviado com sucesso!');
    } catch (error) {
      console.error('Error inviting:', error);
    }
  };

  const roleColors = {
    owner: 'bg-yellow-500/20 text-yellow-500',
    admin: 'bg-[#00D4FF]/20 text-[#00D4FF]',
    member: 'bg-gray-500/20 text-gray-500'
  };

  const roleLabels = {
    owner: 'Proprietário',
    admin: 'Administrador',
    member: 'Membro'
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="flex items-center gap-2">
                <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
              </a>
              <div>
                <h1 className="text-xl font-bold">Equipe</h1>
                <p className="text-sm text-gray-400">Gerencie membros da sua conta</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invite Form */}
        <div className="card p-6 mb-8">
          <h2 className="font-bold text-lg mb-4">Convidar Membro</h2>
          <form onSubmit={handleInvite} className="flex gap-4">
            <input
              type="email"
              placeholder="Email do novo membro"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              className="input-field flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              Enviar Convite
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-[#1A1A1A]">
            <h2 className="font-bold">Membros da Equipe ({members.length})</h2>
          </div>
          <div className="divide-y divide-[#1A1A1A]">
            {members.map(member => (
              <div key={member.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${roleColors[member.role]}`}>
                  {roleLabels[member.role]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 bg-[#1A1A1A] rounded-lg">
          <h3 className="font-medium mb-2">Permissões por função:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• <span className="text-yellow-500">Proprietário</span>: Acesso total, gerenciar equipe, billing</li>
            <li>• <span className="text-[#00D4FF]">Administrador</span>: Gerenciar projetos, usuários, configurações</li>
            <li>• <span className="text-gray-500">Membro</span>: Acessar projetos atribuídos</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
