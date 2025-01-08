// src/components/FlowUpload.jsx
import { useState } from 'react';
import { uploadFlow } from '../lib/firebase/flows';

export function FlowUpload({ userId, tournamentId }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    tournament: tournamentId || '',
    round: '',
    team: '',
    tags: [],
    pageCount: 1
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const validateFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (file.size > MAX_SIZE) {
      setError('File size must be less than 5MB');
      return false;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PDF and Word documents are allowed');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !metadata.title) {
      setError('Please select a file and enter a title');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await uploadFlow(file, metadata, userId);
      // Handle successful upload (e.g., show success message, redirect)
      console.log('Upload successful:', result);
      // Reset form
      setFile(null);
      setMetadata({
        title: '',
        tournament: tournamentId || '',
        round: '',
        team: '',
        tags: [],
        pageCount: 1
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Flow
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="mt-1 block w-full"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={metadata.title}
          onChange={(e) => setMetadata({...metadata, title: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Round
        </label>
        <input
          type="text"
          value={metadata.round}
          onChange={(e) => setMetadata({...metadata, round: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Team
        </label>
        <input
          type="text"
          value={metadata.team}
          onChange={(e) => setMetadata({...metadata, team: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !file}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? 'Uploading...' : 'Upload Flow'}
      </button>
    </form>
  );
}
