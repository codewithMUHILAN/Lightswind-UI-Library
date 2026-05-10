import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/config';
import { useUser } from '../contexts/UserContext';

const useCartCount = () => {
  const [count, setCount] = useState<number>(0);
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.email) {
      setCount(0); // Ensure count is zero if user is not logged in
      return;
    }

    const cartCollectionRef = collection(db, "lightswind-ui-cart");
    const q = query(cartCollectionRef, where('userEmail', '==', user.email));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setCount(querySnapshot.size); // Set count to the number of documents
    }, (error) => {
      console.error('Error fetching cart count:', error);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, [user]);

  return count;
};

export default useCartCount;
