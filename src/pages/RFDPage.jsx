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

  // Fetch RFDs
  const fetchRFDs = async () => {
    try {
      setIsLoading(true);
      const fetchedRFDs = await getRFDs(filters);
      setRfds(fetchedRFDs);
    } catch (error) {
      console.error('Error fetching RFDs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRFDs();
  }, [filters]); // Re-fetch when filters change


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
        updatedRFD = await uploadRFD(rfdData);
        
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

  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Quarter Finals', 'Semi Finals', 'Finals'];

  return (
    <div className="container mx-auto px-4 py-8">
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

      <RFDFilterBar 
        filters={filters}
        setFilters={setFilters}
        rounds={rounds}
      />

    <RFDList 
        rfds={rfds}
        onView={(rfd) => {
          setSelectedRFD(rfd);
          setIsViewModalOpen(true);
        }}
        onEdit={handleEdit}
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


