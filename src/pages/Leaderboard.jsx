import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';;

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    };

    fetchLeaderboardData();
  }, []);
  
  const calculateCO2Saved = (sheets) => {
    return (sheets * 0.006).toFixed(2); // kg of CO2 saved
  };
 
  return (
    <div> 
      <h1 className="text-3xl font-bold mb-8">Environmental Impact Leaderboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Total Community Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {users.reduce((sum, user) => sum + user.sheetsScanned, 0)}
            </p>
            <p className="text-gray-600">Sheets of Paper Saved</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {users.reduce((sum, user) => sum + user.treesPreserved, 0).toFixed(1)}
            </p>
            <p className="text-gray-600">Trees Preserved</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {calculateCO2Saved(users.reduce((sum, user) => sum + user.sheetsScanned, 0))}
            </p>
            <p className="text-gray-600">kg CO2 Prevented</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sheets Saved
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trees Preserved
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CO2 Prevented (kg)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.sheetsScanned}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.treesPreserved}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {calculateCO2Saved(user.sheetsScanned)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;