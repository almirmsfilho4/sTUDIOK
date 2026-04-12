import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/firebase-services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectId, reportType = 'monthly' } = body;

    const projects = await getDocuments('projects');
    const users = await getDocuments('users');

    const userProjects = projects.filter((p: any) => 
      projectId ? (p.id === projectId && p.userId === userId) : p.userId === userId
    );

    if (!userProjects || userProjects.length === 0) {
      return NextResponse.json({ error: 'No projects found' }, { status: 404 });
    }

    const user = users.find((u: any) => u.id === userId) as any;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();
    const reportPeriod = reportType === 'monthly' 
      ? new Date(now.getFullYear(), now.getMonth() - 1, 1)
      : new Date(now.getFullYear(), 0, 1);

    const report = {
      userId,
      userName: user.name || 'Cliente',
      userEmail: user.email,
      reportType,
      period: reportPeriod.toISOString(),
      generatedAt: now.toISOString(),
      projects: userProjects.map((p: any) => ({
        name: p.name,
        status: p.status,
        value: p.totalValue || 0,
        paid: p.paidAmount || 0,
        remaining: (p.totalValue || 0) - (p.paidAmount || 0),
        progress: p.progress || 0,
        deliveryDate: p.deliveryDate,
      })),
      summary: {
        totalProjects: userProjects.length,
        totalValue: userProjects.reduce((sum: number, p: any) => sum + (p.totalValue || 0), 0),
        totalPaid: userProjects.reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0),
        totalRemaining: userProjects.reduce((sum: number, p: any) => sum + ((p.totalValue || 0) - (p.paidAmount || 0)), 0),
        completed: userProjects.filter((p: any) => p.status === 'completed').length,
        inProgress: userProjects.filter((p: any) => p.status === 'in_progress').length,
        pending: userProjects.filter((p: any) => p.status === 'pending').length,
      }
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}