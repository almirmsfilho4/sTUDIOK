'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/lib/firebase-services';

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: any;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const services = [
  'Consultoria',
  'Apresentação de Projeto',
  'Reunião de Planejamento',
  'Suporte Técnico',
  'Retorno de Projeto',
  'Outro'
];

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: 'Consultoria',
    date: '',
    time: '10:00',
    notes: ''
  });

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadAppointments();
    }
  }, [user, userData]);

  const loadAppointments = async () => {
    try {
      const data = await getDocuments('appointments');
      setAppointments(data as Appointment[]);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDocument('appointments', {
        ...formData,
        status: 'pending',
        createdAt: new Date()
      });
      setShowForm(false);
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceType: 'Consultoria',
        date: '',
        time: '10:00',
        notes: ''
      });
      loadAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDocument('appointments', id, { status });
      loadAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cancelar este agendamento?')) return;
    try {
      await deleteDocument('appointments', id);
      loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    confirmed: 'bg-green-500/20 text-green-500',
    completed: 'bg-blue-500/20 text-blue-500',
    cancelled: 'bg-red-500/20 text-red-500'
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
              <a href="/admin" className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="ESTUDIOK Logo"
                  className="w-20 h-20 object-contain"
                />
              </a>
              <div>
                <h1 className="text-xl font-bold">Agendamentos</h1>
                <p className="text-sm text-gray-400">Gerencie reuniões e consultas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setShowForm(true)} className="btn-primary">
                + Novo Agendamento
              </button>
              <a href="/admin" className="text-[#00D4FF] hover:underline">
                Voltar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="card mb-8 p-6">
            <h3 className="text-lg font-bold mb-4">Novo Agendamento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={e => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={e => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Serviço *</label>
                  <select
                    required
                    value={formData.serviceType}
                    onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                    className="input-field"
                  >
                    {services.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Horário *</label>
                  <select
                    required
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="input-field"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  Agendar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <div className="text-center py-16 card">
              <p className="text-gray-400 text-lg">Nenhum agendamento ainda.</p>
            </div>
          ) : (
            appointments.map(apt => (
              <div key={apt.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{apt.clientName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[apt.status]}`}>
                        {apt.status === 'pending' ? 'Pendente' : 
                         apt.status === 'confirmed' ? 'Confirmado' :
                         apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span>📧 {apt.clientEmail}</span>
                      <span>📞 {apt.clientPhone}</span>
                      <span>📅 {apt.date} às {apt.time}</span>
                      <span>🛠 {apt.serviceType}</span>
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-gray-500 mt-2">{apt.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'confirmed')}
                        className="btn-primary text-sm"
                      >
                        Confirmar
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'completed')}
                        className="btn-primary text-sm"
                      >
                        Concluir
                      </button>
                    )}
                    {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
