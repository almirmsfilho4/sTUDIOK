import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4',
  authDomain: 'estudiok-saas.firebaseapp.com',
  projectId: 'estudiok-saas',
  messagingSenderId: '134175965723',
  appId: '1:134175965723:web:c1bcf1de6cc7abb1416ebe',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addPortfolioItem() {
  try {
    const docRef = await addDoc(collection(db, 'portfolio'), {
      title: 'Menos Imposto',
      category: 'SaaS',
      image: '/portfolio/MENOSIMPOSTO.png',
      description: 'Sistema de gestão tributária inteligente para otimização de impostos',
      url: 'https://menos-imposto.vercel.app/',
      client: 'Menos Imposto',
      createdAt: new Date(),
    });

    console.log('✅ Portfolio item added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding portfolio item:', error);
  }
}

addPortfolioItem();
