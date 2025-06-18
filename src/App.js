import './App.css';
import React from 'react';

import { SignIn, SignOut, auth } from './components/Authentication';
import { Chatroom, ChatMessage } from './components/ChatRoom';
import app from './config';

// React Firebase Hooks
import { useAuthState } from 'react-firebase-hooks/auth';

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

export default App;