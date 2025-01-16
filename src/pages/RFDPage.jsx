// src/pages/RFDPage.jsx
import { useState, useEffect } from 'react';
import RFDUpload from '../components/RFDUpload';
import RFDFilterBar from '../components/RFDFilterBar';
import RFDList from '../components/RFDList';
import { uploadRFD, updateRFD } from '../lib/firebase/rfd';
import RFDView from '../components/RFDView';
import Modal from '../components/Modal';
import { FiPlus } from 'react-icons/fi';
import { getRFDs } from '../lib/firebase/rfd';
import { deleteRFD } from '../lib/firebase/rfd';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase/config';

const RFDPage = () => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    tournament: '',
    round: '',
    team: '',
    judge: '',
    result: ''
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedRFD, setSelectedRFD] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rfds, setRfds] = useState([]);
  const [error, setError] = useState(null);
  

  const currentUser= auth.currentUser;

  // Fetch RFDs
  const fetchRFDs = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const fetchedRFDs = await getRFDs(filters, currentUser.uid);
      setRfds(fetchedRFDs);
    } catch (error) {
      console.error('Error fetching RFDs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRFDs();
  }, [currentUser, filters]); // Re-fetch when filters change

  // const handleFilterChange = async (newFilters) => { 
  //     setIsLoading(true);
  //     try {
  //       const filteredRFDs = await getRFDs(currentUser.uid, newFilters);
  //       setRfds(filteredRFDs);
  //     } catch (error) { 
  //       console.error('Error filtering flows:', error);
  //       alert('Failed to filter flows'); 
  //     } finally {  
  //       setIsLoading(false); 
  //     }
  //   };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  

const handleRFDSubmit = async (rfdData) => {
    try {
      let updatedRFD;
      
      if (selectedRFD?.id) {
        // Updating existing RFD
        updatedRFD = await updateRFD(selectedRFD.id, rfdData);
        
        // Update the RFD in the local state
        setRfds(currentRfds => 
          currentRfds.map(rfd => 
            rfd.id === selectedRFD.id ? updatedRFD : rfd
          )
        );
      } else {
        // Creating new RFD
        updatedRFD = await uploadRFD(rfdData, currentUser.uid);
        
        // Add the new RFD to the beginning of the list
        setRfds(currentRfds => [updatedRFD, ...currentRfds]);
      }

      // Close the modal and reset selected RFD
      setIsUploadModalOpen(false);
      setSelectedRFD(null);
    } catch (error) {
      console.error('Error handling RFD:', error);
      throw error; // Propagate error to RFDUpload component
    }
  };

  const handleEdit = (rfd) => {
    setSelectedRFD(rfd);
    setIsUploadModalOpen(true);
  };

  const handleDelete = async (rfdId) => {
    {
        (window.confirm('Are you sure you want to delete this RFD?'))
        try {
        // Delete the RFD
        await deleteRFD(rfdId);

        // Update the local state by removing the deleted RFD
        setRfds(currentRfds => currentRfds.filter(rfd => rfd.id !== rfdId));
        } catch (error) {
        console.error('Error deleting RFD:', error);
        }}
  };

  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Quarter Finals', 'Semi Finals', 'Finals'];

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold mb-4">RFD Management</h1>
      <button
           onClick={() => {
            setSelectedRFD(null); // Ensure we're in "create" mode
            setIsUploadModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <FiPlus className="mr-2" />
          Add New RFD
        </button>
          </div>
      <RFDFilterBar onFilterChange={handleFilterChange}  />

    <RFDList 
        rfds={rfds}
        onView={(rfd) => {
          setSelectedRFD(rfd);
          setIsViewModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Upload Modal */}
        <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedRFD(null);
        }}
        title={selectedRFD ? "Edit RFD" : "Add New RFD"}
        >
        <RFDUpload
          key={selectedRFD ? selectedRFD.id : 'new'}
          onSubmit={handleRFDSubmit}
          initialData={selectedRFD}
          onClose={() => {
            setIsUploadModalOpen(false);
            setSelectedRFD(null);
          }}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedRFD(null);
        }}
        title="View RFD Details"
      >
        <RFDView rfd={selectedRFD} />
      </Modal>
    </div>
  );
};

export default RFDPage;



