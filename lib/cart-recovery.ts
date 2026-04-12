import { getDocuments, updateDocument, createDocument } from './firebase-services';

export interface CartRecoveryEmail {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  quoteId: string;
  serviceType: string;
  estimatedPrice: number;
  sentAt?: Date;
  clickCount?: number;
  conversion?: boolean;
  discountOffered: number;
}

const DISCOUNT_TIERS = [
  { days: 1, discount: 10, subject: '🤔 Ainda está pensando no seu projeto?' },
  { days: 3, discount: 15, subject: '🎁 Oferta especial para você!' },
  { days: 7, discount: 20, subject: '⏰ Última chance: Desconto especial!' },
];

export async function checkAndSendRecoveryEmails() {
  try {
    const quotes = await getDocuments('quotes');
    const now = new Date();
    
    for (const quote of quotes as any[]) {
      if (quote.status !== 'pending_payment' && quote.status !== 'pending') continue;
      
      const createdAt = quote.createdAt?.toDate ? quote.createdAt.toDate() : new Date(quote.createdAt);
      const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCreation < 1) continue;
      
      const emailsSent = await getDocuments('recovery_emails');
      const sentEmails = (emailsSent as any[]).filter(
        e => e.quoteId === quote.id && e.userId === quote.userId
      );
      
      const lastEmail = sentEmails.sort((a, b) => {
        const dateA = a.sentAt?.toDate?.() || new Date(0);
        const dateB = b.sentAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })[0];
      
      const daysSinceLastEmail = lastEmail 
        ? Math.floor((now.getTime() - (lastEmail.sentAt?.toDate?.() || new Date(0)).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      
      const discountTier = DISCOUNT_TIERS.find(t => daysSinceCreation >= t.days && daysSinceLastEmail >= t.days);
      
      if (!discountTier) continue;
      
      const existingEmailToday = sentEmails.find(e => {
        const sentDate = e.sentAt?.toDate?.();
        if (!sentDate) return false;
        const today = new Date();
        return sentDate.toDateString() === today.toDateString() && e.discountOffered === discountTier.discount;
      });
      
      if (existingEmailToday) continue;
      
      await sendRecoveryEmail({
        userId: quote.userId,
        userEmail: quote.email,
        userName: quote.name || 'Cliente',
        quoteId: quote.id,
        serviceType: quote.serviceType || 'Projeto',
        estimatedPrice: quote.price || 0,
        discountOffered: discountTier.discount,
      });
    }
  } catch (error) {
    console.error('Error in cart recovery:', error);
  }
}

async function sendRecoveryEmail(data: CartRecoveryEmail) {
  const discountValue = Math.round(data.estimatedPrice * (data.discountOffered / 100));
  const finalPrice = data.estimatedPrice - discountValue;
  
  const emailContent = {
    to: data.userEmail,
    subject: DISCOUNT_TIERS.find(t => t.discount === data.discountOffered)?.subject || 'Oferta especial para você!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #000; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0A0A0A; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://estudiok.com/logo.png" alt="ESTUDIOK" style="width: 120px;">
          </div>
          
          <h1 style="color: #fff; text-align: center; margin-bottom: 20px;">
           Olá, ${data.userName}! 👋
          </h1>
          
          <p style="color: #aaa; text-align: center; font-size: 16px; line-height: 1.6;">
            Notamos que você iniciou um orçamento para 
            <strong style="color: #00D4FF;">${data.serviceType}</strong> 
            mas ainda não completou a solicitação.
          </p>
          
          <div style="background: linear-gradient(135deg, #00D4FF20, #7B2CBF20); border: 2px solid #00D4FF; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="color: #00D4FF; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">
              OFERTA ESPECIAL
            </p>
            <p style="color: #fff; font-size: 36px; font-weight: bold; margin: 0;">
              -${data.discountOffered}% OFF
            </p>
            <p style="color: #aaa; font-size: 14px; margin: 10px 0 0 0;">
              Você economiza <strong style="color: #00D4FF;">R$ ${discountValue.toLocaleString('pt-BR')}</strong>
            </p>
          </div>
          
          <p style="color: #aaa; text-align: center; font-size: 14px;">
            De: <span style="text-decoration: line-through;">R$ ${data.estimatedPrice.toLocaleString('pt-BR')}</span>
            <br>
            Por apenas: <strong style="color: #00D4FF; font-size: 24px;">R$ ${finalPrice.toLocaleString('pt-BR')}</strong>
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://estudiok.com/orcamento?quote=${data.quoteId}&discount=${data.discountOffered}" 
               style="display: inline-block; background: linear-gradient(135deg, #00D4FF, #0099cc); color: #000; padding: 16px 40px; text-decoration: none; font-weight: bold; border-radius: 8px;">
              APROVEITAR AGORA
            </a>
          </div>
          
          <p style="color: #666; text-align: center; font-size: 12px;">
            Esta oferta é válida por 48 horas.
            <br>
            Não deixe seu projeto parado! 🚀
          </p>
          
          <div style="border-top: 1px solid #1A1A1A; margin-top: 40px; padding-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              © 2024 ESTUDIOK. Todos os direitos reservados.
            </p>
            <p style="color: #444; font-size: 11px; margin: 10px 0 0 0;">
              <a href="https://estudiok.com" style="color: #444;">estudiok.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailContent),
    });

    if (response.ok) {
      await createDocument('recovery_emails', {
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        quoteId: data.quoteId,
        serviceType: data.serviceType,
        estimatedPrice: data.estimatedPrice,
        sentAt: new Date(),
        clickCount: 0,
        conversion: false,
        discountOffered: data.discountOffered,
      });
      console.log(`Recovery email sent to ${data.userEmail} with ${data.discountOffered}% discount`);
    }
  } catch (error) {
    console.error('Error sending recovery email:', error);
  }
}

export async function trackRecoveryClick(userId: string, quoteId: string) {
  try {
    const emails = await getDocuments('recovery_emails');
    const latestEmail = (emails as any[])
      .filter(e => e.userId === userId && e.quoteId === quoteId)
      .sort((a, b) => {
        const dateA = a.sentAt?.toDate?.() || new Date(0);
        const dateB = b.sentAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })[0];

    if (latestEmail) {
      await updateDocument('recovery_emails', latestEmail.id, {
        clickCount: (latestEmail.clickCount || 0) + 1,
      });
    }
  } catch (error) {
    console.error('Error tracking recovery click:', error);
  }
}