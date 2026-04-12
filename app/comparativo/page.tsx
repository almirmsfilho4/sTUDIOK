'use client';

import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const features = [
  { name: 'Pagamento único', studiok: true, wix: false, squarespace: false, tradicional: false, desc: 'Sem mensalidade' },
  { name: 'Domínio Grátis', studiok: true, wix: false, squarespace: false, tradicional: true, desc: 'Primeiro ano' },
  { name: 'Design Personalizado', studiok: true, wix: false, squarespace: true, tradicional: true, desc: 'Sob medida' },
  { name: 'SEO Otimizado', studiok: true, wix: true, squarespace: true, tradicional: true, desc: 'Google' },
  { name: 'Agendamento Online', studiok: true, wix: true, squarespace: false, tradicional: false, desc: 'Automático' },
  { name: 'E-commerce', studiok: true, wix: true, squarespace: true, tradicional: true, desc: 'Loja virtual' },
  { name: 'Blog Integrado', studiok: true, wix: true, squarespace: true, tradicional: true, desc: 'Conteúdo' },
  { name: 'Suporte em Português', studiok: true, wix: false, squarespace: false, tradicional: true, desc: 'Humanizado' },
  { name: 'SSL Grátis', studiok: true, wix: true, squarespace: true, tradicional: false, desc: 'Segurança' },
  { name: 'Painel Admin', studiok: true, wix: true, squarespace: true, tradicional: false, desc: 'Gestão' },
  { name: 'Entrega em 7 dias', studiok: true, wix: false, squarespace: false, tradicional: false, desc: 'Rápido' },
  { name: 'Cupom de desconto', studiok: true, wix: false, squarespace: false, tradicional: false, desc: 'PRIMEIRO20' },
];

export default function ComparativoPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white">
            Solicitar Orçamento →
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
              <PremiumIcon name="check" size={16} className="text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold text-sm">Compare e Escolha</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Por Que Escolher a <span className="text-[#8B5CF6]">ESTUDIOK?</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Compare com as principais opções do mercado e veja por que somos a melhor escolha.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">Características</th>
                  <th className="p-4">
                    <div className="bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 rounded-2xl p-4 text-center">
                      <div className="text-[#8B5CF6] font-bold">ESTUDIOK</div>
                      <div className="text-xs text-gray-400">Nós</div>
                    </div>
                  </th>
                  <th className="p-4">
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold">Wix</div>
                      <div className="text-xs text-gray-500">Concorrente</div>
                    </div>
                  </th>
                  <th className="p-4">
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold">Squarespace</div>
                      <div className="text-xs text-gray-500">Concorrente</div>
                    </div>
                  </th>
                  <th className="p-4">
                    <div className="bg-[#050505] border border-white/10 rounded-2xl p-4 text-center">
                      <div className="text-white font-bold">Agência Tradicional</div>
                      <div className="text-xs text-gray-500">Concorrente</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="font-medium">{f.name}</div>
                      <div className="text-xs text-gray-500">{f.desc}</div>
                    </td>
                    <td className="p-4 text-center">
                      {f.studiok ? (
                        <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="check" size={20} className="text-[#8B5CF6]" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="close" size={20} className="text-red-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {f.wix ? (
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="check" size={20} className="text-green-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="close" size={20} className="text-red-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {f.squarespace ? (
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="check" size={20} className="text-green-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="close" size={20} className="text-red-500" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {f.tradicional ? (
                        <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="check" size={20} className="text-green-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                          <PremiumIcon name="close" size={20} className="text-red-500" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/5 rounded-3xl p-8 border border-[#8B5CF6]/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Pronto Para Criar Seu Site?</h2>
              <p className="text-gray-400 mb-6">
                Comece agora com <strong className="text-[#8B5CF6]">20% de desconto</strong> usando o código <strong>PRIMEIRO20</strong>
              </p>
              <Link href="/orcamento?cupom=PRIMEIRO20" className="bg-[#8B5CF6] hover:opacity-90 text-white px-10 py-4 rounded-full font-bold text-xl inline-flex items-center gap-3">
                Criar Meu Site
                <PremiumIcon name="arrow-right" size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2024 ESTUDIOK. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}