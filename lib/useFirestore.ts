import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  Timestamp,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from './firebase';

// Types for breach data
interface BreachData {
  query: string;
  type: string;
  result: any;
  timestamp: Date;
  resultCount: number;
}

interface NewsData {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  savedAt: Date;
}

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save breach search result
  const saveBreachSearch = async (searchData: Omit<BreachData, 'timestamp'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = await addDoc(collection(db, 'breachSearches'), {
        ...searchData,
        timestamp: Timestamp.now()
      });
      
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the search');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get recent breach searches
  const getRecentBreachSearches = async (limitCount = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'breachSearches'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching recent searches');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Save news article
  const saveNewsArticle = async (newsData: Omit<NewsData, 'savedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const docRef = await addDoc(collection(db, 'savedNews'), {
        ...newsData,
        savedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the article');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get saved news articles
  const getSavedNews = async (limitCount = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'savedNews'),
        orderBy('savedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching saved news');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get breach searches by type
  const getBreachSearchesByType = async (type: string, limitCount = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'breachSearches'),
        where('type', '==', type),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching searches by type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveBreachSearch,
    getRecentBreachSearches,
    saveNewsArticle,
    getSavedNews,
    getBreachSearchesByType
  };
};
