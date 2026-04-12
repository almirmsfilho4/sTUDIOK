'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  notes?: string;
  status: 'waiting' | 'contacted' | 'converted' | 'lost';
  position: number;
  createdAt: any;
  convertedAt?: any;
}

const SETTINGS = {
  maxSlotsPerMonth: 5,
  currentMonth: 'Abril 2026',
  usedSlots: 2,
};

export default function FilaEsperaPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    notes: '',
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadData();
    }
  }, [user, userData]);

  const loadData = async () => {
    try {
      const data = await getDocuments('waitlist');
      const sorted = (data as WaitlistEntry[]).sort((a, b) => a.position - b.position);
      setEntries(sorted);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWaitlist = async () => {
    if (!newEntry.name || !newEntry.email) return;
    
    setAdding(true);
    try {
      const position = entries.filter(e => e.status === 'waiting').length + 1;
      
      await createDocument('waitlist', {
        ...newEntry,
        status: 'waiting',
        position,
        createdAt: new Date(),
      });

      alert('Cliente adicionado à fila de espera!');
      setShowAddModal(false);
      setNewEntry({ name: '', email: '', phone: '', projectType: '', budget: '', notes: '' });
      loadData();
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      alert('Erro ao adicionar');
    } finally {
      setAdding(false);
    }
  };

  const updateStatus = async (entryId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'converted') {
        updateData.convertedAt = new Date();
      }
      await updateDocument('waitlist', entryId, updateData);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const movePosition = async (entryId: string, direction: 'up' | 'down') => {
    const currentIndex = entries.findIndex(e => e.id === entryId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= entries.length) return;

    const newEntries = [...entries];
    const [moved] = newEntries.splice(currentIndex, 1);
    if (!moved) return;
    newEntries.splice(newIndex, 0, moved);
    
    // Update positions
    for (const entry of newEntries) {
      if (entry && entry.id) {
        await updateDocument('waitlist', entry.id, { position: newEntries.indexOf(entry) + 1 });
      }
    }
    loadData();
  };

  const waitingEntries = entries.filter(e => e.status === 'waiting');
  const remainingSlots = SETTINGS.maxSlotsPerMonth - SETTINGS.usedSlots;

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
              <a href="/admin" className="flex items-center gap-2">
                <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
              </a>
              <div>
                <h1 className="text-xl font-bold">Fila de Espera</h1>
                <p className="text-sm text-gray-400">Gerencie limitação de projetos por mês</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PremiumIcon name="add" size={18} />
              Adicionar à Fila
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Slots Info */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">{SETTINGS.currentMonth}</h3>
              <p className="text-sm text-gray-400">Slots de projetos disponíveis</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#00D4FF]">
                {remainingSlots} / {SETTINGS.maxSlotsPerMonth}
              </p>
              <p className="text-sm text-gray-400">disponíveis</p>
            </div>
          </div>
          <div className="h-4 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full"
              style={{ width: `${(remainingSlots / SETTINGS.maxSlotsPerMonth) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {SETTINGS.usedSlots} projetos iniciados este mês
          </p>
        </div>

        {/* Waitlist */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Fila de Espera</h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="users" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente na fila de espera</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="text-[#00D4FF] hover:underline mt-2"
              >
                Adicionar primeiro cliente
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div key={entry.id} className="p-4 bg-[#050505] rounded-xl flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => movePosition(entry.id, 'up')}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30"
                    >
                      <PremiumIcon name="chevron-right" size={16} className="-rotate-90" />
                    </button>
                    <span className="text-center font-bold text-[#00D4FF]">#{entry.position}</span>
                    <button 
                      onClick={() => movePosition(entry.id, 'down')}
                      disabled={index === entries.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30"
                    >
                      <PremiumIcon name="chevron-right" size={16} className="rotate-90" />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{entry.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        entry.status === 'waiting' ? 'bg-yellow-500/20 text-yellow-500' :
                        entry.status === 'contacted' ? 'bg-blue-500/20 text-blue-500' :
                        entry.status === 'converted' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {entry.status === 'waiting' ? 'Aguardando' : 
                         entry.status === 'contacted' ? 'Contatado' :
                         entry.status === 'converted' ? 'Convertido' : 'Perdido'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 flex gap-4">
                      <span>{entry.email}</span>
                      <span>•</span>
                      <span>{entry.projectType || 'Projeto'}</span>
                      <span>•</span>
                      <span>Budget: {entry.budget || 'Não informado'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {entry.status === 'waiting' && (
                      <>
                        <button 
                          onClick={() => updateStatus(entry.id, 'contacted')}
                          className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-sm"
                        >
                          Contatar
                        </button>
                        <button 
                          onClick={() => updateStatus(entry.id, 'converted')}
                          className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg text-sm"
                        >
                          Converter
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => updateStatus(entry.id, 'lost')}
                      className="px-3 py-1 text-red-500 text-sm hover:underline"
                    >
                      Perdido
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Adicionar à Fila de Espera</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Nome *</label>
                <input
                  type="text"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Email *</label>
                <input
                  type="email"
                  value={newEntry.email}
                  onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Telefone</label>
                <input
                  type="tel"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Tipo de Projeto</label>
                <select
                  value={newEntry.projectType}
                  onChange={(e) => setNewEntry({ ...newEntry, projectType: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                >
                  <option value="">Selecione</option>
                  <option value="site">Site Institucional</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="app">App Mobile</option>
                  <option value="sistema">Sistema Web</option>
                  <option value="landing">Landing Page</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Orçamento</label>
                <select
                  value={newEntry.budget}
                  onChange={(e) => setNewEntry({ ...newEntry, budget: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                >
                  <option value="">Selecione</option>
                  <option value="ate 1500">Até R$ 1.500</option>
                  <option value="1500-3500">R$ 1.500 - R$ 3.500</option>
                  <option value="3500-8000">R$ 3.500 - R$ 8.000</option>
                  <option value="acima 8000">Acima de R$ 8.000</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Observações</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white h-20"
                  placeholder="Notas adicionais..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#242424] text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddToWaitlist}
                disabled={!newEntry.name || !newEntry.email || adding}
                className="flex-1 btn-primary"
              >
                {adding ? 'Adicionando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}