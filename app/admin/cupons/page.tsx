'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createCoupon, validateCoupon, useCoupon } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percent' | 'fixed';
  validUntil: any;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  createdAt: any;
}

export default function CouponsPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 10,
    discountType: 'percent' as 'percent' | 'fixed',
    maxUses: 100,
    validDays: 30,
  });
  const [creating, setCreating] = useState(false);
  const [testCode, setTestCode] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadCoupons();
    }
  }, [user, userData]);

  const loadCoupons = async () => {
    try {
      const data = await getDocuments('coupons');
      setCoupons(data as Coupon[]);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code) return;
    
    setCreating(true);
    try {
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + newCoupon.validDays);

      await createCoupon({
        code: newCoupon.code,
        discount: newCoupon.discount,
        discountType: newCoupon.discountType,
        validUntil,
        maxUses: newCoupon.maxUses || undefined,
      });

      alert('Cupom criado com sucesso!');
      setShowCreateModal(false);
      setNewCoupon({ code: '', discount: 10, discountType: 'percent', maxUses: 100, validDays: 30 });
      loadCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Erro ao criar cupom');
    } finally {
      setCreating(false);
    }
  };

  const handleTestCoupon = async () => {
    const result = await validateCoupon(testCode);
    if (result) {
      const r = result as any;
      const discountText = r.discountType === 'percent' 
        ? `${r.discount}%` 
        : `R$ ${r.discount}`;
      setTestResult(`✓ Válido! Desconto: ${discountText}`);
    } else {
      setTestResult('✗ Inválido ou expirado');
    }
  };

  const activeCoupons = coupons.filter(c => c.active);
  const totalUses = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

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
                <h1 className="text-xl font-bold">Cupons de Desconto</h1>
                <p className="text-sm text-gray-400">Gerencie códigos de desconto</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PremiumIcon name="add" size={18} />
              Novo Cupom
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Cupons Ativos</p>
            <p className="text-3xl font-bold text-[#00D4FF]">{activeCoupons.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Usos</p>
            <p className="text-3xl font-bold">{totalUses}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Cupons</p>
            <p className="text-3xl font-bold">{coupons.length}</p>
          </div>
        </div>

        {/* Test Coupon */}
        <div className="card mb-8">
          <h2 className="text-lg font-bold mb-4">Testar Cupom</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value.toUpperCase())}
              placeholder="Código do cupom"
              className="flex-1 bg-[#050505] border border-[#242424] rounded-xl p-3 text-white uppercase"
            />
            <button onClick={handleTestCoupon} className="btn-secondary">
              Testar
            </button>
          </div>
          {testResult && (
            <p className={`mt-2 ${testResult.includes('✓') ? 'text-green-500' : 'text-red-500'}`}>
              {testResult}
            </p>
          )}
        </div>

        {/* Coupons List */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Todos os Cupons</h2>
          
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="file" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum cupom encontrado</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-[#00D4FF] hover:underline mt-2"
              >
                Criar primeiro cupom
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#242424]">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Código</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Desconto</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Validade</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Usos</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => {
                    const validUntil = coupon.validUntil?.toDate?.();
                    const isExpired = validUntil && validUntil < new Date();
                    const isMaxed = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
                    
                    return (
                      <tr key={coupon.id} className="border-b border-[#242424]">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-[#00D4FF]">{coupon.code}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-green-500">
                          {coupon.discountType === 'percent' ? `${coupon.discount}%` : `R$ ${coupon.discount}`}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {validUntil ? validUntil.toLocaleDateString('pt-BR') : 'Sem prazo'}
                        </td>
                        <td className="py-3 px-4">
                          {coupon.usedCount || 0} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            !coupon.active ? 'bg-gray-500/20 text-gray-500' :
                            isExpired ? 'bg-red-500/20 text-red-500' :
                            isMaxed ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {!coupon.active ? 'Inativo' : isExpired ? 'Expirado' : isMaxed ? 'Limite atingido' : 'Ativo'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Criar Novo Cupom</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Código do Cupom</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: DESCONTO10"
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Tipo de Desconto</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewCoupon({ ...newCoupon, discountType: 'percent' })}
                    className={`p-3 rounded-xl border-2 text-center ${
                      newCoupon.discountType === 'percent' 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Porcentagem</span>
                  </button>
                  <button
                    onClick={() => setNewCoupon({ ...newCoupon, discountType: 'fixed' })}
                    className={`p-3 rounded-xl border-2 text-center ${
                      newCoupon.discountType === 'fixed' 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Valor fixo</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">
                  Valor do Desconto ({newCoupon.discountType === 'percent' ? '%' : 'R$'})
                </label>
                <input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Validade (dias)</label>
                <input
                  type="number"
                  value={newCoupon.validDays}
                  onChange={(e) => setNewCoupon({ ...newCoupon, validDays: parseInt(e.target.value) || 30 })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Limite de usos (0 = ilimitado)</label>
                <input
                  type="number"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                />
              </div>

              <div className="bg-[#050505] p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Preview</p>
                <p className="text-xl font-bold">
                  {newCoupon.code || 'CODIGO'} ={' '}
                  {newCoupon.discountType === 'percent' 
                    ? `${newCoupon.discount}% off` 
                    : `R$ ${newCoupon.discount} off`}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#242424] text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateCoupon}
                disabled={!newCoupon.code || creating}
                className="flex-1 btn-primary"
              >
                {creating ? 'Criando...' : 'Criar Cupom'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}