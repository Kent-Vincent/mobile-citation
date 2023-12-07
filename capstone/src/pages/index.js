import React, { useState, useEffect } from 'react';
import app from '../../firebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const auth = getAuth(app);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/Transaction/Transaction');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogin = async () => {
    try {
      if (email.trim() === '' || password.trim() === '') {
        toast.error('Please enter both email and password.');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

    if (user.email === 'admin@gmail.com') {
      router.push('/Transaction/Transaction');
      toast.success('YOU ARE NOW SIGNED IN.', {
        style: {
          border: '1px solid #00425A',
          background: '#E6D81C',
          padding: '16px',
          color: '#00425A',
        },
        iconTheme: {
          primary: '#00425A',
          secondary: '#FFFAEE',
        },
      }); 
    } else { 
      toast.error('You are not an admin!', {
        position: 'top-center',
      });
    }
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      toast.error('User not found. Please check your email.');
    } else if (error.code === 'auth/wrong-password') {
      toast.error('Incorrect password. Please try again.');
    } else {
      toast.error('Something is wrong, Please type correct email/password.');
    }
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>LOG IN</div>
        <div className={styles.underline}></div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <img src="em.png" alt='' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.input}>
          <img src="padlock.png" alt='' />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className={styles['submit-container']}>
        <button className={styles.submit} onClick={handleLogin}>
          <span>SIGN IN</span>
        </button>
      </div>
    </div>
  );
};


export default Login;
