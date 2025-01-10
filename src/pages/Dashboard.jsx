// import { useState, useRef } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { storage } from '../lib/firebase/config';
// import Webcam from 'react-webcam';

// function Dashboard() {
//   const { user } = useAuth();
//   const [showCamera, setShowCamera] = useState(false);
//   const [flows, setFlows] = useState([]);
//   const webcamRef = useRef(null);
  
//   const handleCapture = async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) return;

//     try {
//       // Convert base64 to blob
//       const response = await fetch(imageSrc);
//       const blob = await response.blob();

//       // Create unique filename
//       const filename = `flows/${user.uid}/${Date.now()}.jpg`;
//       const storageRef = ref(storage, filename);

//       // Upload to Firebase Storage
//       const snapshot = await uploadBytes(storageRef, blob);
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       // Save flow data to Firestore through API
//       const flowData = {
//         userId: user.uid,
//         title: `Flow ${flows.length + 1}`,
//         imageUrl: downloadURL,
//         tags: ['debate'],
//         metadata: {
//           round: '1',
//           tournament: 'Sample Tournament',
//           opponent: 'Team A'
//         }
//       };

//       const apiResponse = await fetch('/api/flows', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${await user.getIdToken()}`
//         },
//         body: JSON.stringify(flowData),
//       });

//       if (!apiResponse.ok) {
//         throw new Error('Failed to save flow data');
//       }

//       const newFlow = await apiResponse.json();
//       setFlows([...flows, { ...flowData, id: newFlow.id }]);
//       setShowCamera(false);
//     } catch (error) {
//       console.error('Error uploading flow:', error);
//       alert('Failed to upload flow');
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Your Flows</h1>
//         <button
//           onClick={() => setShowCamera(true)}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Upload New Flow
//         </button>
//       </div>

