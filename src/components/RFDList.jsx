// src/components/RFDList.jsx
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

import { getRFDs, deleteRFD } from '../lib/firebase/rfd';

const RFDList = ({ rfds, onEdit, onView, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchRFDs();
//   }, [filters]);

//   const fetchRFDs = async () => {
//     setLoading(true);
//     try {
//       const data = await getRFDs(filters);
//       setRfds(data);
//     } catch (err) {
//       setError('Failed to fetch RFDs');
//     } finally {
//       setLoading(false);
//     }
//   };

  const handleDelete = async (rfdId) => {
    if (window.confirm('Are you sure you want to delete this RFD?')) {
      try {
        await deleteRFD(rfdId);
      } catch (err) {
        setError('Failed to delete RFD');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="space-y-4">
//       {rfds.map((rfd) => (
//         <div key={rfd.id} className="bg-white p-4 rounded-lg shadow">
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-lg font-semibold">{rfd.tournament}</h3>
//               <p className="text-sm text-gray-500">Round: {rfd.round}</p>
//               <p className="text-sm text-gray-500">
//                 {new Date(rfd.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => onEdit(rfd)}
//                 className="p-2 text-blue-500 hover:text-blue-700"
//               >
//                 <FiEdit2 />
//               </button>
//               <button
//                 onClick={() => handleDelete(rfd.id)}
//                 className="p-2 text-red-500 hover:text-red-700"
//               >
//                 <FiTrash2 />
//               </button>
//             </div>
//           </div>
          
//           <div className="space-y-2">
//             <div>
//               <h4 className="font-medium">General Feedback</h4>
//               <p className="text-gray-700">{rfd.feedback}</p>
//             </div>
//             <div>
//               <h4 className="font-medium">Strong Arguments</h4>
//               <p className="text-gray-700">{rfd.strongArguments}</p>
//             </div>
//             <div>
//               <h4 className="font-medium">Areas to Work On</h4>
//               <p className="text-gray-700">{rfd.areasToWork}</p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RFDList;



return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rfds.map((rfd) => (
        <div key={rfd.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-gray-900">{rfd.team}</h3>
              <p className="text-sm text-gray-500">Tournament: {rfd.tournament}</p>
              <p className="text-sm text-gray-500">Round: {rfd.round}</p>
              <p className="text-sm text-gray-500">Judge: {rfd.judge}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-sm ${
              rfd.result === 'win' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {rfd.result.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {rfd.feedback}
          </p>

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              onClick={() => onView(rfd)}
              className="p-2 text-blue-500 hover:text-blue-700"
              title="View"
            >
              <FiEye />
            </button>
            <button
              onClick={() => onEdit(rfd)}
              className="p-2 text-green-500 hover:text-green-700"
              title="Edit"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => onDelete(rfd.id)}
              className="p-2 text-red-500 hover:text-red-700"
              title="Delete"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
      
      {rfds.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No RFDs found matching the current filters.
        </div>
      )}
    </div>
  );
};

export default RFDList;