import { NextResponse } from 'next/server';
import { getDocs, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      thisMonthProjects,
      lastMonthProjects,
      allQuotes,
      allProjects
    ] = await Promise.all([
      getDocs(query(collection(db, 'projects'), where('createdAt', '>=', startOfMonth))),
      getDocs(query(collection(db, 'projects'), where('createdAt', '>=', startOfLastMonth), where('createdAt', '<=', endOfLastMonth))),
      getDocs(query(collection(db, 'quotes'), where('status', '==', 'pending'))),
      getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(50))),
    ]);

    const thisMonthRevenue = thisMonthProjects.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + (data.paidAmount || data.price || 0);
    }, 0);

    const lastMonthRevenue = lastMonthProjects.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + (data.paidAmount || data.price || 0);
    }, 0);

    const totalPending = allProjects.docs.reduce((acc, doc) => {
      const data = doc.data();
      return acc + ((data.totalValue || data.price || 0) - (data.paidAmount || 0));
    }, 0);

    const growth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : '0';

    const report = {
      period: now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      generatedAt: now.toLocaleString('pt-BR'),
      metrics: {
        newProjects: thisMonthProjects.size,
        totalRevenue: thisMonthRevenue,
        lastMonthRevenue: lastMonthRevenue,
        growth: Number(growth),
        pendingQuotes: allQuotes.size,
        totalPipeline: totalPending,
        completedProjects: thisMonthProjects.docs.filter(d => d.data().status === 'completed').length,
      },
    };

    const adminEmails = ['almir.msfilho@hotmail.com'];
    
    for (const email of adminEmails) {
      try {
        await resend.emails.send({
          from: 'ESTUDIOK Relatórios <noreply@estudiak.com>',
          to: email,
          subject: `📈 Relatório Mensal - ESTUDIOK (${report.period})`,
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
                .growth-positive { color: #10B981; }
                .growth-negative { color: #EF4444; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📈 Relatório Mensal</h1>
                <p class="period">${report.period}</p>
                
                <div style="margin: 20px 0;">
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
                  <div class="metric">
                    <div class="metric-value">R$ ${report.metrics.totalPipeline.toLocaleString('pt-BR')}</div>
                    <div class="metric-label">Pipeline Total</div>
                  </div>
                </div>
                
                <div class="metric" style="width: 100%;">
                  <div class="metric-value revenue">R$ ${report.metrics.totalRevenue.toLocaleString('pt-BR')}</div>
                  <div class="metric-label">Faturamento do Mês</div>
                </div>

                <div class="metric" style="width: 100%; margin-top: 8px;">
                  <div class="metric-value ${Number(growth) >= 0 ? 'growth-positive' : 'growth-negative'}">${Number(growth) >= 0 ? '+' : ''}${report.metrics.growth}%</div>
                  <div class="metric-label">vs Mês Anterior (R$ ${report.metrics.lastMonthRevenue.toLocaleString('pt-BR')})</div>
                </div>
                
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
    console.error('Error generating monthly report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}