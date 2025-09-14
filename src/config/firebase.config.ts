import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

export const firebaseConfig = {
  apiKey: "AIzaSyBZi1aSTRqJ5gIEQ1MUqfFfHix02hUJoGo",
  authDomain: "atom-be-challenge.firebaseapp.com",
  projectId: "atom-be-challenge",
  storageBucket: "atom-be-challenge.firebasestorage.app",
  messagingSenderId: "673351130419",
  appId: "1:673351130419:web:1a28210ab144d9d5d8f246"
};

const firebase = initializeApp(firebaseConfig);

export const db = getFirestore(firebase);