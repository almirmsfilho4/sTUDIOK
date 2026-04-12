import jsPDF from 'jspdf';
import { ProjectDelivery } from './warranty-service';

export interface ReportData {
  projectName: string;
  clientName: string;
  clientEmail: string;
  startDate: Date;
  deliveryDate?: Date;
  warrantyEndDate?: Date;
  status: string;
  deliverables: string[];
  features: string[];
  startNotes: string;
  deliveryNotes: string;
}

export function generateStartReportPDF(data: ReportData): void {
  const doc = new jsPDF();
  
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTUDIOK', 105, 20, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Início do Projeto', 105, 30, { align: 'center' });
  
  doc.setTextColor(50, 50, 50);
  let y = 55;
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(data.projectName, 20, y);
  y += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const clientInfo = [
    ['Cliente:', data.clientName],
    ['Email:', data.clientEmail],
['Data de Início:', data.startDate.toLocaleDateString('pt-BR')],
 ['Status:', 'Em Andamento'],
];

clientInfo.forEach(([label, value]) => {
 doc.setFont('helvetica', 'bold');
 doc.text(label ?? '', 20, y);
 doc.setFont('helvetica', 'normal');
 doc.text(value ?? '', 60, y);
 y += 8;
});

y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('O que será entregue:', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  data.features.forEach((feature, index) => {
    doc.text(`✓ ${feature}`, 25, y);
    y += 6;
  });
  
  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações Importantes:', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const infoText = [
    '• O projeto será entregue em até 48-72 horas úteis',
    '• Você terá acesso ao código fonte após a conclusão',
    '• Suporte incluído durante todo o desenvolvimento',
    '• Revisões ilimitadas até sua aprovação',
    '• Após a entrega, começa o período de garantia de 30 dias',
  ];
  
  infoText.forEach(text => {
    doc.text(text, 25, y);
    y += 7;
  });
  
  y += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 212, 255);
  doc.text('Dúvidas? Entre em contato: estudiokgames@gmail.com', 20, y);
  
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')} - ESTUDIOK`, 105, 285, { align: 'center' });
  
  doc.save(`ESTUDIOK-Inicio-${data.projectName.replace(/\s+/g, '-')}.pdf`);
}

export function generateDeliveryReportPDF(data: ReportData): void {
  const doc = new jsPDF();
  
  doc.setFillColor(0, 212, 255);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTUDIOK', 105, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Entrega do Projeto', 105, 30, { align: 'center' });
  
  doc.setTextColor(50, 50, 50);
  let y = 55;
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`✅ ${data.projectName}`, 20, y);
  y += 15;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const statusColor = data.status === 'warranty_active' ? [0, 150, 0] : [200, 100, 0];
  
  const clientInfo = [
    ['Cliente:', data.clientName],
    ['Email:', data.clientEmail],
    ['Data de Entrega:', data.deliveryDate?.toLocaleDateString('pt-BR') || 'N/A'],
    ['Garantia até:', data.warrantyEndDate?.toLocaleDateString('pt-BR') || 'N/A'],
    ['Status:', data.status === 'warranty_active' ? '🟢 Garantia Ativa' : '⚪ Finalizado'],
  ];
  
