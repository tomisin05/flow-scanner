import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { createUserDocument } from '../lib/firebase/users';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function login() {
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   }

//   function logout() {
//     return signOut(auth);
//   }

  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            await createUserDocument(user);
          } catch (error) {
            console.error("Error creating user document:", error);
          }
        }
        setUser(user);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);

    function login() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      }
    
      function logout() {
        return signOut(auth);
      }
    
  
    // // Sign up function
    // const signup = async (email, password) => {
    //   try {
    //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //     await createUserDocument(userCredential.user);
    //     return userCredential.user;
    //   } catch (error) {
    //     throw error;
    //   }
    // };
  
    // // Sign in function
    // const signin = async (email, password) => {
    //   try {
    //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //     await createUserDocument(userCredential.user);
    //     return userCredential.user;
    //   } catch (error) {
    //     throw error;
    //   }
    // };


  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
  }

  function validateUserData(user) {
    if (!user) {
      throw new Error('No user provided');
    }
    if (!user.uid) {
      throw new Error('User must have a uid');
    }
    // Note: Other fields like displayName, photoURL might be null for new users
    if (!user.email) {
      throw new Error('User must have an email');
    }
  }
  