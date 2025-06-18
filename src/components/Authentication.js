import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import app from '../config';

export const auth = getAuth(app);

export function SignIn() {
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

export function SignOut() {
    return auth.currentUser && (
      <button className="ui basic inverted red icon button mini signout-button-dark" onClick={() => signOut(auth)}>
        <i className="sign out icon"></i> Sign Out
      </button>
    )
  }
