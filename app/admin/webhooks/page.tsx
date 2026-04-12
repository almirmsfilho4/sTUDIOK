'use client';

import { useState } from 'react';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastTriggered?: string;
  secret?: string;
}

const webhooks: Webhook[] = [
  {
    id: '1',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/xxx',
    events: ['quote.created', 'payment.received'],
    active: true,
    lastTriggered: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Google Sheets',
    url: 'https://script.google.com/macros/s/xxx',
    events: ['lead.created'],
    active: true,
    lastTriggered: '2024-01-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Zapier Webhook',
    url: 'https://hooks.zapier.com/hooks/catch/xxx',
    events: ['project.completed'],
    active: false
  }
];

const eventOptions = [
  'quote.created',
  'quote.updated',
  'payment.received',
  'payment.failed',
  'lead.created',
  'project.created',
  'project.completed',
  'user.registered',
  'subscription.created',
  'subscription.cancelled'
];

export default function WebhooksPage() {
  const [hooks, setHooks] = useState<Webhook[]>(webhooks);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    secret: ''
  });

  const toggleWebhook = (id: string) => {
    setHooks(hooks.map(h => 
      h.id === id ? { ...h, active: !h.active } : h
    ));
  };

  const deleteWebhook = (id: string) => {
    if (!confirm('Excluir webhook?')) return;
    setHooks(hooks.filter(h => h.id !== id));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newHook: Webhook = {
      id: Date.now().toString(),
      ...formData,
      active: true
    };
    setHooks([...hooks, newHook]);
    setShowForm(false);
    setFormData({ name: '', url: '', events: [], secret: '' });
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

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
                <h1 className="text-xl font-bold">Webhooks</h1>
                <p className="text-sm text-gray-400">Integre com sistemas externos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/admin" className="text-[#00D4FF] hover:underline">Voltar</a>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                + Novo Webhook
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="card p-6 mb-8">
            <h3 className="font-bold text-lg mb-4">Novo Webhook</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Minha Integração"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Eventos</label>
                <div className="flex flex-wrap gap-2">
                  {eventOptions.map(event => (
                    <button
                      key={event}
                      type="button"
                      onClick={() => toggleEvent(event)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        formData.events.includes(event)
                          ? 'bg-[#00D4FF] text-black'
                          : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#242424]'
                      }`}
                    >
                      {event}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Secret (opcional)</label>
                <input
                  type="text"
                  value={formData.secret}
                  onChange={e => setFormData({ ...formData, secret: e.target.value })}
                  className="input-field"
                  placeholder="Chave secret para validação"
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary">Criar Webhook</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {hooks.map(hook => (
            <div key={hook.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{hook.name}</h3>
                    <span className={`w-2 h-2 rounded-full ${hook.active ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{hook.url}</p>
                  <div className="flex flex-wrap gap-2">
                    {hook.events.map(event => (
                      <span key={event} className="text-xs px-2 py-1 bg-[#1A1A1A] rounded-full text-gray-400">
                        {event}
                      </span>
                    ))}
                  </div>
                  {hook.lastTriggered && (
                    <p className="text-xs text-gray-500 mt-2">
                      Última vez: {new Date(hook.lastTriggered).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWebhook(hook.id)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      hook.active 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}
                  >
                    {hook.active ? 'Ativo' : 'Inativo'}
                  </button>
                  <button
                    onClick={() => deleteWebhook(hook.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hooks.length === 0 && (
          <div className="text-center py-16 card">
            <p className="text-gray-400">Nenhum webhook configurado.</p>
            <button onClick={() => setShowForm(true)} className="text-[#00D4FF] hover:underline mt-2">
              Criar primeiro webhook
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
