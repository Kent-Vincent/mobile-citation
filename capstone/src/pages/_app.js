import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import '../styles/Login.module.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { use, useEffect } from 'react';
import Router from 'next/router';
import Dashboard from './Dashboard';


function MyApp({ Component, pageProps }) {

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user){
        const uid = user.uid;
        Router.push('/Home');
      }
      else{
        Router.push('/');
      }
    });
  });

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