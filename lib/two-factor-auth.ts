import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

export interface TwoFactorSetup {
  id: string;
  userId: string;
  secret: string;
  backupCodes: string[];
  enabled: boolean;
  createdAt: Date;
}

function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    codes.push(`${code.substring(0, 3)}-${code.substring(3)}`);
  }
  return codes;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function setupTwoFactor(userId: string): Promise<{
  secret: string;
  code: string;
  backupCodes: string[];
}> {
  const existingSetup = await getTwoFactorSetup(userId);
  if (existingSetup?.enabled) {
    throw new Error('2FA já está habilitado');
  }

  const secret = generateSecret();
  const code = generateCode();
  const backupCodes = generateBackupCodes();

  await addDoc(collection(db, 'twoFactorSetups'), {
    userId,
    secret,
    backupCodes,
    enabled: false,
    code,
    codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    createdAt: new Date(),
  });

  return { secret, code, backupCodes };
}

export async function enableTwoFactor(userId: string, inputCode: string): Promise<boolean> {
  const q = query(collection(db, 'twoFactorSetups'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
if (snapshot.empty) throw new Error('Configuração não encontrada');

 const setupDoc = snapshot.docs[0];
 if (!setupDoc) throw new Error('Configuração não encontrada');
 const setup = setupDoc.data();
  
  if (inputCode !== setup.code) {
    return false;
  }

  await updateDoc(doc(db, 'twoFactorSetups', setupDoc.id), {
    enabled: true,
  });

  return true;
}

export async function disableTwoFactor(userId: string, code: string): Promise<boolean> {
  const setup = await getTwoFactorSetup(userId);
  if (!setup || !setup.enabled) return true;

  if (code !== setup.secret.slice(-6)) {
    return false;
  }

  await updateDoc(doc(db, 'twoFactorSetups', setup.id), {
    enabled: false,
  });

  return true;
}

export async function verifyTwoFactorCode(userId: string, inputCode: string): Promise<boolean> {
  const setup = await getTwoFactorSetup(userId);
  if (!setup || !setup.enabled) return true;

  if (setup.backupCodes.map(c => c.replace(/[- ]/g, '')).includes(inputCode.replace(/[- ]/g, '').toUpperCase())) {
    const newCodes = setup.backupCodes.filter(c => c.replace(/[- ]/g, '') !== inputCode.replace(/[- ]/g, '').toUpperCase());
    await updateDoc(doc(db, 'twoFactorSetups', setup.id), {
      backupCodes: newCodes,
    });
    return true;
  }

  return inputCode === setup.secret.slice(-6);
}

export async function getTwoFactorSetup(userId: string): Promise<TwoFactorSetup | null> {
  const q = query(collection(db, 'twoFactorSetups'), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    secret: data.secret,
    backupCodes: data.backupCodes,
    enabled: data.enabled,
    createdAt: data.createdAt?.toDate(),
  };
}

export async function isTwoFactorEnabled(userId: string): Promise<boolean> {
  const setup = await getTwoFactorSetup(userId);
  return setup?.enabled || false;
}

export async function regenerateBackupCodes(userId: string): Promise<string[]> {
  const setup = await getTwoFactorSetup(userId);
  if (!setup) throw new Error('Configuração não encontrada');

  const newCodes = generateBackupCodes();

  await updateDoc(doc(db, 'twoFactorSetups', setup.id), {
    backupCodes: newCodes,
  });

  return newCodes;
}

export function generateRecoveryCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}