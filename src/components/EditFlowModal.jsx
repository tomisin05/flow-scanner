import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';


const EditFlowModal = ({ flow, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: flow.title || '',
      tournament: flow.tournament?.name || '',
      round: flow.round || '',
      team: flow.team || '',
      judge: flow.judge || '',
      division: flow.division || '',
      tags: flow.tags || [],
      customTag: '',
      userId: flow.userId
    });
  
    // Add predefined options
    const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Doubles',  'Octas', 'Quarters', 'Semis', 'Finals'];
    const divisions = ['Varsity', 'JV', 'Novice'];
    const commonTags = ['K', 'DA', 'CP', 'Case', 'Theory', 'T', 'Framework'];
  
    // State to track all available tags
  const [availableTags, setAvailableTags] = useState([...commonTags]);

  // Check for custom tags when component mounts
  useEffect(() => {
    if (flow.tags && Array.isArray(flow.tags)) {
      const customTags = flow.tags.filter(tag => !commonTags.includes(tag));
      if (customTags.length > 0) {
        // Add any custom tags from the flow to available tags
        setAvailableTags(prev => [...new Set([...prev, ...customTags])]);
      }
    }
  }, [flow.tags]);
  
    const handleInputChange = (name, value) => {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleTagChange = (tag) => {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter(t => t !== tag)
          : [...prev.tags, tag]
      }));
    };

    const handleAddCustomTag = (e) => {
        e.preventDefault();
        if (formData.customTag.trim() && !formData.tags.includes(formData.customTag.trim())) {
          const newTag = formData.customTag.trim();
          
          // Add to available tags if it's not already there
          if (!availableTags.includes(newTag)) {
            setAvailableTags(prev => [...prev, newTag]);
          }
    
          // Add to current flow's tags
          setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, newTag],
            customTag: '' // Clear input
          }));
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(flow.id, formData);
        onClose();
      };
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Flow</h2>
            <button onClick={onClose}>
              <FiX className="h-6 w-6" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Tournament */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tournament</label>
              <input
                type="text"
                value={formData.tournament}
                onChange={(e) => handleInputChange('tournament', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Round */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Round</label>
              <select
                value={formData.round}
                onChange={(e) => handleInputChange('round', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Round</option>
                {rounds.map((round) => (
                  <option key={round} value={round}>{round}</option>
                ))}
              </select>
            </div>
  
            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Team</label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Judge */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Judge</label>
              <input
                type="text"
                value={formData.judge}
                onChange={(e) => handleInputChange('judge', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
  
            {/* Division */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Division</label>
              <select
                value={formData.division}
                onChange={(e) => handleInputChange('division', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Division</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>


          {/* Tags Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            
            {/* Available Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagChange(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.tags.includes(tag)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.customTag}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customTag: e.target.value
                }))}
                placeholder="Add custom tag"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-blue-600"
              >
                Add Tag
              </button>
            </div>

            {/* Selected Tags Display */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Selected Tags:</p>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagChange(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
  
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
            </div>
          </form>
        </div>
      </div>
     
    );
  };

export default EditFlowModal; 


