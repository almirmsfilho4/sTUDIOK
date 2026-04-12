import { NextResponse } from 'next/server';
import { getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/app/firebase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const apiKey = searchParams.get('api_key');

  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }

  try {
    switch (endpoint) {
      case 'projects':
        const projectsQuery = query(
          collection(db, 'projects'),
          where('status', '==', 'completed'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const projects = await getDocs(projectsQuery);
        return NextResponse.json({
          success: true,
          data: projects.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            type: doc.data().type,
            clientName: doc.data().clientName,
            status: doc.data().status,
            completedAt: doc.data().updatedAt?.toDate?.() || null,
          })),
        });

      case 'portfolio':
        const portfolioQuery = query(
          collection(db, 'portfolio'),
          where('active', '==', true),
          limit(20)
        );
        const portfolio = await getDocs(portfolioQuery);
        return NextResponse.json({
          success: true,
          data: portfolio.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            category: doc.data().category,
            image: doc.data().image,
            url: doc.data().url,
          })),
        });

      case 'leads/count':
        const leadsQuery = query(collection(db, 'quotes'));
        const leadsSnap = await getDocs(leadsQuery);
        return NextResponse.json({
          success: true,
          data: { total: leadsSnap.docs.length },
        });

      case 'stats':
        const [pSnap, uSnap, qSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'quotes')),
        ]);
        
        const completedProjects = pSnap.docs.filter(d => d.data().status === 'completed').length;
        const totalRevenue = pSnap.docs.reduce((acc, d) => acc + (d.data().price || 0), 0);
        
        return NextResponse.json({
          success: true,
          data: {
            totalProjects: pSnap.docs.length,
            completedProjects,
            totalUsers: uSnap.docs.length,
            totalLeads: qSnap.docs.length,
            totalRevenue,
          },
        });

      default:
        return NextResponse.json({
          success: true,
          available_endpoints: [
            '/api/public?endpoint=projects',
            '/api/public?endpoint=portfolio',
            '/api/public?endpoint=leads/count',
            '/api/public?endpoint=stats',
          ],
        });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const apiKey = searchParams.get('api_key');

  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (endpoint === 'lead') {
      const { name, email, phone, service, budget, message } = body;
      
      if (!email) {
        return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 });
      }

      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      
      const docRef = await addDoc(collection(db, 'quotes'), {
        name: name || '',
        email,
        phone: phone || '',
        serviceType: service || 'Outro',
        budget: budget || 0,
        message: message || '',
        status: 'pending',
        source: 'api',
        createdAt: serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        message: 'Lead criado com sucesso',
        leadId: docRef.id,
      });
    }

    return NextResponse.json({ error: 'Endpoint não encontrado' }, { status: 404 });
  } catch (error) {
    console.error('API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}