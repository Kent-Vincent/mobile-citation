import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import '../styles/Login.module.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { useState, useEffect } from 'react'; 
import Router from 'next/router';
import { useRouter } from 'next/router';



function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        const uid = user.uid;
      }
      else{
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="content">
        <Component {...pageProps} />
      </div>
      <Toaster />
    </>
  );
}

export default MyApp;