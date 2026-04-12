'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getQuote } from '@/lib/firebase-services';

interface QuoteData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  description?: string;
  budget?: string;
  deadline?: string;
  features?: string[];
  createdAt: any;
  status?: string;
}

function QuotePDFContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('id');
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (quoteId) {
      loadQuote();
    }
  }, [quoteId]);

  const loadQuote = async () => {
    try {
      if (quoteId) {
        const data = await getQuote(quoteId);
        setQuote(data as QuoteData);
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getPrice = () => {
    if (!quote?.serviceType) return 0;
    const prices: Record<string, number> = {
      'site': 1500, 'app': 5000, 'sistema': 8000, 'ecommerce': 3500,
      'Site': 1500, 'App Mobile': 5000, 'Sistema Web': 8000, 'E-commerce': 3500
    };
    return prices[quote.serviceType] || 1500;
  };

  const printQuote = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Orçamento não encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <img src="/logo.png" alt="ESTUDIOK" className="w-32 h-32 object-contain" />
            <h1 className="text-2xl font-bold mt-4">ORÇAMENTO</h1>
            <p className="text-gray-500">#{quote.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Data: {quote.createdAt?.toDate ? quote.createdAt.toDate().toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</p>
            <p className="text-sm text-gray-500">Validade: 30 dias</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Dados do Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{quote.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{quote.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="font-medium">{quote.phone}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">Serviço Solicitado</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-xl">{quote.serviceType}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-bold text-lg mb-4">Itens do Orçamento</h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3">Desenvolvimento {quote.serviceType}</td>
                <td className="text-right py-3">{formatCurrency(getPrice() * 0.6)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3">Design e UX</td>
                <td className="text-right py-3">{formatCurrency(getPrice() * 0.2)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3">Deploy e Configuração</td>
                <td className="text-right py-3">{formatCurrency(getPrice() * 0.1)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3">Suporte Inicial (30 dias)</td>
                <td className="text-right py-3">{formatCurrency(getPrice() * 0.1)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-bold text-lg">
                <td className="py-4">TOTAL</td>
                <td className="text-right py-4 text-[#00D4FF]">{formatCurrency(getPrice())}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <button onClick={printQuote} className="btn-primary">
          Imprimir / Salvar PDF
        </button>
      </div>
    </div>
  );
}

export default function QuotePDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <QuotePDFContent />
    </Suspense>
  );
}
