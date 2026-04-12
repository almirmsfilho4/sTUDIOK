export interface CompanyInfo {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  website: string;
}

export function generatePrivacyPolicy(company: CompanyInfo): string {
  return `
POLÍTICA DE PRIVACIDADE - ${company.name}

Última atualização: ${new Date().toLocaleDateString('pt-BR')}

1. INTRODUÇÃO
O ${company.name} ("nós", "nosso" ou "nossa") respeita sua privacidade e está comprometido em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações.

2. INFORMAÇÕES QUE COLETAMOS
• Informações de contato (nome, email, telefone)
• Informações de pagamento
• Dados de uso do site
• Informações do dispositivo

3. COMO USAMOS SUAS INFORMAÇÕES
• Fornecer nossos serviços
• Processar pagamentos
• Comunicar sobre projetos
• Melhorar nossos serviços
• Cumprir obrigações legais

4. PROTEÇÃO DE DADOS
Implementamos medidas de segurança para proteger suas informações pessoais, incluindo criptografia e controles de acesso.

5. COMPARTILHAMENTO DE DADOS
Não vendemos seus dados pessoais. Compartilhamos apenas com prestadores de serviços necessários para nossas operações.

6. SEUS DIREITOS
Você tem o direito de:
• Acessar seus dados
• Corrigir dados incorretos
• Solicitar exclusão
• Optar por não receber comunicações

7. CONTATO
Para questões sobre esta política, entre em contato:
• Email: ${company.email}
• Telefone: ${company.phone}
  `.trim();
}

export function generateTermsOfService(company: CompanyInfo): string {
  return `
TERMOS E CONDIÇÕES DE USO - ${company.name}

Última atualização: ${new Date().toLocaleDateString('pt-BR')}

1. ACEITAÇÃO DOS TERMOS
Ao acessar e usar os serviços do ${company.name}, você aceita e concorda em estar vinculado a estes Termos de Uso.

2. DESCRIÇÃO DOS SERVIÇOS
O ${company.name} oferece serviços de desenvolvimento de websites, sistemas web, aplicativos e soluções digitais personalizadas.

3. OBRIGAÇÕES DO CLIENTE
• Fornecer informações verdadeiras e completas
• Efetuar pagamentos conforme combinado
• Fornecer materiais necessários para execução
• Cooperar durante o processo de desenvolvimento

4. OBRIGAÇÕES DO PRESTADOR
• Executar serviços conforme especificação
• Manter qualidade e padrões profissionais
• Respeitar prazos combinados
• Fornecer suporte pós-entrega

5. PROPRIEDADE INTELECTUAL
• O cliente recebe todos os direitos do projeto após pagamento total
• O prestador pode usar o projeto em seu portfólio
• Marcos, logos e materiais do cliente permanecem propriedade do cliente

6. PAGAMENTO
• Valores definidos em proposta comercial
• Pagamento via PIX, cartão ou boleto
• Parcelamento disponível conforme combinado

7. GARANTIA
• 30 dias de garantia após entrega
• Correção de bugs e problemas técnicos
• Suporte básico incluso no período

8. CANCELAMENTO
• Caso seja necessário cancelar, valores já pagos não serão reembolsados
• Trabalho já realizado será entregue ao cliente

9. LIMITAÇÃO DE RESPONSABILIDADE
O ${company.name} não se responsabiliza por:
• Lucros cessantes
• Danos indiretos
• Problemas causados por terceiros

10. CONTATO
• Email: ${company.email}
• Telefone: ${company.phone}
  `.trim();
}

export function generateCookiePolicy(company: CompanyInfo): string {
  return `
POLÍTICA DE COOKIES - ${company.name}

Última atualização: ${new Date().toLocaleDateString('pt-BR')}

1. O QUE SÃO COOKIES?
Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site.

2. COOKIES QUE USAMOS

Essenciais:
• Sessão de login
• Preferências de idioma
• Carrinho de compras

Analíticos:
• Google Analytics
• Pages vistas
• Tempo no site

Funcionalidades:
• Vídeos incorporados
• Redes sociais

3. COMO GERENCIAR
Você pode bloquear ou excluir cookies nas configurações do seu navegador. Note que alguns recursos podem não funcionar corretamente sem cookies.

4. COOKIES DE TERCEIROS
Trabalhamos com parceiros que podem definir cookies em nosso behalf, incluindo Google Analytics e Pixel do Facebook.

5. CONTATO
Para dúvidas sobre esta política:
• Email: ${company.email}
  `.trim();
}

export function generateLegalDocument(type: 'privacy' | 'terms' | 'cookies', company: CompanyInfo): string {
  switch (type) {
    case 'privacy':
      return generatePrivacyPolicy(company);
    case 'terms':
      return generateTermsOfService(company);
    case 'cookies':
      return generateCookiePolicy(company);
    default:
      return '';
  }
}

export const DEFAULT_COMPANY: CompanyInfo = {
  name: 'ESTUDIOK MEI',
  cnpj: 'XX.XXX.XXX/XXXX-XX',
  email: 'contato@estudiak.com',
  phone: '(XX) XXXXX-XXXX',
  address: 'Rua Example, 123',
  city: 'São Paulo',
  state: 'SP',
  website: 'https://estudiak.com',
};