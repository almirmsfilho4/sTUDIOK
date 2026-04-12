import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

interface ReportData {
  period: string;
  generatedAt: Date;
  summary: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalRevenue: number;
    newClients: number;
    conversionRate: number;
  };
  topProjects: Array<{
    id: string;
    name: string;
    value: number;
    status: string;
  }>;
  topClients: Array<{
    id: string;
    name: string;
    email: string;
    total: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

function getEmptyReportData(period: 'weekly' | 'monthly'): ReportData {
 return {
  period,
  generatedAt: new Date(),
  summary: {
   totalProjects: 0,
   activeProjects: 0,
   completedProjects: 0,
   totalRevenue: 0,
   newClients: 0,
   conversionRate: 0,
  },
  topProjects: [],
  topClients: [],
  revenueByMonth: [],
 };
}

async function generateReportData(period: 'weekly' | 'monthly'): Promise<ReportData> {
 if (!db || typeof db.collection !== 'function') {
  return getEmptyReportData(period);
 }

 const now = new Date();
 const startDate = new Date();
  
  if (period === 'weekly') {
    startDate.setDate(startDate.getDate() - 7);
  } else {
    startDate.setMonth(startDate.getMonth() - 1);
  }

  const [projectsSnapshot, usersSnapshot] = await Promise.all([
    getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'))),
    getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
  ]);

  const projects = projectsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    paidAmount: doc.data().paidAmount || 0,
    status: doc.data().status || 'unknown',
  })).filter((p: any) => p.createdAt && p.createdAt >= startDate);

  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    role: doc.data().role || 'client',
  })).filter((u: any) => u.role !== 'admin' && u.createdAt && u.createdAt >= startDate);

  const totalRevenue = projects.reduce((sum: number, p: any) => sum + (p.paidAmount || 0), 0);
  const activeProjects = projects.filter((p: any) => p.status === 'in_progress' || p.status === 'review').length;
  const completedProjects = projects.filter((p: any) => p.status === 'completed').length;

  const topProjects = projects
    .sort((a: any, b: any) => (b.paidAmount || 0) - (a.paidAmount || 0))
    .slice(0, 5)
    .map((p: any) => ({
      id: p.id,
      name: p.name || 'Projeto',
      value: p.paidAmount || 0,
      status: p.status,
    }));

const projectByClient: Record<string, { name: string; email: string; total: number }> = {};
 projects.forEach((p: any) => {
  if (!projectByClient[p.user_id]) {
   projectByClient[p.user_id] = { name: 'Cliente', email: '', total: 0 };
  }
  projectByClient[p.user_id]!.total += p.paidAmount || 0;
 });

  const topClients = Object.entries(projectByClient)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    period,
    generatedAt: now,
    summary: {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      totalRevenue,
      newClients: users.length,
      conversionRate: projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0,
    },
    topProjects,
    topClients,
    revenueByMonth: [],
  };
}

function generateEmailHTML(report: ReportData): string {
  const periodLabel = report.period === 'weekly' ? 'Semanal' : 'Mensal';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0A0A0A; color: #fff; margin: 0; padding: 40px; }
    .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 40px; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat { background: #242424; padding: 20px; border-radius: 12px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: bold; color: #00D4FF; }
    .stat-label { font-size: 14px; color: #888; margin-top: 5px; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #242424; }
    .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Relatório ${periodLabel} - ESTUDIOK</h1>
      <p>${report.generatedAt.toLocaleDateString('pt-BR')}</p>
    </div>
    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${report.summary.totalProjects}</div>
          <div class="stat-label">Projetos Total</div>
        </div>
        <div class="stat">
          <div class="stat-value">${report.summary.activeProjects}</div>
          <div class="stat-label">Projetos Ativos</div>
        </div>
        <div class="stat">
          <div class="stat-value">R$ ${report.summary.totalRevenue.toLocaleString('pt-BR')}</div>
          <div class="stat-label">Receita do Período</div>
        </div>
        <div class="stat">
          <div class="stat-value">${report.summary.newClients}</div>
          <div class="stat-label">Novos Clientes</div>
        </div>
      </div>
      
      <div class="section">
        <h2>🏆 Top Projetos</h2>
        ${report.topProjects.map(p => `
          <div class="item">
            <span>${p.name}</span>
            <span style="color: #00D4FF">R$ ${p.value.toLocaleString('pt-BR')}</span>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <h2>👥 Top Clientes</h2>
        ${report.topClients.map(c => `
          <div class="item">
            <span>${c.name}</span>
            <span style="color: #7B2CBF">R$ ${c.total.toLocaleString('pt-BR')}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="footer">
      <p>Gerado automaticamente pelo sistema ESTUDIOK</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: Request) {
  try {
    const { period = 'weekly', email } = await request.json();

    const report = await generateReportData(period as 'weekly' | 'monthly');

    if (!email) {
      const adminsSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'admin')));
      const adminEmails = adminsSnapshot.docs.map(doc => doc.data().email).filter(Boolean);

      if (adminEmails.length > 0) {
        await resend.emails.send({
          from: 'ESTUDIOK <noreply@estudiok.com.br>',
          to: adminEmails,
          subject: `📊 Relatório ${period === 'weekly' ? 'Semanal' : 'Mensal'} - ESTUDIOK`,
          html: generateEmailHTML(report),
        });
      }
    } else {
      await resend.emails.send({
        from: 'ESTUDIOK <noreply@estudiok.com.br>',
        to: email,
        subject: `📊 Relatório ${period === 'weekly' ? 'Semanal' : 'Mensal'} - ESTUDIOK`,
        html: generateEmailHTML(report),
      });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Erro ao gerar relatório' }, { status: 500 });
  }
}