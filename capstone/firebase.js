import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCvYWiNr4SqhliOGWIk0HB-rwqjZxgRZSs",
  authDomain: "mobile-citation-device.firebaseapp.com",
  databaseURL: "https://mobile-citation-device-default-rtdb.firebaseio.com",
  projectId: "mobile-citation-device",
  storageBucket: "mobile-citation-device.appspot.com",
  messagingSenderId: "617440662741",
  appId: "1:617440662741:web:1fbee04ebeae2415f8be5c",
  measurementId: "G-L1BEK19VMS"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
  
export {app, auth, database, storage};