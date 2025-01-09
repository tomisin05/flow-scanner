// // src/components/FlowUpload.jsx
// import { useState } from 'react';
// import { uploadFlow } from '../lib/firebase/flows';

// export default function FlowUpload({ userId, tournamentId }) {
//   const [file, setFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [metadata, setMetadata] = useState({
//     title: '',
//     tournament: tournamentId || '',
//     round: '',
//     team: '',
//     tags: [],
//     pageCount: 1
//   });

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (validateFile(selectedFile)) {
//         setFile(selectedFile);
//         setError(null);
//       }
//     }
//   };

//   const validateFile = (file) => {
//     const MAX_SIZE = 5 * 1024 * 1024; // 5MB
//     const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

//     if (file.size > MAX_SIZE) {
//       setError('File size must be less than 5MB');
//       return false;
//     }
//     if (!ALLOWED_TYPES.includes(file.type)) {
//       setError('Only PDF and Word documents are allowed');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file || !metadata.title) {
//       setError('Please select a file and enter a title');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await uploadFlow(file, metadata, userId);
//       // Handle successful upload (e.g., show success message, redirect)
//       console.log('Upload successful:', result);
//       // Reset form
//       setFile(null);
//       setMetadata({
//         title: '',
//         tournament: tournamentId || '',
//         round: '',
//         team: '',
//         tags: [],
//         pageCount: 1
//       });
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Upload Flow
//         </label>
//         <input
//           type="file"
//           onChange={handleFileChange}
//           accept=".pdf,.doc,.docx"
//           className="mt-1 block w-full"
//           disabled={isLoading}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Title
//         </label>
//         <input
//           type="text"
//           value={metadata.title}
//           onChange={(e) => setMetadata({...metadata, title: e.target.value})}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//           disabled={isLoading}
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Round
//         </label>
//         <input
//           type="text"
//           value={metadata.round}
//           onChange={(e) => setMetadata({...metadata, round: e.target.value})}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//           disabled={isLoading}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Team
//         </label>
//         <input
//           type="text"
//           value={metadata.team}
//           onChange={(e) => setMetadata({...metadata, team: e.target.value})}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//           disabled={isLoading}
//         />
//       </div>

//       {error && (
//         <div className="text-red-500 text-sm">
//           {error}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={isLoading || !file}
//         className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
//       >
//         {isLoading ? 'Uploading...' : 'Upload Flow'}
//       </button>
//     </form>
//   );
// }


// src/components/FlowUpload.jsx
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { uploadFlow } from '../lib/firebase/flows';
import { useAuth } from '../contexts/AuthContext';

function FlowUpload({ onSubmit }) {
  const { user } = useAuth();
  const [uploadMethod, setUploadMethod] = useState('file');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tournament: '',
    round: '',
    team: '',
    tags: []
  });
  const webcamRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleCapture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    // Convert base64 to blob
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    
    // Create file from blob
    const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setFile(capturedFile);
    setPreviewUrl(imageSrc);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file or capture an image');
      return;
    }

    setIsLoading(true);
    try {
      // Use the existing uploadFlow function
      const metadata = {
        ...formData,
        pageCount: 1, // Default to 1 for single image uploads
      };

      const flowData = await uploadFlow(file, metadata, user.uid);
      onSubmit(flowData);

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setFormData({
        title: '',
        tournament: '',
        round: '',
        team: '',
        tags: []
      });
    } catch (error) {
      console.error('Error uploading flow:', error);
      alert('Failed to upload flow: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Method Selection */}
      <div className="flex space-x-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 rounded ${
            uploadMethod === 'file' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('camera')}
          className={`px-4 py-2 rounded ${
            uploadMethod === 'camera' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Use Camera
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload or Camera Section */}
        <div className="mb-4">
          {uploadMethod === 'file' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <button
                type="button"
                onClick={handleCapture}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Capture Photo
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-lg mx-auto"
            />
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tournament
            </label>
            <input
              type="text"
              name="tournament"
              value={formData.tournament}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Round
            </label>
            <input
              type="text"
              name="round"
              value={formData.round}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team
            </label>
            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded text-white ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isLoading ? 'Uploading...' : 'Upload Flow'}
        </button>
      </form>
    </div>
  );
}

export default FlowUpload;
