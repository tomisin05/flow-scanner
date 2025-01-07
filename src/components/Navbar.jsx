// import { Link } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';

// function Navbar() {
//   const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <Link to="/" className="text-xl font-bold">Flow Scanner</Link>
//           <div className="flex items-center space-x-4">
//             <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
//             <Link to="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <span>{user?.name}</span>
//                 <button
//                   onClick={() => logout({ returnTo: window.location.origin })}
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => loginWithRedirect()}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase/config';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Flow Scanner</Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span>{user.displayName}</span>
                {user.photoURL && (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
