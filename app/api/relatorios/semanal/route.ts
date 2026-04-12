import { NextResponse } from 'next/server';
import { getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function GET() {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [newLeads, newProjects, completedProjects, quotes] = await Promise.all([
      getDocs(query(collection(db, 'quotes'), where('createdAt', '>=', startOfWeek))),
      getDocs(query(collection(db, 'projects'), where('createdAt', '>=', startOfWeek))),
      getDocs(query(collection(db, 'projects'), where('status', '==', 'completed'), where('updatedAt', '>=', startOfWeek))),
      getDocs(query(collection(db, 'quotes'), where('status', '==', 'pending'))),
    ]);

    const totalRevenue = completedProjects.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + (data.price || data.paidAmount || 0);
    }, 0);

    const report = {
      period: `Semana de ${startOfWeek.toLocaleDateString('pt-BR')}`,
      generatedAt: now.toLocaleString('pt-BR'),
      metrics: {
        newLeads: newLeads.size,
        newProjects: newProjects.size,
        completedProjects: completedProjects.size,
        pendingQuotes: quotes.size,
        weeklyRevenue: totalRevenue,
      },
      insights: [
        newLeads.size > 0 ? `${newLeads.size} novos leads esta semana` : null,
        completedProjects.size > 0 ? `${completedProjects.size} projetos concluídos` : null,
        quotes.size > 0 ? `${quotes.size} orçamentos pendentes` : null,
      ].filter(Boolean),
    };

    const adminEmails = ['almir.msfilho@hotmail.com'];
    
    for (const email of adminEmails) {
      try {
        await resend.emails.send({
          from: 'ESTUDIOK Relatórios <noreply@estudiak.com>',
          to: email,
          subject: `📊 Relatório Semanal - ESTUDIOK (${report.period})`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; background: #0A0A0A; color: #fff; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 12px; padding: 24px; }
                h1 { color: #00D4FF; }
                .metric { display: inline-block; width: 48%; margin-bottom: 16px; padding: 16px; background: #0A0A0A; border-radius: 8px; }
                .metric-value { font-size: 24px; font-weight: bold; color: #00D4FF; }
                .metric-label { color: #888; font-size: 12px; }
                .revenue { color: #10B981; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📊 Relatório Semanal</h1>
                <p class="period">${report.period}</p>
                
                <div style="margin: 20px 0;">
                  <div class="metric">
                    <div class="metric-value">${report.metrics.newLeads}</div>
                    <div class="metric-label">Novos Leads</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${report.metrics.newProjects}</div>
                    <div class="metric-label">Novos Projetos</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${report.metrics.completedProjects}</div>
                    <div class="metric-label">Concluídos</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${report.metrics.pendingQuotes}</div>
                    <div class="metric-label">Orçamentos Pendentes</div>
                  </div>
                </div>
                
                <div class="metric" style="width: 100%;">
                  <div class="metric-value revenue">R$ ${report.metrics.weeklyRevenue.toLocaleString('pt-BR')}</div>
                  <div class="metric-label">Faturamento da Semana</div>
                </div>
                
                <h3 style="margin-top: 24px;">📈 Insights</h3>
                <ul>
                  ${report.insights.map(i => `<li>${i}</li>`).join('')}
                </ul>
                
                <p style="margin-top: 24px; color: #666; font-size: 12px;">
                  Relatório gerado automaticamente pelo sistema ESTUDIOK
                </p>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error generating weekly report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}