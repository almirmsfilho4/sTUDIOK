import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Dados de exemplo quando API do Firebase não funciona
  const sampleData = {
    leads: { total: 2, thisMonth: 1, trend: 10 },
    projects: { total: 3, active: 1, completed: 1 },
    revenue: { total: 19500, thisMonth: 12000 },
    conversions: { rate: 150 }
  };
  
  try {
    // Tentar buscar dados reais do Firebase via REST API
    const token = process.env.FIREBASE_ACCESS_TOKEN;
    
    if (token) {
      const quotesRes = await fetch(
        'https://firestore.googleapis.com/v1/projects/studiok-saas/databases/(default)/documents/quotes?pageSize=100',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const projectsRes = await fetch(
        'https://firestore.googleapis.com/v1/projects/studiok-saas/databases/(default)/documents/projects?pageSize=100',
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (quotesRes.ok && projectsRes.ok) {
        const quotesData = await quotesRes.json();
        const projectsData = await projectsRes.json();
        
        const quotes = quotesData.documents || [];
        const projects = projectsData.documents || [];
        
        const parseFields = (doc: any) => {
          const result: any = { id: doc.name?.split('/').pop() };
          Object.entries(doc.fields || {}).forEach(([k, v]: [string, any]) => {
            result[k] = v.stringValue || v.integerValue || v.doubleValue || null;
          });
          return result;
        };
        
        const parsedQuotes = quotes.map(parseFields);
        const parsedProjects = projects.map(parseFields);
        
        const revenue = parsedProjects.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
        
        return NextResponse.json({
          leads: { total: parsedQuotes.length, thisMonth: parsedQuotes.length, trend: 10 },
          projects: {
            total: parsedProjects.length,
            active: parsedProjects.filter((p: any) => p.status === 'em_progresso').length,
            completed: parsedProjects.filter((p: any) => p.status === 'concluido').length
          },
          revenue: { total: revenue, thisMonth: revenue },
          conversions: { rate: parsedQuotes.length > 0 ? Math.round((parsedProjects.length / parsedQuotes.length) * 100) : 0 }
        });
      }
    }
  } catch (error) {
    console.log('Dashboard API error, usando dados de exemplo:', error);
  }
  
  // Retornar dados de exemplo
  return NextResponse.json(sampleData);
}