clientInfo.forEach(([label, value]) => {
 doc.setFont('helvetica', 'bold');
 doc.text(label ?? '', 20, y);
 doc.setFont('helvetica', 'normal');
 doc.text(value ?? '', 60, y);
 y += 8;
});
  
  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Itens Entregues:', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const allItems = [...data.features, ...data.deliverables];
  allItems.forEach((item, index) => {
    doc.text(`✓ ${item}`, 25, y);
    y += 6;
  });
  
  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Período de Garantia:', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const daysRemaining = data.warrantyEndDate 
    ? Math.max(0, Math.ceil((data.warrantyEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  
  const warrantyInfo = [
    `• Início: ${data.deliveryDate?.toLocaleDateString('pt-BR') || 'N/A'}`,
    `• Término: ${data.warrantyEndDate?.toLocaleDateString('pt-BR') || 'N/A'}`,
    `• Dias restantes: ${daysRemaining} dias`,
    '',
    'A garantia cobre:',
    '  ✓ Correção de bugs e erros de funcionamento',
    '  ✓ Ajustes de layout e design',
    '  ✓ Problemas de responsividade',
    '  ✓ Suporte técnico via email',
  ];
  
  warrantyInfo.forEach(text => {
    doc.text(text, 25, y);
    y += 7;
  });
  
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Como solicitar suporte durante a garantia:', 20, y);
  y += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const supportInfo = [
    '1. Acesse seu dashboard em estudik.com/dashboard',
    '2. Vá até a seção do projeto',
    '3. Clique em "Solicitar Suporte"',
    '4. Descreva o problema encontrado',
    '5. Nossa equipe responderá em até 24 horas',
  ];
  
  supportInfo.forEach(text => {
    doc.text(text, 25, y);
    y += 7;
  });
  
  y += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 212, 255);
  doc.text('Obrigado por confiar no trabalho da ESTUDIOK! 🎉', 20, y);
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('estudiokgames@gmail.com | www.estudiok.com.br', 105, 270, { align: 'center' });
  
  doc.setFontSize(8);
  doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')} - ESTUDIOK`, 105, 285, { align: 'center' });
  
  doc.save(`ESTUDIOK-Entrega-${data.projectName.replace(/\s+/g, '-')}.pdf`);
}

export function generateFullReportPDF(startData: ReportData, deliveryData: ReportData): void {
  const doc = new jsPDF();
  
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 297, 'F');
  
  doc.setTextColor(0, 212, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTUDIOK', 105, 30, { align: 'center' });
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório Completo do Projeto', 105, 42, { align: 'center' });
  
  doc.setTextColor(50, 50, 50);
  doc.setFillColor(245, 245, 245);
  doc.rect(15, 55, 180, 25, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(startData.projectName, 20, 70);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${startData.clientName}`, 20, 78);
  
  let y = 95;
  
  doc.setFillColor(0, 212, 255);
  doc.rect(15, y - 5, 180, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FASE 1: INÍCIO DO PROJETO', 20, y + 2);
  
  y += 20;
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const startInfo = [
    ['Data de Início:', startData.startDate.toLocaleDateString('pt-BR')],
    ['Status:', 'Em Andamento'],
  ];
  
startInfo.forEach(([label, value]) => {
 doc.setFont('helvetica', 'bold');
 doc.text(label ?? '', 20, y);
 doc.setFont('helvetica', 'normal');
 doc.text(value ?? '', 70, y);
 y += 8;
});
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Itens Incluídos:', 20, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  
  startData.features.slice(0, 5).forEach(feature => {
    doc.text(`• ${feature}`, 25, y);
    y += 6;
  });
  
  y += 15;
  doc.setFillColor(0, 180, 100);
  doc.rect(15, y - 5, 180, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FASE 2: ENTREGAS E GARANTIA', 20, y + 2);
  
  y += 20;
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (deliveryData.deliveryDate) {
    const deliveryInfo = [
      ['Data de Entrega:', deliveryData.deliveryDate.toLocaleDateString('pt-BR')],
      ['Garantia até:', deliveryData.warrantyEndDate?.toLocaleDateString('pt-BR') || 'N/A'],
    ];
    
deliveryInfo.forEach(([label, value]) => {
 doc.setFont('helvetica', 'bold');
 doc.text(label ?? '', 20, y);
 doc.setFont('helvetica', 'normal');
 doc.text(value ?? '', 70, y);
 y += 8;
});
  }
  
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Termos de Garantia:', 20, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  
  const terms = [
    '• Período de 30 dias após a entrega',
    '• Correção de bugs sem custo adicional',
    '• Suporte técnico via email',
    '• Ajustes de layout essenciais',
  ];
  
  terms.forEach(term => {
    doc.text(term, 25, y);
    y += 6;
  });
  
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')} - ESTUDIOK`, 105, 285, { align: 'center' });
  
  doc.save(`ESTUDIOK-Completo-${startData.projectName.replace(/\s+/g, '-')}.pdf`);
}