import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ler arquivo HTML estático
    const filePath = join(process.cwd(), 'public', 'admin-dashboard.html');
    const htmlContent = await readFile(filePath, 'utf-8');
    
    // Retornar como resposta HTML
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error serving admin dashboard:', error);
    
    // Fallback: HTML inline
    return new NextResponse(`<!DOCTYPE html><html><head><title>Admin</title><style>body{background:#0A0A0A;color:#fff;padding:20px;font-family:Arial}h1{font-size:2em;margin-bottom:20px}.card{background:#1A1A1A;padding:20px;border-radius:8px;margin:10px 0}</style></head><body><h1>Admin ESTUDIOK</h1><div id="content">Carregando...</div><script>fetch('/api/dashboard/stats').then(r=>r.json()).then(d=>{document.getElementById('content').innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;max-width:1200px;margin:0 auto"><div class="card"><h2>Leads</h2><p style="color:#00D4FF;font-size:2em;margin:10px 0">'+d.leads.total+'</p><small>Mes: '+d.leads.thisMonth+' ('+d.leads.trend+'%)</small></div><div class="card"><h2>Projetos</h2><p style="color:#22C55E;font-size:2em;margin:10px 0">'+d.projects.total+'</p><small>Ativos: '+d.projects.active+' | Concluidos: '+d.projects.completed+'</small></div><div class="card"><h2>Financeiro</h2><p style="color:#A855F7;font-size:2em;margin:10px 0">R$ '+d.revenue.total.toLocaleString('pt-BR')+'</p><small>Mes: R$ '+d.revenue.thisMonth.toLocaleString('pt-BR')+'</small></div><div class="card"><h2>Conversao</h2><p style="color:#F97316;font-size:2em;margin:10px 0">'+d.conversions.rate+'%</p><small>Taxa de conversao</small></div></div><div style="margin-top:30px"><button onclick="location.reload()" style="background:#00D4FF;color:#000;padding:10px 20px;border-radius:5px;border:none;font-weight:bold;cursor:pointer">Atualizar</button></div>';}).catch(e=>{document.getElementById('content').innerHTML='<p style="color:#EF4444">Erro: '+e.message+'</p>';});</script></body></html>`, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}