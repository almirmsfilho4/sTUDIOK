import { NextResponse } from 'next/server';

export async function GET() {
  const currentHour = new Date().getHours();
  
  let baseVagas = 30;
  
  if (currentHour >= 9 && currentHour <= 18) {
    baseVagas = 25;
  }
  
  if (currentHour >= 19 && currentHour <= 23) {
    baseVagas = 20;
  }
  
  const hoje = new Date();
  const dia = hoje.getDate();
  
  const vagasOcupadas = Math.floor((Math.sin(dia * 0.5) + 1) * 10) + 5;
  
  const vagasRestantes = Math.max(1, baseVagas - vagasOcupadas);
  
  const isWeekend = hoje.getDay() === 0 || hoje.getDay() === 6;
  if (isWeekend) {
    baseVagas = 15;
  }
  
  return NextResponse.json({
    vagasRestantes,
    totalVagas: baseVagas,
    atualizadoEm: new Date().toISOString(),
    mensagem: vagasRestantes <= 5 
      ? 'ÚLTIMAS VAGAS! Corre antes que acabem!' 
      : 'Oportunidade limitada!',
    nivelUrgencia: vagasRestantes <= 5 ? 'alto' : vagasRestantes <= 10 ? 'medio' : 'baixo'
  });
}