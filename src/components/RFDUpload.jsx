import { useState,useEffect } from 'react';
import { uploadRFD } from '../lib/firebase/rfd'; // You'll need to create this

function RFDUpload({ onSubmit, initialData, onClose }) {
  const [rfdData, setRfdData] = useState(() => ({
    team: initialData?.team || '',
    judge: initialData?.judge || '',
    result: initialData?.result || '',
    feedback: initialData?.feedback || '',
    improvements: initialData?.improvements || '',
    strongArguments: initialData?.strongArguments || '',
    areasToWork: initialData?.areasToWork || '',
    judgeNotes: initialData?.judgeNotes || '',
    round: initialData?.round || '',
    tournament: initialData?.tournament || ''
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Doubles',  'Octas', 'Quarters', 'Semis', 'Finals'];


//   useEffect(() => {
//     if (initialData) {
//       const newData = {
//         team: initialData?.team || '',
//         judge: initialData?.judge || '',
//         result: initialData?.result || '',
//         feedback: initialData?.feedback || '',
//         improvements: initialData?.improvements || '',
//         strongArguments: initialData?.strongArguments || '',
//         areasToWork: initialData?.areasToWork || '',
//         judgeNotes: initialData?.judgeNotes || '',
//         round: initialData?.round || '',
//         tournament: initialData?.tournament || ''
//       };
//       // Only update if the data is different
//       if (JSON.stringify(newData) !== JSON.stringify(rfdData)) {
//         setRfdData(newData);
//       }
//     }
//   }, [rfdData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...rfdData,
        ...(initialData?.id && { id: initialData.id })
      });
      onClose();
      // Clear form after successful submission
      setRfdData({
        team: '',
        judge: '',
        result: '',
        feedback: '',
        improvements: '',
        strongArguments: '',
        areasToWork: '',
        judgeNotes: ''
      });
    } catch (err) {
      setError('Failed to upload RFD: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (field, value) => {
    setRfdData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Upload RFD/Judge Feedback</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">

      {/* Tournament Field */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tournament
          </label>
          <input
            type="text"
            value={rfdData.tournament}
            onChange={(e) => handleInputChange('tournament', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
        {/* Team Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team
            </label>
            <input
              type="text"
              value={rfdData.team}
              onChange={(e) => handleInputChange('team', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

        {/* Round Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Round
          </label>
          <select
            value={rfdData.round}
            onChange={(e) => handleInputChange('round', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
             <option value="">Select Round</option>
            {rounds.map((round) => (
              <option key={round} value={round}>{round}</option>
            ))}
          </select>
        </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Opponent
            </label>
            <input
              type="text"
              value={rfdData.opponent}
              onChange={(e) => setRfdData({...rfdData, opponent: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div> */}
        </div>

        {/* Judge and Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Judge
            </label>
            <input
              type="text"
              value={rfdData.judge}
              onChange={(e) => handleInputChange('judge', e.target.value) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Result
            </label>
            <select
              value={rfdData.result}
              onChange={(e) => handleInputChange('result', e.target.value) }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Result</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            General Feedback
          </label>
          <textarea
            value={rfdData.feedback}
            onChange={(e) => handleInputChange('feedback', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Suggested Improvements
          </label>
          <textarea
            value={rfdData.improvements}
            onChange={(e) => handleInputChange('improvements', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Strong Arguments
          </label>
          <textarea
            value={rfdData.strongArguments}
            onChange={(e) => handleInputChange('strongArguments', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Areas to Work On
          </label>
          <textarea
            value={rfdData.areasToWork}
            onChange={(e) => handleInputChange('areasToWork', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Judge Notes
          </label>
          <textarea
            value={rfdData.judgeNotes}
            onChange={(e) => handleInputChange('judgeNotes', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Uploading...' : 'Submit RFD'}
        </button>
      </form>
    </div>
  );
}

export default RFDUpload;
