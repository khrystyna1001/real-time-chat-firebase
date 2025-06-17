import './App.css';
import React, { useEffect, useState, useRef } from 'react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limitToLast, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// React Firebase Hooks
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
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="ui text container">
        <div className="ui placeholder segment auth-loader-segment-dark">
          <div className="ui active centered inline large loader">Loading Authentication...</div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="ui text container">
        <div className="ui placeholder segment auth-loader-segment-dark">
          <h3 className="ui icon header">
            <i className="warning sign icon"></i>
            Authentication Error
          </h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ui container app-container-dark">
      <div className="ui top attached inverted menu top-menu-dark">
        <a className="item header">
          <i className="comments icon"></i> Real-Time Chat
        </a>
        <div className="right menu">
          {user && (
            <a className="item">
              {user.displayName || user.email ? `Welcome, ${user.displayName || user.email}` : 'Welcome!'}
            </a>
          )}
          <div className="item">
            <SignOut />
          </div>
        </div>
      </div>

      <div className="ui bottom attached padded very segment chat-main-segment-dark">
        <div className="ui centered grid">
          <div className="column">
            {user ? <Chatroom /> : <SignIn />}
          </div>
        </div>
      </div>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
      console.error("Sign-in error:", error);
      alert("Failed to sign in: " + error.message);
    });
  }

  return (
    <div className="ui placeholder segment signin-placeholder-dark">
      <div className="ui icon header">
        <i className="sign in alternate icon"></i>
        Sign In to Start Chatting
      </div>
      <button className="ui primary fluid large button google-signin-button-dark" onClick={signInWithGoogle}>
        <i className="google icon"></i> Sign In with Google
      </button>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="ui basic inverted red icon button mini signout-button-dark" onClick={() => signOut(auth)}>
      <i className="sign out icon"></i> Sign Out
    </button>
  )
}

function Chatroom() {
  const dummy = useRef();
  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt'), limitToLast(25));
  const [formValue, setFormValue] = useState('');

  const [messages, , messagesError] = useCollectionData(messagesQuery, { idField: 'id' });

  const sendMessage = async (e) => {
    e.preventDefault();

    const trimmedFormValue = formValue.trim();
    if (!trimmedFormValue) {
        setFormValue(''); 
        return;
    }

    if (!auth.currentUser) {
      console.error("No authenticated user to send message!");
      alert("Please sign in to send messages.");
      return;
    }

    const { uid, photoURL, displayName } = auth.currentUser;

    await addDoc(messagesRef, {
      text: trimmedFormValue, 
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      displayName: displayName || null
    });

    setFormValue('');
    setTimeout(() => {
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  return (
    <>
      <div className="ui segment messages-segment-dark">
        {messagesError && (
          <div className="ui basic center aligned segment messages-error-segment-dark">
            <i className="warning sign red large icon"></i>
            <h4 className="ui red header">Error loading messages</h4>
            <p>{messagesError.message}</p>
          </div>
        )}
        <div className="ui comments">
          {(!messages || messages.length === 0) && !messagesError && (
            <div className="ui placeholder segment no-messages-placeholder-dark">
                <h4 className="ui grey header">No messages yet. Say hello!</h4>
            </div>
          )}
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          <span ref={dummy} style={{ float: 'left', clear: 'both' }}></span>
        </div>
      </div>

      <form onSubmit={sendMessage} className="ui reply form">
        <div className="ui equal width fields">
          <div className="field">
            <input
              type="text"
              placeholder='Say something..'
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              disabled={!auth.currentUser}
              className="chat-input-dark"
            />
          </div>
          <button
            type='submit'
            className="ui primary icon button send-button-dark"
            disabled={!formValue || !auth.currentUser}>
            <i className="paper plane icon"></i> Send
          </button>
        </div>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL, createdAt, displayName } = props.message;

  if (!text || text.trim().length === 0) {
    return null;
  }

  const isSentByMe = auth.currentUser?.uid === uid;
  const time = createdAt?.toDate ? createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  const senderName = isSentByMe ? 'You' : (displayName || '');
  const showSenderDetails = senderName !== '';

  return (
    <div className={`comment ${isSentByMe ? 'sent-by-me' : 'received-by-others'}`}>
      <a className="avatar">
        <img src={photoURL || 'https://react.semantic-ui.com/images/avatar/small/matt.jpg'}
             className="ui image"
             alt="user avatar" />
      </a>
      <div className={`content ${isSentByMe ? 'message-content-sent-dark' : 'message-content-received-dark'}`}>
        {showSenderDetails && (
          <>
            <a className="author message-author-dark">{senderName}</a>
            <span style={{ marginLeft: '0.5em' }}></span> {/* Keep very specific layout non-theme related inline styles */}
            <div className="metadata message-metadata-dark">
              <div>{time}</div>
            </div>
            <br />
          </>
        )}
        <div className="text" style={{ marginTop: showSenderDetails ? '4px' : '0' }}> {/* Keep specific layout non-theme related inline styles */}
          {text}
        </div>
      </div>
    </div>
  );
}

export default App;