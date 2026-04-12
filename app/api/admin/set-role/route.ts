import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/firebase-services';
import { updateDocument } from '@/lib/firebase-services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email e role são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const users = await getDocuments('users');
    const userArray = Array.isArray(users) ? users : [];
    
    const user = userArray.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado na coleção users' },
        { status: 404 }
      );
    }

    // Atualizar role
    await updateDocument('users', user.id, { role });

    return NextResponse.json({
      success: true,
      message: `Usuário ${email} atualizado para role: ${role}`,
      userId: user.id
    });

  } catch (error: any) {
    console.error('Erro ao definir role:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}