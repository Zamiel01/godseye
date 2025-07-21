import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

interface BreachSearchResult {
  query: string;
  type: string;
  compromised: boolean;
  timestamp: Date;
  details?: any;
}

export const useBreachStore = () => {
  const storeBreachResult = async (searchData: Omit<BreachSearchResult, 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'breachSearches'), {
        ...searchData,
        timestamp: Timestamp.now()
      });
    } catch (err) {
      console.error('Error storing breach result:', err);
    }
  };

  return { storeBreachResult };
};
