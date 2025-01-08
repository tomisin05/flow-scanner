import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

// // src/components/Layout.jsx
// import { Outlet, NavLink } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'

// function Layout() {
//   const { currentUser, logout } = useAuth()

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex space-x-4">
//               <NavLink 
//                 to="/" 
//                 className={({ isActive }) =>
//                   `px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`
//                 }
//               >
//                 Home
//               </NavLink>
              
//               {currentUser && (
//                 <>
//                   <NavLink 
//                     to="/dashboard" 
//                     className={({ isActive }) =>
//                       `px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`
//                     }
//                   >
//                     Dashboard
//                   </NavLink>
                  
//                   <NavLink 
//                     to="/tournaments" 
//                     className={({ isActive }) =>
//                       `px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`
//                     }
//                   >
//                     Tournaments
//                   </NavLink>
                  
//                   <NavLink 
//                     to="/leaderboard" 
//                     className={({ isActive }) =>
//                       `px-3 py-2 rounded-md ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`
//                     }
//                   >
//                     Leaderboard
//                   </NavLink>
//                 </>
//               )}
//             </div>

//             <div className="flex items-center space-x-4">
//               {currentUser ? (
//                 <>
//                   <span className="text-gray-700">{currentUser.email}</span>
//                   <button
//                     onClick={logout}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Sign Out
//                   </button>
//                 </>
//               ) : (
//                 <NavLink 
//                   to="/" 
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                   Sign In
//                 </NavLink>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <Outlet />
//       </main>
//     </div>
//   )
// }

// export default Layout
