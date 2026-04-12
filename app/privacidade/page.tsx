import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade - ESTUDIOK',
  description: 'Política de privacidade e termos de uso da ESTUDIOK. Sua privacidade é importante para nós.',
};

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Política de Privacidade</h1>
        
        <div className="card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">1. Introdução</h2>
            <p className="text-gray-300">
              A ESTUDIOK respeita sua privacidade e está comprometida em proteger seus dados pessoais. 
              Esta política de privacidade explica como coletamos, usamos e protegemos suas informações.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">2. Dados que Coletamos</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Nome completo e informações de contato</li>
              <li>Endereço de e-mail e telefone</li>
              <li>Informações de pagamento (processadas com segurança)</li>
              <li>Dados de navegação e preferências</li>
              <li>Informações sobre projetos e solicitações</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">3. Como Usamos Seus Dados</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Para fornecer nossos serviços e responder solicitações</li>
              <li>Para processar pagamentos e emitir notas fiscais</li>
              <li>Para comunicar sobre projetos e atualizações</li>
              <li>Para melhorar nossos serviços e experiência do usuário</li>
              <li>Para enviar comunicações de marketing (com seu consentimento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">4. Proteção de Dados</h2>
            <p className="text-gray-300">
              Utilizamos medidas de segurança técnicas e organizacionais para proteger seus dados, 
              incluindo criptografia SSL, firewalls e controles de acesso seguros. 
              Todos os pagamentos são processados através do Mercado Pago, seguindo os padrões PCI-DSS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">5. Cookies</h2>
            <p className="text-gray-300">
              Utilizamos cookies para melhorar sua experiência de navegação, analisar tráfego e 
              personalizar conteúdo. Você pode controlar ou desativar cookies nas configurações do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">6. Seus Direitos</h2>
            <p className="text-gray-300">
              Você tem direito a: acessar seus dados, corrigir informações incorretas, 
              solicitar exclusão de dados, exportar seus dados e revogar consentimentos. 
              Para exercer esses direitos, entre em contato pelo e-mail: contato@estudiok.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">7. Contato</h2>
            <p className="text-gray-300">
              Em caso de dúvidas sobre esta política ou sobre o tratamento de seus dados, 
              entre em contato: <strong>contato@estudiok.com</strong>
            </p>
          </section>

          <section className="pt-8 border-t border-[#1A1A1A]">
            <p className="text-gray-500 text-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </section>
        </div>

        {/* Termos de Uso */}
        <h1 className="text-4xl font-bold mt-16 mb-8 text-center">Termos de Uso</h1>
        
        <div className="card p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">1. Aceitação dos Termos</h2>
            <p className="text-gray-300">
              Ao acessar e usar os serviços da ESTUDIOK, você aceita e concorda com estes termos de uso. 
              Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">2. Descrição dos Serviços</h2>
            <p className="text-gray-300">
              A ESTUDIOK oferece serviços de criação de sites, aplicativos mobile, sistemas web, 
              e-commerce e soluções digitais personalizadas. Os serviços incluem desenvolvimento, 
              hospedagem, manutenção e suporte técnico.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">3. Pagamento e Reembolso</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Os pagamentos são processados via Mercado Pago</li>
              <li>Parcelamento disponível em até 12x no cartão</li>
              <li>Reembolso disponível em até 7 dias após a contratação</li>
              <li>Projetos personalizados podem ter condições específicas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">4. Propriedade Intelectual</h2>
            <p className="text-gray-300">
              Todo o conteúdo, design e código desenvolvido pela ESTUDIOK permanece 
              propriedade intelectual da empresa até a quitação total do projeto. 
              Após o pagamento, o cliente recebe direitos de uso do produto final.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">5. Limitação de Responsabilidade</h2>
            <p className="text-gray-300">
              A ESTUDIOK não se responsabiliza por perdas indiretas, consequenciais 
              ou lucros cessantes. Nossa responsabilidade limita-se ao valor pago 
              pelos serviços contratados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#00D4FF]">6. Contato</h2>
            <p className="text-gray-300">
              Para questões sobre estes termos: <strong>contato@estudiok.com</strong>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}