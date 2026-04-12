'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/app/firebase';
import { emailService } from '@/lib/email-service';
import { getUserSubscription, getPlanFeatures, PlanFeatures } from '@/lib/subscription-service';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  subscription: { planId: string; features: PlanFeatures } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: Date;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscription, setSubscription] = useState<{ planId: string; features: PlanFeatures } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          id: uid,
          name: data.name,
          email: data.email,
          role: data.role || 'client',
          createdAt: data.createdAt?.toDate() || (typeof window !== 'undefined' ? new Date() : new Date(0)),
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchSubscription = async (uid: string) => {
    try {
      const sub = await getUserSubscription(uid);
      if (sub) {
        setSubscription({
          planId: sub.planId,
          features: getPlanFeatures(sub.planId),
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
        await fetchSubscription(firebaseUser.uid);
      } else {
        setUserData(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(result.user.uid);
    await fetchSubscription(result.user.uid);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      role: 'client',
      createdAt: serverTimestamp(),
    });
    setUserData({
      id: result.user.uid,
      name,
      email,
      role: 'client',
      createdAt: typeof window !== 'undefined' ? new Date() : new Date(0),
    });

    // Enviar notificação para admin
    try {
      await emailService.sendAdminNotification('new_user', {
        email,
        name,
        timestamp: new Date().toLocaleString('pt-BR')
      });
    } catch (error) {
      console.log('Notificação não enviada (configurar Resend):', error);
    }

    console.log('User registered:', email);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      subscription,
      loading, 
      signIn, 
      signUp, 
      signOut,
      resetPassword,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}