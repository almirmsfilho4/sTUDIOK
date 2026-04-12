import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'nfse') {
      const nfse = {
        numero: `NFSE${Date.now()}`,
        dataEmissao: new Date().toISOString(),
        servico: {
          codigo: data.serviceCode || '0101',
          descricao: data.description,
          aliquota: data.aliquota || 0.05,
        },
        prestador: {
          cnpj: data.cnpj || 'XX.XXX.XXX/XXXX-XX',
          nome: 'ESTUDIOK MEI',
          inscricaoMunicipal: data.im || '123456',
          endereco: {
            logradouro: data.address || 'Rua Example',
            numero: data.number || '123',
            bairro: data.neighborhood || 'Centro',
            cidade: data.city || 'São Paulo',
            uf: data.state || 'SP',
            cep: data.cep || '01000-000',
          },
        },
        tomador: {
          nome: data.clientName,
          cpfCnpj: data.clientDoc,
          email: data.clientEmail,
          endereco: data.clientAddress || {},
        },
        valores: {
          servico: data.value,
          iss: data.value * 0.05,
          total: data.value * 1.05,
        },
        status: 'gerada',
      };

      return NextResponse.json({
        success: true,
        nfse,
        message: 'NFSe gerada com sucesso',
      });
    }

    if (type === 'cancelar') {
      return NextResponse.json({
        success: true,
        message: `NFSe ${data.numero} cancelada`,
      });
    }

    return NextResponse.json({ error: 'Tipo de operação inválido' }, { status: 400 });
  } catch (error) {
    console.error('NFSe error:', error);
    return NextResponse.json({ error: 'Erro ao processar NFSe' }, { status: 500 });
  }
}