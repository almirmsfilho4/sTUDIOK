'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BusinessCardData {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  whatsapp?: string;
}

export default function BusinessCardPage() {
  const [formData, setFormData] = useState<BusinessCardData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    company: 'ESTUDIOK',
    website: 'estudiok.com',
    whatsapp: ''
  });
  const [preview, setPreview] = useState(false);

  const updateData = (key: keyof BusinessCardData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Cartão de Visita <span className="text-[#00D4FF]">Digital</span>
          </h1>
          <p className="text-gray-400">
            Crie seu cartão de visita digital profissional em segundos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6">Seus Dados</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => updateData('name', e.target.value)}
                  className="input-field"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Cargo/Função</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => updateData('title', e.target.value)}
                  className="input-field"
                  placeholder="Ex: CEO, Desenvolvedor, Designer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => updateData('email', e.target.value)}
                    className="input-field"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={e => updateData('whatsapp', e.target.value)}
                    className="input-field"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Empresa</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => updateData('company', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => updateData('website', e.target.value)}
                  className="input-field"
                />
              </div>

              <button
                onClick={() => setPreview(true)}
                className="btn-primary w-full mt-6"
              >
                Gerar Cartão
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center">
            {preview ? (
              <div className="relative w-[400px] h-[240px] bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden border border-[#1A1A1A]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#FF006E]"></div>
                
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                      <span className="text-sm text-gray-400">{formData.company}</span>
                    </div>
                    <h3 className="text-xl font-bold">{formData.name || 'Seu Nome'}</h3>
                    <p className="text-[#00D4FF] text-sm">{formData.title || 'Seu Cargo'}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    {formData.email && (
                      <p className="text-gray-400">✉️ {formData.email}</p>
                    )}
                    {formData.phone && (
                      <p className="text-gray-400">📞 {formData.phone}</p>
                    )}
                    {formData.whatsapp && (
                      <p className="text-gray-400">💬 {formData.whatsapp}</p>
                    )}
                    {formData.website && (
                      <p className="text-gray-400">🌐 {formData.website}</p>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-2 right-4 text-xs text-gray-600">
                  Gerado por ESTUDIOK
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>Preencha os dados e clique em "Gerar Cartão"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
