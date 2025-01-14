// // src/components/RFDView.jsx
// const RFDView = ({ rfd }) => {
//   if (!rfd) return null;

//   return (
//     <div className="space-y-6">
//       {/* Header Information */}
//       <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
//         <div>
//           <p className="text-sm text-gray-500">Team</p>
//           <p className="font-medium">{rfd.team}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Judge</p>
//           <p className="font-medium">{rfd.judge}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Result</p>
//           <p className={`font-medium ${
//             rfd.result === 'win' ? 'text-green-600' : 'text-red-600'
//           }`}>
//             {rfd.result.toUpperCase()}
//           </p>
//         </div>
//       </div>

//       {/* Feedback Sections */}
//       <div className="space-y-4">
//         <section>
//           <h4 className="font-medium text-gray-900 mb-2">General Feedback</h4>
//           <p className="text-gray-700 whitespace-pre-wrap">{rfd.feedback}</p>
//         </section>

//         <section>
//           <h4 className="font-medium text-gray-900 mb-2">Strong Arguments</h4>
//           <p className="text-gray-700 whitespace-pre-wrap">{rfd.strongArguments}</p>
//         </section>

//         <section>
//           <h4 className="font-medium text-gray-900 mb-2">Areas to Work On</h4>
//           <p className="text-gray-700 whitespace-pre-wrap">{rfd.areasToWork}</p>
//         </section>

//         <section>
//           <h4 className="font-medium text-gray-900 mb-2">Judge Notes</h4>
//           <p className="text-gray-700 whitespace-pre-wrap">{rfd.judgeNotes}</p>
//         </section>
//       </div>

//       {/* Timestamp Information */}
//       <div className="text-sm text-gray-500 pt-4 border-t">
//         <p>Created: {new Date(rfd.createdAt).toLocaleString()}</p>
//         {rfd.updatedAt && (
//           <p>Last Updated: {new Date(rfd.updatedAt).toLocaleString()}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFDView;


// src/components/RFDView.jsx
import { FiUser, FiUsers, FiAward, FiCalendar } from 'react-icons/fi';
import { BiTrophy } from 'react-icons/bi';

const RFDView = ({ rfd }) => {
  if (!rfd) return null;

  return (
    <div className="space-y-6">
      {/* Tournament and Round Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <BiTrophy className="mt-1 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Tournament</p>
              <p className="font-medium text-gray-900">{rfd.tournament}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FiAward className="mt-1 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Round</p>
              <p className="font-medium text-gray-900">{rfd.round}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams and Result Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <FiUsers className="mt-1 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Team</p>
              <p className="font-medium text-gray-900">{rfd.team}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FiUsers className="mt-1 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Opponent</p>
              <p className="font-medium text-gray-900">{rfd.opponent}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FiAward className="mt-1 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Result</p>
              <p className={`font-medium ${
                rfd.result === 'win' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {rfd.result.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Judge Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <FiUser className="mt-1 text-indigo-500" />
          <div>
            <p className="text-sm text-gray-500">Judge</p>
            <p className="font-medium text-gray-900">{rfd.judge}</p>
          </div>
        </div>
      </div>

      {/* Feedback Sections */}
      <div className="space-y-6">
        {/* General Feedback */}
        <section className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">General Feedback</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{rfd.feedback}</p>
        </section>

        {/* Strong Arguments */}
        <section className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Strong Arguments</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{rfd.strongArguments}</p>
        </section>

        {/* Areas to Work On */}
        <section className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Areas to Work On</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{rfd.areasToWork}</p>
        </section>

        {/* Judge Notes */}
        {rfd.judgeNotes && (
          <section className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Judge Notes</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{rfd.judgeNotes}</p>
          </section>
        )}
      </div>

      {/* Timestamp Information */}
      <div className="text-sm text-gray-500 flex items-center space-x-4 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-400" />
          <span>Created: {new Date(rfd.createdAt).toLocaleString()}</span>
        </div>
        {rfd.updatedAt && rfd.updatedAt !== rfd.createdAt && (
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-400" />
            <span>Updated: {new Date(rfd.updatedAt).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFDView;
