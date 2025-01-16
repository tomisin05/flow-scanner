// src/components/RFDFilterBar.jsx
import { FiCalendar, FiAward, FiUsers, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BiTrophy } from 'react-icons/bi'
import { useState, useCallback,  } from 'react';
import { getRFDs } from '../lib/firebase/rfd';
import { auth } from '../lib/firebase/config';



// const RFDFilterBar = ({ filters, setFilters }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleFilterChange = (field, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };
  
//   const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Doubles',  'Octas', 'Quarters', 'Semis', 'Finals'];

//   return (
//     <div className="bg-white p-2 rounded-lg shadow mb-4">
//       <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsExpanded(!isExpanded)}>
//         <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
//         <button className="text-gray-500 hover:text-gray-700">
//           {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
//         </button>
//       </div>

//       {isExpanded && (
//         <div className="flex flex-wrap gap-4">
//           {/* Tournament Filter */}
//           <div className="flex items-center space-x-2">
//             <BiTrophy className="text-indigo-500" />
//             <input
//               type="text"
//               className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Tournament"
//               value={filters.tournament}
//               onChange={(e) => handleFilterChange('tournament', e.target.value)}
//             />
//           </div>

//           {/* Date Range Filter */}
//           <div className="flex items-center space-x-2">
//             <FiCalendar className="text-indigo-500" />
//             <input
//               type="date"
//               className="px-2 py-1 border border-gray-300 rounded-md"
//               value={filters.dateFrom}
//               onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
//             />
//             <span>-</span>
//             <input
//               type="date"
//               className="px-2 py-1 border border-gray-300 rounded-md"
//               value={filters.dateTo}
//               onChange={(e) => handleFilterChange('dateTo', e.target.value)}
//             />
//           </div>

//           {/* Team Filter */}
//           <div className="flex items-center space-x-2">
//             <FiUsers className="text-indigo-500" />
//             <input
//               type="text"
//               className="px-2 py-1 border border-gray-300 rounded-md"
//               placeholder="Team"
//               value={filters.team}
//               onChange={(e) => handleFilterChange('team', e.target.value)}
//             />
//           </div>

//           {/* Judge Filter */}
//           <div className="flex items-center space-x-2">
//             <FiUser className="text-indigo-500" />
//             <input
//               type="text"
//               className="px-2 py-1 border border-gray-300 rounded-md"
//               placeholder="Judge"
//               value={filters.judge}
//               onChange={(e) => handleFilterChange('judge', e.target.value)}
//             />
//           </div>

//           {/* Result Filter */}
//           <div className="flex items-center space-x-2">
//             <FiAward className="text-indigo-500" />
//             <select
//               className="px-2 py-1 border border-gray-300 rounded-md"
//               value={filters.result}
//               onChange={(e) => handleFilterChange('result', e.target.value)}
//             >
//               <option value="">All Results</option>
//               <option value="win">Win</option>
//               <option value="loss">Loss</option>
//             </select>
//           </div>

//           {/* Round Filter */}
//           <div className="flex items-center space-x-2">
//             <FiAward className="text-indigo-500" />
//             <select
//               className="px-2 py-1 border border-gray-300 rounded-md"
//               value={filters.round}
//               onChange={(e) => handleFilterChange('round', e.target.value)}
//             >
//               <option value="">All Rounds</option>
//               {rounds.map((round) => (
//                 <option key={round} value={round}>{round}</option>
//               ))}
//             </select>
//           </div>

//           {/* Clear Filters Button */}
//           <div className="flex items-center">
//             <button
//               onClick={() => {
//                 setFilters({
//                   dateFrom: '',
//                   dateTo: '',
//                   tournament: '',
//                   team: '',
//                   judge: '',
//                   round: '',
//                   result: ''
//                 });
//               }}
//               className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RFDFilterBar;




