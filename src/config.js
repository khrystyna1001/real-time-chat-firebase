import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyAlMM2KkAC64GV59a6ijYh2vox_jnGh8MU",
    authDomain: "real-time-chat-55ff6.firebaseapp.com",
    projectId: "real-time-chat-55ff6",
    storageBucket: "real-time-chat-55ff6.firebasestorage.app",
    messagingSenderId: "371190992875",
    appId: "1:371190992875:web:5e052ce00cad5dbb1253ae"
  };
  
const app = initializeApp(firebaseConfig);

export default app;