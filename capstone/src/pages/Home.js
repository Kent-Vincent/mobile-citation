import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged ,signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import app from '../../firebase';
import Dashboard from './Dashboard';
import Navbar from './Navbar';

const Home = () => {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Sign-out successful.
      router.push('/');
    } catch (error) {
      // An error happened.
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <Dashboard />
      <Navbar />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;