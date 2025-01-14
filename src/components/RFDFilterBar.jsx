// src/components/RFDFilterBar.jsx
import { FiCalendar, FiAward, FiUsers, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BiTrophy } from 'react-icons/bi'
import { useState } from 'react';


const RFDFilterBar = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const rounds = ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Round 6', 'Round 7', 'Round 8', 'Doubles',  'Octas', 'Quarters', 'Semis', 'Finals'];

  return (
    <div className="bg-white p-2 rounded-lg shadow mb-4">
      <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-4">
          {/* Tournament Filter */}
          <div className="flex items-center space-x-2">
            <BiTrophy className="text-indigo-500" />
            <input
              type="text"
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tournament"
              value={filters.tournament}
              onChange={(e) => handleFilterChange('tournament', e.target.value)}
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-indigo-500" />
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
            <span>-</span>
            <input
              type="date"
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          {/* Team Filter */}
          <div className="flex items-center space-x-2">
            <FiUsers className="text-indigo-500" />
            <input
              type="text"
              className="px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Team"
              value={filters.team}
              onChange={(e) => handleFilterChange('team', e.target.value)}
            />
          </div>

          {/* Judge Filter */}
          <div className="flex items-center space-x-2">
            <FiUser className="text-indigo-500" />
            <input
              type="text"
              className="px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Judge"
              value={filters.judge}
              onChange={(e) => handleFilterChange('judge', e.target.value)}
            />
          </div>

          {/* Result Filter */}
          <div className="flex items-center space-x-2">
            <FiAward className="text-indigo-500" />
            <select
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.result}
              onChange={(e) => handleFilterChange('result', e.target.value)}
            >
              <option value="">All Results</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </select>
          </div>

          {/* Round Filter */}
          <div className="flex items-center space-x-2">
            <FiAward className="text-indigo-500" />
            <select
              className="px-2 py-1 border border-gray-300 rounded-md"
              value={filters.round}
              onChange={(e) => handleFilterChange('round', e.target.value)}
            >
              <option value="">All Rounds</option>
              {rounds.map((round) => (
                <option key={round} value={round}>{round}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center">
            <button
              onClick={() => {
                setFilters({
                  dateFrom: '',
                  dateTo: '',
                  tournament: '',
                  team: '',
                  judge: '',
                  round: '',
                  result: ''
                });
              }}
              className="px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFDFilterBar;