import './App.css';
import React, { useEffect, useState, useRef } from 'react';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlMM2KkAC64GV59a6ijYh2vox_jnGh8MU",
  authDomain: "real-time-chat-55ff6.firebaseapp.com",
  projectId: "real-time-chat-55ff6",
  storageBucket: "real-time-chat-55ff6.firebasestorage.app",
  messagingSenderId: "371190992875",
  appId: "1:371190992875:web:5e052ce00cad5dbb1253ae"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real Time Chat</h1>
      </header>

      <section>
        {}
      </section>
    </div>
  );
}

export default App;
