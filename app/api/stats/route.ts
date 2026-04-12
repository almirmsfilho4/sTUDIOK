import { NextResponse } from 'next/server';
import { getDocuments } from '@/lib/firebase-services';

export async function GET() {
  try {
    const [leadsData, projectsData] = await Promise.all([
      getDocuments('quotes'),
      getDocuments('projects'),
    ]);

    const leads = leadsData as any[];
    const projects = projectsData as any[];

    const revenue = projects.reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0);

    return NextResponse.json({
      leads: leads.length,
      projects: projects.length,
      revenue,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ leads: 0, projects: 0, revenue: 0 });
  }
}
