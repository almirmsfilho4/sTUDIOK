'use client';

import Link from 'next/link';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white">
            Voltar ao início
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-black mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">1. Introdução</h2>
              <p className="text-gray-400">
                A ESTUDIOK respeita sua privacidade e está comprometida em proteger seus dados pessoais. 
                Esta política de privacidade estabelece como coletamos, usamos e protegemos suas informações.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">2. Dados que Coletamos</h2>
              <ul className="text-gray-400 space-y-2 list-disc list-inside">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Telefone/WhatsApp</li>
                <li>Empresa (se aplicável)</li>
                <li>Informações de pagamento</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">3. Como Usamos Seus Dados</h2>
              <ul className="text-gray-400 space-y-2 list-disc list-inside">
                <li>Para fornecer nossos serviços</li>
                <li>Para processar pagamentos</li>
                <li>Para comunicação sobre projetos</li>
                <li>Para envio de promoções (com consentimento)</li>
                <li>Para melhoria de nossos serviços</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">4. Proteção de Dados</h2>
              <p className="text-gray-400">
                Utilizamos medidas de segurança técnicas e organizacionais para proteger seus dados contra 
                acesso não autorizado, alteração, divulgação ou destruição. Todos os dados são armazenados 
                em servidores seguros com criptografia SSL.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">5. Cookies</h2>
              <p className="text-gray-400">
                Utilizamos cookies para melhorar sua experiência em nosso site. Você pode configurar 
                seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">6. Compartilhamento de Dados</h2>
              <p className="text-gray-400">
                Não vendemos seus dados pessoais. Compartilhamos dados apenas com provedores de 
                pagamento (para processamento de transações) e quando exigido por lei.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">7. Seus Direitos</h2>
              <ul className="text-gray-400 space-y-2 list-disc list-inside">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incorretos</li>
                <li>Solicitar exclusão de dados</li>
                <li>Opt-out de comunicações de marketing</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">8. Contato</h2>
              <p className="text-gray-400">
                Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato pelo 
                e-mail: privacidade@estudiok.com.br
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
               Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
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