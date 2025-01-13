import { useState, useEffect } from 'react';
import FlowUpload from '../components/FlowUpload';
import { useAuth } from '../contexts/AuthContext';
import FilterBar from '/src/components/FilterBar.jsx';
import FlowCard from '/src/components/FlowCard.jsx';
import { getFilteredFlows, updateFlow, deleteFlow  } from '../lib/firebase/flows';
import EditFlowModal from '../components/EditFlowModal';
import { updateUserStats } from '../lib/firebase/users';

function Dashboard() {
    const { user } = useAuth();
    const [flows, setFlows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingFlow, setEditingFlow] = useState(null);
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
      // Close modal after successful upload
      try {
        // Update UI
        setFlows(prevFlows => [...prevFlows, flowData]);
        setShowUploadModal(false);
        alert('Flow uploaded successfully!');
        // window.location.reload();
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

 
  // Add delete handler
  const handleDeleteFlow = async (flowId) => { 
    try { 
      await deleteFlow(flowId, user.uid); 
 
      await updateUserStats(user.uid);    
      setFlows(flows.filter(flow => flow.id !== flowId));
      alert('Flow deleted successfully');
    } catch (error) { 
      console.error('Error deleting flow:', error); 
      alert('Failed to delete flow'); 
    }
  };

  // Add edit handler
  const handleEditFlow = async (flowId, updates) => {
    try {
        const formattedUpdates = {
            ...updates,
            tournament: {
              name: updates.tournament
            },
            userId: user.uid 
          };
          
          // Log the flowId and updates for debugging
          console.log('Updating flow:', flowId, formattedUpdates);
        
          await updateFlow(flowId, formattedUpdates, user.uid);
          // Refresh flows to get updated data
          const updatedFlows = await getFilteredFlows(user.uid, filters);
          setFlows(updatedFlows);
          alert('Flow updated successfully');
          } catch (error) {
          console.error('Error updating flow:', error);
          alert('Failed to update flow');
        }
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
                  <FlowUpload 
                  userId={user.uid}
                  onSubmit={handleFlowSubmit} />
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
            <FlowCard 
            key={flow.id} 
            flow={flow} 
            onDelete={handleDeleteFlow}
            onEdit={() => setEditingFlow(flow)}
            />
          ))}
        </div>
      )}
        {/* Add EditFlowModal */}
        {editingFlow && (
            <EditFlowModal
            flow={editingFlow}
            onClose={() => setEditingFlow(null)}
            onSave={handleEditFlow}
            />
      )}
    </div>
  );
}

export default Dashboard;