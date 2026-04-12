'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Card, Button, Badge, StatCard } from '@/components/PremiumUI';
import PremiumIcons from '@/components/PremiumIcons';
import { emailTemplates, EmailTemplateKey } from './templates';

export default function BulkEmailPage() {
  const [recipients, setRecipients] = useState<{ email: string; name?: string }[]>([]);
  const [manualEmails, setManualEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateKey | ''>('');
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          email: data.email,
          name: data.displayName || data.name,
        };
      }).filter(u => u.email);
      setRecipients(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setStatus({ type: 'error', message: 'Erro ao carregar usuários do banco de dados.' });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const addManualEmails = () => {
    const emails = manualEmails.split(',').map(e => e.trim()).filter(e => e && e.includes('@'));
    const newRecipients = [...recipients];
    emails.forEach(email => {
      if (!newRecipients.some(r => r.email === email)) {
        newRecipients.push({ email });
      }
    });
    setRecipients(newRecipients);
    setManualEmails('');
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r.email !== email));
  };

  const sendBulkEmail = async () => {
    if (recipients.length === 0) {
      setStatus({ type: 'error', message: 'Adicione pelo menos um destinatário.' });
      return;
    }
    if (!subject || !body) {
      setStatus({ type: 'error', message: 'Assunto e corpo do email são obrigatórios.' });
      return;
    }

    setIsSending(true);
    setStatus({ type: 'info', message: 'Enviando emails... Isso pode levar alguns minutos.' });

    try {
      const response = await fetch('/api/marketing/bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject,
          body,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: result.message });
      } else {
        setStatus({ type: 'error', message: result.error || 'Erro ao enviar emails.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Erro de conexão com o servidor.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Disparo em Massa</h1>
          <p className="text-gray-600">Envie campanhas de marketing para toda a sua base de leads e clientes.</p>
        </div>
        <Badge variant="premium" className="text-sm py-1 px-3">
          <PremiumIcons.Zap className="h-4 w-4 mr-1" />
          Marketing Hub
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Destinatários */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PremiumIcons.Users className="h-5 w-5 mr-2 text-orange-600" />
              Destinatários
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adicionar Emails Manuais</label>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={manualEmails}
                  onChange={(e) => setManualEmails(e.target.value)}
                  placeholder="email1@exemplo.com, email2@..."
                  className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <Button onClick={addManualEmails} className="px-3 py-2">
                  <PremiumIcons.Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-2 custom-scrollbar">
              {isLoadingUsers ? (
                <div className="text-center py-4 text-gray-500">Carregando usuários...</div>
              ) : recipients.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Nenhum destinatário selecionado.</div>
              ) : (
                recipients.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 group">
                    <div className="truncate mr-2">
                      <div className="text-sm font-medium truncate">{r.name || 'Lead'}</div>
                      <div className="text-xs text-gray-500 truncate">{r.email}</div>
                    </div>
                    <button 
                      onClick={() => removeRecipient(r.email)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <PremiumIcons.X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Total de destinatários:</span>
                <span className="font-bold">{recipients.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Composição */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selector */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PremiumIcons.Briefcase className="h-5 w-5 mr-2 text-orange-600" />
              Templates de Email
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(emailTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTemplate(key as EmailTemplateKey);
                    setSubject(template.subject);
                    setBody(template.body);
                    setStatus(null);
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    selectedTemplate === key
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-semibold text-gray-800 mb-1">{template.name}</div>
                  <div className="text-xs text-gray-500 truncate">{template.subject}</div>
                </button>
              ))}
            </div>
            {selectedTemplate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center text-sm text-blue-800">
                  <PremiumIcons.Check className="h-4 w-4 mr-2" />
                  Template "{emailTemplates[selectedTemplate].name}" selecionado
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <PremiumIcons.Mail className="h-5 w-5 mr-2 text-orange-600" />
              Composição do Email
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: 🚀 Novidade incrível para o seu negócio!"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Corpo do Email (HTML suportado)</label>
                  <span className="text-xs text-gray-500">Use <code className="bg-gray-100 px-1 rounded">{"{{nome}}"}</code> para personalizar o nome</span>
                </div>
                <textarea 
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Olá {{nome}}, queremos apresentar..."
                  className="w-full h-64 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-mono text-sm"
                />
              </div>
              
            <div className="flex justify-end space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                disabled={!body}
              >
                <span className="flex items-center">
                  <PremiumIcons.Eye className="h-4 w-4 mr-2" />
                  {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
                </span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSubject('');
                  setBody('');
                  setSelectedTemplate('');
                  setShowPreview(false);
                }}
                disabled={isSending}
              >
                Limpar
              </Button>
              <Button
                onClick={sendBulkEmail}
                disabled={isSending}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8"
              >
                {isSending ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <PremiumIcons.Send className="h-4 w-4 mr-2" />
                    Disparar Email em Massa
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && body && (
            <Card className="p-6 border-blue-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PremiumIcons.Eye className="h-5 w-5 mr-2 text-blue-600" />
                Preview do Email
              </h3>
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-500 ml-4">Preview</span>
                </div>
                <div 
                  className="p-0"
                  style={{ maxHeight: '400px', overflow: 'auto' }}
                >
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: body.replace(/{{nome}}/g, 'Nome do Destinatário') 
                    }} 
                  />
                </div>
              </div>
            </Card>
          )}
        </Card>

          {status && (
            <div className={`p-4 rounded-lg border ${
              status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
              status.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center">
                {status.type === 'success' && <PremiumIcons.CheckCircle className="h-5 w-5 mr-2" />}
                {status.type === 'error' && <PremiumIcons.XCircle className="h-5 w-5 mr-2" />}
                {status.type === 'info' && <PremiumIcons.Info className="h-5 w-5 mr-2" />}
                <span className="text-sm font-medium">{status.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
