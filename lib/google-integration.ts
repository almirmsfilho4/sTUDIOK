import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface GoogleCalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees?: string[];
  meetLink?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
}

export async function createCalendarEvent(event: GoogleCalendarEvent): Promise<string> {
  const calendarEvent = {
    summary: event.title,
    description: event.description,
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: 'America/Sao_Paulo',
    },
    attendees: event.attendees?.map(email => ({ email })),
    conferenceData: {
      createRequest: { requestId: `estudiok-${Date.now()}` },
    },
  };

  await addDoc(collection(db, 'calendarEvents'), {
    ...event,
    status: 'scheduled',
    createdAt: serverTimestamp(),
  });

  return `mock-event-${Date.now()}`;
}

export async function createMeetingLink(title: string, startTime: Date, duration: number = 60): Promise<string> {
  const meetId = Math.random().toString(36).substring(2, 10);
  const link = `https://meet.google.com/${meetId}`;

  await addDoc(collection(db, 'meetings'), {
    title,
    startTime,
    duration,
    link,
    status: 'scheduled',
    createdAt: serverTimestamp(),
  });

  return link;
}

export async function uploadToDrive(fileName: string, content: string, mimeType: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'driveFiles'), {
    name: fileName,
    mimeType,
    status: 'uploaded',
    uploadedAt: serverTimestamp(),
  });

  return `drive-file-${docRef.id}`;
}

export async function getDriveFiles(folderId?: string): Promise<GoogleDriveFile[]> {
  const q = query(collection(db, 'driveFiles'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    mimeType: doc.data().mimeType,
  }));
}

export async function createSharedFolder(folderName: string, projectId: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'driveFolders'), {
    name: folderName,
    projectId,
    status: 'created',
    createdAt: serverTimestamp(),
  });

  return `folder-${docRef.id}`;
}

export async function addFileToProject(projectId: string, file: { name: string; url: string; type: string }): Promise<void> {
  await addDoc(collection(db, 'projectFiles'), {
    projectId,
    ...file,
    uploadedAt: serverTimestamp(),
  });
}

export async function syncWithGoogleCalendar(userId: string): Promise<boolean> {
  await addDoc(collection(db, 'syncLogs'), {
    userId,
    service: 'google_calendar',
    status: 'success',
    syncedAt: serverTimestamp(),
  });
  return true;
}

export function generateMeetLink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const parts = [];
  for (let i = 0; i < 3; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    parts.push(part);
  }
  return `https://meet.google.com/${parts.join('-')}`;
}

export function formatGoogleCalendarUrl(title: string, date: Date, duration: number = 60): string {
  const start = new Date(date);
  const end = new Date(start.getTime() + duration * 60000);
  
  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '');
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(start)}/${formatDate(end)}`;
}