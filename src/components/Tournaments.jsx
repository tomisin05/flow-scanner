import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuth } from '../contexts/AuthContext';
import FlowUpload from '../components/FlowUpload';
import EditTournamentModal from './EditTournamentModal';
import { Timestamp } from 'firebase/firestore';
import { getDocument, updateDocument } from '../lib/firebase/db-operations';
import { updateTournament, deleteTournament } from '../lib/firebase/tournaments';

export default function Tournaments() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [newTournament, setNewTournament] = useState({
    name: '',
    date: new Date(),
    location: '',
    description: ''
  });

  // Fetch ALL tournaments, not just user's tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        const tournamentsRef = collection(db, 'tournaments');
        // Remove the where clause to get all tournaments
        const querySnapshot = await getDocs(tournamentsRef);
        const tournamentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort tournaments by date string
        tournamentsData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTournaments(tournamentsData);
        console.log('Tournaments Data: ', tournamentsData)
      } catch (err) {
        setError('Error fetching tournaments');
        console.error('Error fetching tournaments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [user]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    
    if (!user?.uid) {
      setError('You must be logged in to create a tournament');
      return;
    }

    if (!newTournament.name || !newTournament.date || !newTournament.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
        // Format date as string (YYYY-MM-DD)
      const dateString = new Date(newTournament.date)
        .toISOString()
        .split('T')[0];

      const tournamentData = {
        name: newTournament.name.trim(),
        date: dateString,
        location: newTournament.location.trim(),
        description: newTournament.description?.trim() || '',
        flows: [],
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true
      };

      const docRef = await addDoc(collection(db, 'tournaments'), tournamentData);
      
      setTournaments(prev => [...prev, { 
        id: docRef.id, 
        ...tournamentData 
      }]);
      
      setShowCreateForm(false);
      setNewTournament({
        name: '',
        date: '',
        location: '',
        description: ''
      });
      
      alert('Tournament created successfully!');
    } catch (err) {
      setError('Error creating tournament: ' + err.message);
      console.error('Error creating tournament:', err);
    }
  };

  const handleEdit = async (tournamentId, updates) => {
    try {
        const updatedTournament = await updateTournament(tournamentId, updates, user.uid);
        console.log('Tournament updated successfully:', updatedTournament);
        // Update local state
        setTournaments(prevTournaments => 
        prevTournaments.map(tournament => 
            tournament.id === tournamentId ? updatedTournament : tournament
        )
        );
        alert('Tournament updated successfully!');
    } catch (error) {
        console.error('Error updating tournament:', error);
        alert(error.message);
    }
    };


  const handleDelete = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) {
      return;
    }

    try {
      await deleteTournament(tournamentId, user.uid);
      setTournaments(prev => prev.filter(t => t.id !== tournamentId));
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'No date set';
      
      const date = new Date(dateString);
      if (isNaN(date)) { 
        return 'Invalid date';
      } 
    // Add one day
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1); 
 
    return adjustedDate.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    } catch (error) {
      console.error('Error formatting date:', error); 
      return 'Error formatting date';
    } 
  };

 
  return (
    <div className="container mx-auto px-4 py-8">
    {error && ( 
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    )} 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tournaments</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Create Tournament'}
        </button> 
      </div>

      {/* {error && ( 
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )} */}

      {showCreateForm && (
        <form onSubmit={handleCreateTournament} className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow">
          <div> 
            <label className="block text-sm font-medium text-gray-700">Tournament Name</label>
            <input
              type="text"
              value={newTournament.name}
              onChange={(e) => setNewTournament({...newTournament, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required 
            />
          </div>
          <div> 
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={newTournament.date} 
              onChange={(e) => setNewTournament({...newTournament, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newTournament.location}
              onChange={(e) => setNewTournament({...newTournament, location: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTournament.description}
              onChange={(e) => setNewTournament({...newTournament, description: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

      {loading ? (
        <div className="text-center py-4">Loading tournaments...</div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-4">No tournaments found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map(tournament => (
            <div
              key={tournament.id}
              className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
              <p className="text-gray-600 mb-2">
                Date: {formatDate(tournament.date)}
              </p>
              <p className="text-gray-600 mb-2">Location: {tournament.location}</p>
              {tournament.description && (
                <p className="text-gray-600 mb-4">{tournament.description}</p>
              )}

              {tournament.createdBy === user.uid && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setEditingTournament(tournament)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tournament.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            )}

            {editingTournament && (
                    <EditTournamentModal
                    tournament={editingTournament}
                    onClose={() => setEditingTournament(null)}
                    onSave={handleEdit}
                    />
                )}


              
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
              
              {selectedTournament?.id === tournament.id && (
                <div className="mt-4 pt-4 border-t">
                  <FlowUpload
                    userId={user.uid}
                    tournamentId={tournament.id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}