//       {showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
//           <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Capture Flow</h2>
//               <button
//                 onClick={() => setShowCamera(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//             <Webcam
//               audio={false}
//               screenshotFormat="image/jpeg"
//               onUserMedia={() => console.log('Camera ready')}
//               className="w-full"
//             />
//             <button
//               onClick={() => handleCapture()}
//               className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Capture
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {flows.map((flow) => (
//           <div key={flow.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img src={flow.image} alt={flow.title} className="w-full h-48 object-cover" />
//             <div className="p-4">
//               <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
//               <p className="text-gray-600 text-sm">
//                 {new Date(flow.date).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // export default Dashboard;


// import { useState, useRef } from 'react';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc } from 'firebase/firestore';
// import { storage, db } from '../lib/firebase/config';
// import Webcam from 'react-webcam';

// function Dashboard() {
//   const [showCamera, setShowCamera] = useState(false);
//   const [flows, setFlows] = useState([]);
//   const webcamRef = useRef(null); // Add this line - it was missing

//   const formatDate = (dateValue) => {
//     if (!dateValue) return 'N/A';
    
//     let date;
//     if (typeof dateValue === 'string') {
//       // If it's a string, try to create a new Date object
//       date = new Date(dateValue);
//     } else if (dateValue instanceof Date) {
//       // If it's already a Date object, use it directly
//       date = dateValue;
//     } else if (typeof dateValue.toDate === 'function') {
//       // If it's a Firestore Timestamp, convert to Date
//       date = dateValue.toDate();
//     } else {
//       // If we can't recognize the format, return 'Invalid Date'
//       return 'Invalid Date';
//     }
    
//     // Check if the date is valid
//     if (isNaN(date.getTime())) {
//       return 'Invalid Date';
//     }
    
//     // Format the date
//     return date.toLocaleDateString();
//   };
  

//   const handleCapture = async () => {
//     if (!webcamRef.current) {
//       console.error('Webcam not initialized');
//       return;
//     }

//     const imageSrc = webcamRef.current.getScreenshot();
//     if (!imageSrc) {
//       console.error('Failed to capture image');
//       return;
//     }

//     try {
//       // Convert base64 to blob
//       const response = await fetch(imageSrc);
//       const blob = await response.blob();

//       // Create unique filename with timestamp
//       const filename = `flows/${Date.now()}.jpg`;
//       const storageRef = ref(storage, filename);

//       // Upload to Firebase Storage
//       const snapshot = await uploadBytes(storageRef, blob);
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       // Create flow document in Firestore
//       const flowData = {
//         title: `Flow ${flows.length + 1}`,
//         imageUrl: downloadURL,
//         createdAt: new Date(),
//         tags: ['debate'],
//         metadata: {
//           round: '1',
//           tournament: 'Sample Tournament',
//           opponent: 'Team A'
//         }
//       };

//       const docRef = await addDoc(collection(db, 'flows'), flowData);
      
//       // Update local state with new flow
//       setFlows(prevFlows => [...prevFlows, { 
//         id: docRef.id, 
//         ...flowData 
//       }]);

//       // Close camera after successful capture
//       setShowCamera(false);

//       // Optional: Show success message
//       alert('Flow captured successfully!');

//     } catch (error) {
//       console.error('Error uploading flow:', error);
//       alert('Failed to upload flow: ' + error.message);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Your Flows</h1>
//         <button
//           onClick={() => setShowCamera(true)}
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Upload New Flow
//         </button>
//       </div>

//       {/* Camera Modal */}
//       {showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
//           <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Capture Flow</h2>
//               <button
//                 onClick={() => setShowCamera(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 Close
//               </button>
//             </div>
            
//             <div className="relative">
//               <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 onUserMedia={() => console.log('Camera ready')}
//                 className="w-full"
//               />
//             </div>

//             <button
//               onClick={handleCapture}
//               className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//             >
//               Capture
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Flows Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {flows.map((flow) => (
//           <div key={flow.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img 
//               src={flow.imageUrl} 
//               alt={flow.title} 
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
//               <p className="text-gray-600 text-sm">
//                 {formatDate(flow.createdAt)}
//               </p>
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {flow.tags.map((tag, index) => (
//                   <span 
//                     key={index}
//                     className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty state */}
//       {flows.length === 0 && (
//         <div className="text-center text-gray-500 mt-8">
//           No flows yet. Click "Upload New Flow" to get started!
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;


import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import FlowUpload from '../components/FlowUpload'; // Import your FlowUpload component
import { useAuth } from '../contexts/AuthContext';
import { getUserFlows } from '../lib/firebase/flows';
import FilterBar from '/src/components/FilterBar.jsx';
import FlowCard from '/src/components/FlowCard.jsx';
import { getFilteredFlows } from '../lib/firebase/flows';

function Dashboard() {
    const { user } = useAuth();
    const [flows, setFlows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filters, setFilters] = useState({
      tournament: '',
      round: '',
      team: '',
      judge: '',
      division: '',
      tags: [],
      startDate: '',
      endDate: ''
    });


  const handleFlowSubmit = async (flowData) => {
    try {
      // Create flow document in Firestore
      const docRef = await addDoc(collection(db, 'flows'), {
        ...flowData,
        createdAt: new Date()
      });
      
      // Update local state with new flow
      setFlows(prevFlows => [...prevFlows, { 
        id: docRef.id, 
        ...flowData 
      }]);

      // Close modal after successful upload
      setShowUploadModal(false);


      // Optional: Show success message
      alert('Flow uploaded successfully!');

    } catch (error) {
      console.error('Error uploading flow:', error);
      alert('Failed to upload flow: ' + error.message);
    }
  };

  



  // Fetch flows when filters change
  useEffect(() => {
    if (!user?.uid) return;

    const fetchFlows = async () => {
      setIsLoading(true);
      try {
        const flowsData = await getFilteredFlows(user.uid, filters);
        setFlows(flowsData);
      } catch (error) {
        console.error('Error fetching flows:', error);
        alert('Failed to fetch flows');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFlows();
  }, [user, filters]);


  
  const handleFilterChange = async (newFilters) => {
    setIsLoading(true);
    try {
      const filteredFlows = await getFilteredFlows(user.uid, newFilters);
      setFlows(filteredFlows);
    } catch (error) {
      console.error('Error filtering flows:', error);
      alert('Failed to filter flows');
    } finally {
      setIsLoading(false);
    }
  };


  const handleTagsChange = (selectedTags) => {
    setFilters(prev => ({
      ...prev,
      tags: selectedTags
    }));
  };

  const clearFilters = () => {
    setFilters({
      tournament: '',
      round: '',
      team: '',
      division: '',
      tags: [],
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Flows</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload New Flow
        </button>
      </div>
    
      {/* Updated Modal Structure */} 
      {showUploadModal && ( 
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" />

            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowUploadModal(false) }
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-3 sm:mt-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Upload Flow
                </h3>
                <div className="mt-4 max-h-[80vh] overflow-y-auto">
                  <FlowUpload onSubmit={handleFlowSubmit} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : flows.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No flows found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flows.map((flow) => (
            <FlowCard key={flow.id} flow={flow} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;


// return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Your Flows</h1>
//         <button
//           onClick={() => setShowUploadModal(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Upload New Flow
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded-lg shadow p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {/* Tournament Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tournament
//             </label>
//             <input
//               type="text"
//               name="tournament"
//               value={filters.tournament}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           {/* Round Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Round
//             </label>
//             <input
//               type="text"
//               name="round"
//               value={filters.round}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           {/* Team Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Team
//             </label>
//             <input
//               type="text"
//               name="team"
//               value={filters.team}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           {/* Division Filter */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Division
//             </label>
//             <input
//               type="text"
//               name="division"
//               value={filters.division}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           {/* Date Range Filters */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={filters.startDate}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               End Date
//             </label>
//             <input
//               type="date"
//               name="endDate"
//               value={filters.endDate}
//               onChange={handleFilterChange}
//               className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Filter Actions */}
//         <div className="mt-4 flex justify-end space-x-4">
//           <button
//             onClick={clearFilters}
//             className="px-4 py-2 text-gray-700 hover:text-gray-900"
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Flows Grid */}
//       {isloading ? (
//         <div className="text-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {flows.map((flow) => (
//             <div key={flow.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img
//                 src={flow.fileUrl}
//                 alt={flow.title}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
//                 <div className="text-sm text-gray-600">
//                   {flow.tournament && (
//                     <p>Tournament: {flow.tournament}</p>
//                   )}
//                   {flow.round && (
//                     <p>Round: {flow.round}</p>
//                   )}
//                   {flow.team && (
//                     <p>Team: {flow.team}</p>
//                   )}
//                   <p>Uploaded: {new Date(flow.uploadDate?.toDate()).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
//             <div className="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
//               <div className="absolute top-0 right-0 pt-4 pr-4">
//                 <button
//                   onClick={() => setShowUploadModal(false)}
//                   className="text-gray-400 hover:text-gray-500"
//                 >
//                   <span className="sr-only">Close</span>
//                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <div className="mt-3 sm:mt-0">
//                 <h3 className="text-lg font-medium leading-6 text-gray-900">
//                   Upload Flow
//                 </h3>
//                 <div className="mt-4 max-h-[80vh] overflow-y-auto">
//                   <FlowUpload
//                     onSubmit={(flowData) => {
//                       setShowUploadModal(false);
//                       // Refresh flows list
//                       getFilteredFlows(user.uid, filters).then(setFlows);
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;

