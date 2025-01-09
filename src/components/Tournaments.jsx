// src/components/Tournaments.jsx
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import FlowUpload from './FlowUpload';
import { createTournament } from '../lib/firebase/tournaments';

export default function Tournaments({ userId }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '', 
    date: '',
    location: '',
    description: '' 
  });

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const tournamentsRef = collection(db, 'tournaments');
        const q = query(
          tournamentsRef,
          where('participants', 'array-contains', userId)
        );
        const querySnapshot = await getDocs(q);
        const tournamentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTournaments(tournamentsData);
      } catch (err) {
        setError('Error fetching tournaments');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTournaments();
    }
  }, [userId]);

  // Handle tournament creation
  const handleCreateTournament = async (e) => {
    e.preventDefault();
    try {
      const tournamentData = {
        ...newTournament,
        userId
      };
      const createdTournament = await createTournament(tournamentData);
      setTournaments([...tournaments, createdTournament]);
      setShowCreateForm(false);
      setNewTournament({
        name: '',
        date: '',
        location: '',
        description: ''
      });
    } catch (err) {
      setError('Error creating tournament');
      console.error('Error creating tournament:', err);
    }
  };

  if (loading) {
    return <div>Loading tournaments...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Tournament'}
        </button>
      </div>

      {/* Create Tournament Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateTournament} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tournament Name</label>
            <input
              type="text"
              value={newTournament.name}
              onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newTournament.date}
              onChange={(e) => setNewTournament({...newTournament, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newTournament.location}
              onChange={(e) => setNewTournament({...newTournament, location: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTournament.description}
              onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Tournament
          </button>
        </form>
      )}

      {/* Tournaments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map(tournament => (
          <div
            key={tournament.id}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
            <p className="text-gray-600 mb-2">
              Date: {new Date(tournament.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-2">Location: {tournament.location}</p>
            {tournament.description && (
              <p className="text-gray-600 mb-4">{tournament.description}</p>
            )}
            
            {/* Tournament Actions */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setSelectedTournament(
                  selectedTournament?.id === tournament.id ? null : tournament
                )}
                className="text-blue-500 hover:text-blue-700"
              >
                {selectedTournament?.id === tournament.id ? 'Hide Upload' : 'Upload Flow'}
              </button>
              <span className="text-sm text-gray-500">
                {tournament.flows?.length || 0} flows
              </span>
            </div>

            {/* Flow Upload Section */}
            {selectedTournament?.id === tournament.id && (
              <div className="mt-4 pt-4 border-t">
                <FlowUpload
                  userId={userId}
                  tournamentId={tournament.id}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Tournaments Message */}
      {tournaments.length === 0 && !showCreateForm && (
        <div className="text-center text-gray-500 mt-8">
          No tournaments found. Create one to get started!
        </div>
      )}
    </div>
  );
}
