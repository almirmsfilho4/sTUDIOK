'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Button, Badge } from '@/components/PremiumUI';

export default function GeradorNomesPage() {
  const [palavraChave, setPalavraChave] = useState('');
  const [segmento, setSegmento] = useState('');
  const [tipoNegocio, setTipoNegocio] = useState('');
  const [nomesGerados, setNomesGerados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [nomeSelecionado, setNomeSelecionado] = useState<string | null>(null);

  const handleGerarNomes = async () => {
    if (!palavraChave.trim()) return;
    
    setLoading(true);
    
    // Simulação de geração de nomes com IA
    setTimeout(() => {
      const baseName = palavraChave.toLowerCase();
      const segmentoText = segmento ? ` ${segmento}` : '';
      const tipoText = tipoNegocio ? ` ${tipoNegocio}` : '';
      
      const novosNomes = [
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)}${segmentoText}${tipoText}`,
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Digital${segmentoText}`,
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Pro${segmentoText}`,
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Solutions${segmentoText}`,
        `Nex${baseName.charAt(0).toUpperCase() + baseName.slice(1)}${segmentoText}`,
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Hub${segmentoText}`,
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Lab${segmentoText}`,
        `${baseName.charAt(0).toUpperCase() + baseName.slice(1)}Up${segmentoText}`,
      ];
      
      setNomesGerados(novosNomes);
      setLoading(false);
    }, 1500);
  };

  const handleAnalisarDominio = (nome: string) => {
    setNomeSelecionado(nome);
    // Em produção, aqui integraríamos com API de verificação de domínio
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              Gerador de <span className="text-blue-600">Nomes Premium</span>
              <br />
              Encontre o nome perfeito para seu negócio
            </>
          }
          subtitle="Use nossa IA para gerar nomes criativos, disponíveis e que convertem. Encontre a identidade ideal para sua marca."
          ctaText="Começar a Gerar Nomes"
          ctaHref="#gerador"
        >
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div className="bg-purple-50 rounded-full p-2">
              <PremiumIcons.Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="bg-green-50 rounded-full p-2">
              <PremiumIcons.CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </PremiumHero>

        {/* Banner de IA */}
        <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">IA Inteligente para Nomes</h2>
                    <p className="text-blue-100">Analisa tendências, disponibilidade de domínio e apelo comercial</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Badge variant="premium" className="text-lg px-4 py-2">
                      <PremiumIcons.Zap className="h-5 w-5 mr-1" />
                      IA Premium
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Gerador */}
      <section id="gerador" className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Configure seu Gerador</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quanto mais informações você fornecer, mais precisos serão os resultados
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Configuração */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <PremiumIcons.Search className="h-4 w-4 inline mr-2 text-blue-600" />
                        Palavra-chave Principal
                      </label>
                      <input
                        type="text"
                        value={palavraChave}
                        onChange={(e) => setPalavraChave(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: marketing, tecnologia, saúde, moda..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        A palavra principal que representa seu negócio
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <PremiumIcons.Grid className="h-4 w-4 inline mr-2 text-blue-600" />
                          Segmento de Mercado
                        </label>
                        <select
                          value={segmento}
                          onChange={(e) => setSegmento(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um segmento</option>
                          <option value="Tech">Tecnologia</option>
                          <option value="Saúde">Saúde & Bem-estar</option>
                          <option value="Finanças">Finanças</option>
                          <option value="Educação">Educação</option>
                          <option value="Moda">Moda & Beleza</option>
                          <option value="Alimentos">Alimentos & Bebidas</option>
                          <option value="Serviços">Serviços</option>
                          <option value="Varejo">Varejo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <PremiumIcons.Briefcase className="h-4 w-4 inline mr-2 text-blue-600" />
                          Tipo de Negócio
                        </label>
                        <select
                          value={tipoNegocio}
                          onChange={(e) => setTipoNegocio(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione o tipo</option>
                          <option value="Agência">Agência</option>
                          <option value="Consultoria">Consultoria</option>
                          <option value="E-commerce">E-commerce</option>
                          <option value="SaaS">SaaS</option>
                          <option value="App">App</option>
                          <option value="Serviços">Serviços</option>
                          <option value="Produtos">Produtos Físicos</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start">
                        <PremiumIcons.Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Dica Profissional</h4>
                          <p className="text-sm text-blue-700">
                            Nomes curtos (2-3 palavras) com domínio .com.br disponível têm maior taxa de conversão.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button
                        onClick={handleGerarNomes}
                        disabled={!palavraChave.trim() || loading}
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Gerando nomes com IA...
                          </>
                        ) : (
                          <>
                            <PremiumIcons.Zap className="h-5 w-5 mr-2" />
                            Gerar Nomes com IA Premium
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dicas */}
            <div>
              <Card className="h-full">
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center">
                    <PremiumIcons.Bulb className="h-5 w-5 text-yellow-600 mr-2" />
                    Dicas para Escolher
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <PremiumIcons.Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Fácil de Memorizar</h4>
                        <p className="text-sm text-gray-600">Nomes simples são mais fáceis de lembrar</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <PremiumIcons.Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Domínio Disponível</h4>
                        <p className="text-sm text-gray-600">Verifique se o .com.br está livre</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <PremiumIcons.Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Sem Conflitos</h4>
                        <p className="text-sm text-gray-600">Evite marcas registradas similares</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <PremiumIcons.Check className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Apelo Comercial</h4>
                        <p className="text-sm text-gray-600">O nome deve transmitir confiança</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">850+</div>
                      <div className="text-sm text-gray-600">Nomes gerados com sucesso</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Resultados */}
          {nomesGerados.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Nomes Gerados</h2>
                  <p className="text-gray-600">
                    {nomesGerados.length} sugestões baseadas em sua configuração
                  </p>
                </div>
                <Badge variant="success">
                  IA Premium
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nomesGerados.map((nome, index) => (
                  <Card 
                    key={index}
                    className={`hover:shadow-xl transition-all duration-300 ${
                      nomeSelecionado === nome ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{nome}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {palavraChave} • {segmento || 'Geral'} • {tipoNegocio || 'Negócio'}
                          </p>
                        </div>
                        <Badge variant="default">
                          #{index + 1}
                        </Badge>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm font-medium mb-2">Domínio Sugerido:</div>
                        <div className="bg-gray-100 p-3 rounded-lg font-mono">
                          {nome.toLowerCase().replace(/\s+/g, '')}.com.br
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          variant={nomeSelecionado === nome ? 'primary' : 'secondary'}
                          className="w-full"
                          onClick={() => handleAnalisarDominio(nome)}
                        >
                          <PremiumIcons.Search className="h-4 w-4 mr-2" />
                          {nomeSelecionado === nome ? 'Analisando...' : 'Verificar Domínio'}
                        </Button>
                        
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => {
                            navigator.clipboard.writeText(nome);
                            alert(`Nome "${nome}" copiado para a área de transferência!`);
                          }}
                        >
                          <PremiumIcons.Copy className="h-4 w-4 mr-2" />
                          Copiar Nome
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Modal de Análise */}
          {nomeSelecionado && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Análise do Nome</h2>
                      <p className="text-gray-600">{nomeSelecionado}</p>
                    </div>
                    <button
                      onClick={() => setNomeSelecionado(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <PremiumIcons.X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-3">Pontuação do Nome</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-700">8.5</div>
                          <div className="text-sm text-gray-600">Memorização</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-700">9.2</div>
                          <div className="text-sm text-gray-600">Originalidade</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-700">7.8</div>
                          <div className="text-sm text-gray-600">Domínio</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-700">8.9</div>
                          <div className="text-sm text-gray-600">Comercial</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Domínios Disponíveis</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="font-mono">{nomeSelecionado.toLowerCase().replace(/\s+/g, '')}.com.br</div>
                          <Badge variant="success">Disponível</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="font-mono">{nomeSelecionado.toLowerCase().replace(/\s+/g, '')}.com</div>
                          <Badge variant="warning">Indisponível</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="font-mono">{nomeSelecionado.toLowerCase().replace(/\s+/g, '')}.net</div>
                          <Badge variant="success">Disponível</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3">Próximos Passos</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <PremiumIcons.CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span>Registrar domínio .com.br</span>
                        </div>
                        <div className="flex items-center">
                          <PremiumIcons.CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span>Verificar marcas registradas</span>
                        </div>
                        <div className="flex items-center">
                          <PremiumIcons.CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span>Criar identidade visual</span>
                        </div>
                        <div className="flex items-center">
                          <PremiumIcons.CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span>Desenvolver site/app</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link href="/marketplace" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00D4FF]/30 transition-all">
                        <PremiumIcons.Layout className="h-5 w-5 mr-2" />
                        Templates para Site
                      </Link>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setNomeSelecionado(null)}
                      >
                        Gerar Mais Nomes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Casos de Sucesso */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Nomes que se Tornaram Marcas</h2>
                <p className="text-gray-600">
                  Exemplos reais de empresas que começaram com um bom nome
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    nome: 'Nubank',
                    segmento: 'FinTech',
                    origem: 'Nu (novo) + Bank',
                    resultado: 'Unicórnio brasileiro',
                  },
                  {
                    nome: 'iFood',
                    segmento: 'Delivery',
                    origem: 'i (internet) + Food',
                    resultado: 'Líder no mercado',
                  },
                  {
                    nome: '99',
                    segmento: 'Mobilidade',
                    origem: 'Número fácil de lembrar',
                    resultado: 'Adquirida pela Didi',
                  },
                  {
                    nome: 'Hotmart',
                    segmento: 'E-learning',
                    origem: 'Hot (quente) + Market',
                    resultado: 'Plataforma global',
                  },
                ].map((caso, idx) => (
                  <Card key={idx} className="hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{caso.nome}</h3>
                          <Badge variant="default">{caso.segmento}</Badge>
                        </div>
                        <PremiumIcons.TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-gray-600 mb-3">
                        <span className="font-medium">Origem:</span> {caso.origem}
                      </p>
                      <div className="bg-green-50 px-4 py-2 rounded-lg inline-block">
                        <span className="font-bold text-green-700">{caso.resultado}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="p-8 md:p-12 text-center">
                  <h2 className="text-3xl font-bold mb-4">Pronto para Encontrar seu Nome Perfeito?</h2>
                  <p className="text-blue-100 mb-8 text-lg">
                    O primeiro passo para uma marca de sucesso começa com o nome certo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="#gerador" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                      <PremiumIcons.Zap className="h-5 w-5 mr-2" />
                      Gerar Meus Nomes Agora
                    </Link>
                    <Link href="/consultoria" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white border border-[#242424] rounded-xl font-semibold hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all">
                      <PremiumIcons.User className="h-5 w-5 mr-2" />
                      Consultoria de Marca
                    </Link>
                  </div>
                  <p className="text-blue-100 text-sm mt-6">
                    <PremiumIcons.Shield className="h-4 w-4 inline mr-1" />
                    IA Premium • Análise de Domínio • Dicas Comerciais
                  </p>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}