const RFDFilterBar = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    tournament: '',
    team: '',
    judge: '',
    round: '',
    result: ''
  });

  // Predefined options
  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Doubles',  'Octos', 'Quarters', 'Semis', 'Finals'];

//   const handleFilterChange = async (newFilters) => { 
//     setIsLoading(true);
//     try {
//         const filteredRFDs = await getRFDs(newFilters, currentUser.uid); // Correct the order of arguments
//         setRfds(filteredRFDs);
//     } catch (error) { 
//         console.error('Error filtering RFDs:', error);
//         alert('Failed to filter RFDs'); 
//     } finally {  
//         setIsLoading(false); 
//     }
// };

const handleFilterChange = (field, value) => {
  const newFilters = { ...filters, [field]: value };
  setFilters(newFilters);
  onFilterChange(newFilters);
};

  // Clear all filters
  const handleClearFilters = () => {
    const emptyFilters = {
        dateFrom: '',
        dateTo: '',
        tournament: '',
        team: '',
        judge: '',
        round: '',
        result: ''
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };


  return (
    // <div className="bg-white rounded-lg shadow-lg mb-6 transition-all duration-200">
    //   {/* Filter Header */}
    //   <div 
    //     className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
    //     onClick={() => setIsExpanded(!isExpanded)}
    //   >
    //     <div className="flex items-center space-x-2">
    //       <FiFilter className="text-indigo-600" />
    //       <h3 className="font-semibold text-gray-700">Filter Flows</h3>
    //       {/* Show active filters count */}
    //       {Object.values(filters).some(value => 
    //         Array.isArray(value) ? value.length > 0 : value !== ''
    //       ) && (
    //         <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
    //           Active Filters
    //         </span>
    //       )}
    //     </div>
    //     <button 
    //       className={`p-2 rounded-full transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
    //     >
    //       <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    //       </svg>
    //     </button>
    //   </div>

    //   {/* Expandable Filter Content */}
    //   {isExpanded && (
    //     <div className="p-4 border-t border-gray-100">
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //         {/* Tournament Filter */}
    //         <div className="space-y-2">
    //           <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiAward className="mr-2 text-indigo-500" />
    //             Tournament
    //           </label>
    //           <input
    //             type="text"
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //             placeholder="Enter tournament name"
    //             value={filters.tournament}
    //             onChange={(e) => handleFilterChange('tournament', e.target.value)}
    //           />
    //         </div>

    //         {/* Round Filter */}
    //         <div className="space-y-2">
    //           <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiUsers className="mr-2 text-indigo-500" />
    //             Round
    //           </label>
    //           <select
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //             value={filters.round}
    //             onChange={(e) => handleFilterChange('round', e.target.value)}
    //           >
    //             <option value="">All Rounds</option>
    //             {rounds.map((round) => (
    //               <option key={round} value={round}>{round}</option>
    //             ))}
    //           </select>
    //         </div>

    //         {/* Division Filter */}
    //         <div className="space-y-2">
    //           <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiAward className="mr-2 text-indigo-500" />
    //             Division
    //           </label>
    //           <select
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //             value={filters.division}
    //             onChange={(e) => handleFilterChange('division', e.target.value)}
    //           >
    //             <option value="">All Divisions</option>
    //             {divisions.map((division) => (
    //               <option key={division} value={division}>{division}</option>
    //             ))}
    //           </select>
    //         </div>

    //         {/* Team Filter */}
    //         <div className="space-y-2">
    //           <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiUsers className="mr-2 text-indigo-500" />
    //             Team
    //           </label>
    //           <input
    //             type="text"
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //             placeholder="Enter team name"
    //             value={filters.team}
    //             onChange={(e) => handleFilterChange('team', e.target.value)}
    //           />
    //         </div>

    //         {/* Judge Filter */}
    //         <div className="space-y-2">
    //         <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiUsers className="mr-2 text-indigo-500" />
    //             Judge
    //         </label>
    //         <input
    //             type="text"
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //             placeholder="Enter judge name"
    //             value={filters.judge}
    //             onChange={(e) => handleFilterChange('judge', e.target.value)}
    //         />
    //         </div>

    //         {/* Title Filter */}
    //         <div className="space-y-2">
    //         <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiFileText className="mr-2 text-indigo-500" />
    //             Title
    //         </label>
    //         <input
    //             type="text"
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //             placeholder="Enter flow title"
    //             value={filters.title}
    //             onChange={(e) => handleFilterChange('title', e.target.value)}
    //         />
    //         </div>

    //         {/* Date Range Filters */}
    //         <div className="space-y-2">
    //           <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiCalendar className="mr-2 text-indigo-500" />
    //             Date Range
    //           </label>
    //           <div className="grid grid-cols-2 gap-2">
    //             <input
    //               type="date"
    //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //               value={filters.startDate}
    //               onChange={(e) => handleFilterChange('startDate', e.target.value)}
    //             />
    //             <input
    //               type="date"
    //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    //               value={filters.endDate}
    //               onChange={(e) => handleFilterChange('endDate', e.target.value)}
    //             />
    //           </div>
    //         </div>

    //         {/* Tags Filter */}
    //         <div className="space-y-2">
    //           <label className="flex items-center text-sm font-medium text-gray-700">
    //             <FiTag className="mr-2 text-indigo-500" />
    //             Tags
    //           </label>
    //           <div className="flex flex-wrap gap-2">
    //             {commonTags.map((tag) => (
    //               <button
    //                 key={tag}
    //                 onClick={() => handleTagToggle(tag)}
    //                 className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
    //                   filters.tags.includes(tag)
    //                     ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
    //                     : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
    //                 }`}
    //               >
    //                 {tag}
    //               </button>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       {/* Clear Filters Button */}
    //       <div className="mt-4 flex justify-end">
    //         <button
    //           onClick={handleClearFilters}
    //           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
    //         >
    //           Clear Filters
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="bg-white p-2 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-4">
          {/* Tournament Filter */}
          <div className="flex items-center space-x-2">
            <BiTrophy className="text-indigo-500" />
            <input
              type="text"
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tournament"
              value={filters.tournament}
              onChange={(e) => handleFilterChange('tournament', e.target.value)}
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-indigo-500" />
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          {/* Team Filter */}
          <div className="flex items-center space-x-2">
            <FiUsers className="text-indigo-500" />
            <input
              type="text"
              className="px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Team"
              value={filters.team}
              onChange={(e) => handleFilterChange('team', e.target.value)}
            />
          </div>

          {/* Judge Filter */}
          <div className="flex items-center space-x-2">
            <FiUser className="text-indigo-500" />
            <input
              type="text"
              className="px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Judge"
              value={filters.judge}
              onChange={(e) => handleFilterChange('judge', e.target.value)}
            />
          </div>

          {/* Result Filter */}
          <div className="flex items-center space-x-2">
            <FiAward className="text-indigo-500" />
            <select
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.result}
              onChange={(e) => handleFilterChange('result', e.target.value)}
            >
              <option value="">All Results</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </select>
          </div>

          {/* Round Filter */}
          <div className="flex items-center space-x-2">
            <FiAward className="text-indigo-500" />
            <select
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.round}
              onChange={(e) => handleFilterChange('round', e.target.value)}
            >
              <option value="">All Rounds</option>
              {rounds.map((round) => (
                <option key={round} value={round}>{round}</option>
              ))}
            </select>
          </div>
        
          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>

          {/* Clear Filters Button */}
          {/* <div className="flex items-center">
            <button
              onClick={() => {
                setFilters({
                  dateFrom: '',
                  dateTo: '',
                  tournament: '',
                  team: '',
                  judge: '',
                  round: '',
                  result: ''
                });
              }}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Clear Filters
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default RFDFilterBar;