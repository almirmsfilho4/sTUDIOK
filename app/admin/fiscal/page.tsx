'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

interface FiscalSettings {
  companyName: string;
  cnpj: string;
  ie: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  email: string;
  phone: string;
  regime: 'simples' | 'lucro' | 'presumido';
  cst: string;
  csosn: string;
  issRate: number;
  envProduction: boolean;
  nfeToken: string;
}

export default function FiscalSettingsPage() {
  const [settings, setSettings] = useState<FiscalSettings>({
    companyName: 'ESTUDIOK SOLUCOES LTDA',
    cnpj: '',
    ie: '',
    address: '',
    city: '',
    state: '',
    cep: '',
    email: '',
    phone: '',
    regime: 'simples',
    cst: '102',
    csosn: '102',
    issRate: 5,
    envProduction: false,
    nfeToken: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
            <PremiumIcon name="arrow-right" size={16} className="rotate-180" />
            Voltar ao Admin
          </Link>
          <h1 className="text-3xl font-bold text-white">Configurações Fiscais</h1>
          <p className="text-gray-400">Configure os dados para emissão de Nota Fiscal</p>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-500 rounded-xl">
            Configurações salvas com sucesso!
          </div>
        )}

        <div className="space-y-6">
          {/* Dados da Empresa */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Dados da Empresa</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Razão Social</label>
                <input 
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">CNPJ</label>
                <input 
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={settings.cnpj}
                  onChange={(e) => setSettings({...settings, cnpj: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Inscrição Estadual</label>
                <input 
                  type="text"
                  value={settings.ie}
                  onChange={(e) => setSettings({...settings, ie: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Regime Tributário</label>
                <select
                  value={settings.regime}
                  onChange={(e) => setSettings({...settings, regime: e.target.value as any})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="simples">Simples Nacional</option>
                  <option value="lucro">Lucro Presumido</option>
                  <option value="presumido">Lucro Real</option>
                </select>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Endereço</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Endereço</label>
                <input 
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Cidade</label>
                <input 
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({...settings, city: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">UF</label>
                <select
                  value={settings.state}
                  onChange={(e) => setSettings({...settings, state: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="">Selecione</option>
                  {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO'].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">CEP</label>
                <input 
                  type="text"
                  placeholder="00000-000"
                  value={settings.cep}
                  onChange={(e) => setSettings({...settings, cep: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
            </div>
          </div>

          {/* Configurações NF-e */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Configurações NF-e</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">CST (Código Situação Tributária)</label>
                <input 
                  type="text"
                  value={settings.cst}
                  onChange={(e) => setSettings({...settings, cst: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">CSOSN</label>
                <input 
                  type="text"
                  value={settings.csosn}
                  onChange={(e) => setSettings({...settings, csosn: e.target.value})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Alíquota ISS (%)</label>
                <input 
                  type="number"
                  value={settings.issRate}
                  onChange={(e) => setSettings({...settings, issRate: parseFloat(e.target.value)})}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  id="envProduction"
                  checked={settings.envProduction}
                  onChange={(e) => setSettings({...settings, envProduction: e.target.checked})}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="envProduction" className="text-white">Ambiente de Produção</label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Token/Certificado NF-e</label>
              <input 
                type="password"
                placeholder="Token de API para emissão de NF"
                value={settings.nfeToken}
                onChange={(e) => setSettings({...settings, nfeToken: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-white"
              />
              <p className="text-gray-500 text-xs mt-2">Token fornecido pelo serviço de emissão de nota fiscal</p>
            </div>
          </div>

          {/* Botão Salvar */}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#8B5CF6] hover:opacity-90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <PremiumIcon name="save" size={20} />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}