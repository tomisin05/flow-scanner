// components/FlowCard.jsx
 const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    let date;
    if (typeof dateValue === 'string') {
      // If it's a string, try to create a new Date object
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      // If it's already a Date object, use it directly
      date = dateValue;
    } else if (typeof dateValue.toDate === 'function') {
      // If it's a Firestore Timestamp, convert to Date
      date = dateValue.toDate();
    } else {
      // If we can't recognize the format, return 'Invalid Date'
      return 'Invalid Date';
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Format the date
    return date.toLocaleDateString();
  };
  

const FlowCard = ({ flow }) => {
    if (!flow) {
    return null;
  }
//   return (
//   <div key={flow.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//     <div className="relative h-48"> {/* Add relative positioning container */}
//       {flow.fileUrl ? (
//         <img 
//           src={flow.fileUrl} 
//           alt={flow.title || 'Flow image'} 
//           className="absolute top-0 left-0 w-full h-full object-contain" // Uses object-contain
//           onError={(e) => {
//             e.target.onerror = null; // Prevent infinite loop
//             e.target.src = '/projects/fallback.png'; // Your default image path
//           }}
//         />
//       ) : (
//         <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
//           <span className="text-gray-400">No image available</span>
//         </div>
//       )}
//     </div>
    // <div className="p-4">
    //   <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
    //   <p className="text-gray-600 text-sm">
    //     {flow.createdAt ? formatDate(flow.createdAt) : 'No date'}
    //   </p>
    // </div>
//   </div>
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image section */}
      <div className="relative pt-[56.25%]">
        <img 
          src={flow.fileUrl} 
          alt={flow.title} 
          className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100"
        />
      </div>
      
      {/* Content section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
        
        {/* Tournament info */}
        {flow.tournament?.name && (
          <p className="text-sm text-gray-600 mb-2">
            {flow.tournament.name} - {flow.round}
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {flow.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600"
            >
              {tag} 
            </span>
          ))}
        </div>
        <div className="p-4">
        <p className="text-gray-600 text-sm">
        {flow.createdAt ? formatDate(flow.createdAt) : 'No date'}
      </p>
    </div>
      </div>
    </div>
  );
};

export default FlowCard; 
