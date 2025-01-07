import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase/config';
import Webcam from 'react-webcam';

function Dashboard() {
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);
  const [flows, setFlows] = useState([]);
  
  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      // Convert base64 to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Create unique filename
      const filename = `flows/${user.uid}/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);

      // Upload to Firebase Storage
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save flow data to Firestore through API
      const flowData = {
        userId: user.uid,
        title: `Flow ${flows.length + 1}`,
        imageUrl: downloadURL,
        tags: ['debate'],
        metadata: {
          round: '1',
          tournament: 'Sample Tournament',
          opponent: 'Team A'
        }
      };

      const apiResponse = await fetch('/api/flows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(flowData),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to save flow data');
      }

      const newFlow = await apiResponse.json();
      setFlows([...flows, { ...flowData, id: newFlow.id }]);
      setShowCamera(false);
    } catch (error) {
      console.error('Error uploading flow:', error);
      alert('Failed to upload flow');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Flows</h1>
        <button
          onClick={() => setShowCamera(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload New Flow
        </button>
      </div>

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Capture Flow</h2>
              <button
                onClick={() => setShowCamera(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              onUserMedia={() => console.log('Camera ready')}
              className="w-full"
            />
            <button
              onClick={() => handleCapture()}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Capture
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <div key={flow.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={flow.image} alt={flow.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{flow.title}</h3>
              <p className="text-gray-600 text-sm">
                {new Date(flow.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;