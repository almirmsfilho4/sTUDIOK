export interface ROIInput {
  projectCost: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  leadsPerMonth?: number;
  conversionRate?: number;
  averageTicket?: number;
  timeSaved?: number;
  hourlyRate?: number;
}

export interface ROIResult {
  totalInvestment: number;
  firstYearReturn: number;
  roi: number;
  paybackPeriod: number;
  threeYearROI: number;
  breakEven: number;
  monthlyBenefit: number;
  benefits: { label: string; value: number }[];
}

export function calculateROI(input: ROIInput): ROIResult {
  const benefits: { label: string; value: number }[] = [];
  let totalBenefit = 0;

  if (input.leadsPerMonth && input.conversionRate && input.averageTicket) {
    const monthlySales = input.leadsPerMonth * (input.conversionRate / 100);
    const monthlyRevenueFromLeads = monthlySales * input.averageTicket;
    totalBenefit += monthlyRevenueFromLeads;
    benefits.push({
      label: 'Receita de novas vendas',
      value: monthlyRevenueFromLeads,
    });
  }

  if (input.monthlyRevenue) {
    totalBenefit += input.monthlyRevenue;
    benefits.push({ label: 'Receita mensal', value: input.monthlyRevenue });
  }

  if (input.timeSaved && input.hourlyRate) {
    const monthlySavings = input.timeSaved * input.hourlyRate;
    totalBenefit += monthlySavings;
    benefits.push({
      label: 'Economia de tempo',
      value: monthlySavings,
    });
  }

  const monthlyBenefit = totalBenefit;
  const firstYearBenefit = monthlyBenefit * 12;
  const threeYearBenefit = firstYearBenefit * 3;

  const roi = ((firstYearBenefit - input.projectCost) / input.projectCost) * 100;
  const threeYearROI = ((threeYearBenefit - input.projectCost) / input.projectCost) * 100;
  const paybackPeriod = monthlyBenefit > 0 ? input.projectCost / monthlyBenefit : 999;
  const breakEven = paybackPeriod;

  return {
    totalInvestment: input.projectCost,
    firstYearReturn: firstYearBenefit,
    roi: Math.round(roi),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    threeYearROI: Math.round(threeYearROI),
    breakEven: Math.round(breakEven),
    monthlyBenefit,
    benefits,
  };
}

export function generateROIReport(roi: ROIResult): string {
  return `
📈 ANÁLISE DE RETORSO (ROI)

💰 INVESTIMENTO
• Valor do projeto: R$ ${roi.totalInvestment.toLocaleString('pt-BR')}
• Prazo de retorno: ${roi.paybackPeriod} meses

📊 RETORNO
• Benefício mensal: R$ ${roi.monthlyBenefit.toLocaleString('pt-BR')}
• Retorno 1º ano: R$ ${roi.firstYearReturn.toLocaleString('pt-BR')}
• ROI: ${roi.roi}%
• ROI 3 anos: ${roi.threeYearROI}%

📋 DETALHAMENTO
${roi.benefits.map(b => `• ${b.label}: R$ ${b.value.toLocaleString('pt-BR')}/mês`).join('\n')}

${roi.roi > 100 ? '✅ Excelente investimento!' : roi.roi > 50 ? '✅ Bom investimento!' : '⚠️ Considere aumentar escopo'}
  `.trim();
}

export function getROIRecommendation(roi: ROIResult): string {
  if (roi.roi >= 200) return 'Investimento excelente com retorno rápido';
  if (roi.roi >= 100) return 'Bom investimento com payback em menos de 1 ano';
  if (roi.roi >= 50) return 'Investimento sólido com retorno em 1-2 anos';
  if (roi.roi >= 0) return 'Investimento modesto, considere expandir escopo';
  return 'Considere otimizar custos ou aumentar benefícios';
}

export function calculateWebsiteROI(
  projectCost: number,
  currentMonthlyRevenue: number,
  expectedIncreasePercent: number
): ROIResult {
  const monthlyIncrease = currentMonthlyRevenue * (expectedIncreasePercent / 100);
  
  return calculateROI({
    projectCost,
    monthlyRevenue: monthlyIncrease,
  });
}

export function calculateLeadGenROI(
  projectCost: number,
  leadsPerMonth: number,
  conversionRate: number,
  averageTicket: number
): ROIResult {
  return calculateROI({
    projectCost,
    leadsPerMonth,
    conversionRate,
    averageTicket,
  });
}