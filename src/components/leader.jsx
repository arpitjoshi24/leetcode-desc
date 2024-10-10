import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './leader.css';

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // New state for selected pass year
  const [selectedYear, setSelectedYear] = useState(null); // Default pass_year

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('fetch_allprofile', {
          baseURL: 'https://leetcode-repo.onrender.com/',
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    if (!['total', 'easy', 'medium', 'hard'].includes(key)) return;
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
  
    // Determine the pass_year based on selected option
    switch (year) {
      case 'all':
        setSelectedYear(null); // Set to null to indicate all years
        break;
      case '1 year':
        setSelectedYear(2028);
        break;
      case '2 year':
        setSelectedYear(2027);
        break;
      case '3 year':
        setSelectedYear(2026);
        break;
      case '4 year':
        setSelectedYear(2025);
        break;
      default:
        setSelectedYear(null); // Reset to default if needed
        break;
    }
  };
  

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key === null) {
      return 0;
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedYear === null || item.pass_year === selectedYear)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  const getBadge = (position) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <header className='bg-gradient-to-r from-purple-600 to-blue-500 border-b border-gray-300 shadow-lg'>
        <div className="container mx-auto p-4">
          <Link to="/">
            <h3 className='text-2xl text-white font-bold'>Gehu Leetcode</h3>
          </Link>
        </div>
      </header>
      <section className='leader bg-gray-800 text-white py-8'>
        <div className="container mx-auto">
          <h1 className='text-center text-5xl font-extrabold py-6'>Leaderboard</h1>

          <div className='flex justify-center gap-2 md:justify-between md:mx-6 mx-4 mb-4'>
            <input
              className={`border-2 border-purple-500 py-2 px-4 rounded-md text-black focus:outline-none focus:ring focus:ring-purple-300`}
              type="text"
              placeholder='Search by name'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select name="filter" className='text-black border-2 border-purple-500 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-purple-300' onChange={handleYearChange}>
              <option value="all">All year</option>
              <option value="1 year">1 year</option>
              <option value="2 year">2 year</option>
              <option value="3 year">3 year</option>
              <option value="4 year">4 year</option>
            </select>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto my-6">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-purple-600">
                <tr>
                  {['Rank', 'Name', 'Username', 'Total', 'Easy', 'Medium', 'Hard', 'Mentor'].map((heading, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 text-lg font-semibold py-3 px-4 text-center cursor-pointer text-purple-200 hover:bg-purple-600"
                      onClick={heading !== 'Rank' && heading !== 'Name' ? () => handleSort(heading.toLowerCase()) : undefined}
                    >
                      {heading} {renderArrow(heading.toLowerCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => {
                  const actualRank = sortedData.findIndex(i => i.username === item.username) + 1;
                  const sno = actualRank <= 3 ? getBadge(actualRank) : actualRank;

                  return (
                    <tr key={item.username} className={`${actualRank % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'} transition duration-200 hover:bg-gray-500`}>
                      <td className="border border-gray-300 text-center py-2 px-4">{sno}</td>
                      <td className="border border-gray-300 text-center py-2 px-4">{item.name}</td>
                      <td className="border border-gray-300 text-center py-2 px-4">
                        <Link to="/profile" state={{ name: item.username }} className="text-purple-300 hover:underline">
                          {item.username}
                        </Link>
                      </td>
                      <td className="border border-gray-300 text-center py-2 px-4">{item.total}</td>
                      <td className="border border-gray-300 text-center py-2 px-4 text-green-400 font-bold">{item.easy}</td>
                      <td className="border border-gray-300 text-center py-2 px-4 text-yellow-400 font-bold">{item.medium}</td>
                      <td className="border border-gray-300 text-center py-2 px-4 text-red-400 font-bold">{item.hard}</td>
                      <td className="border border-gray-300 text-center py-2 px-4">{item.mentor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className='flex justify-center py-4'>
            <button
              className='mx-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition'
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className='mx-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition'
              onClick={nextPage}
              disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
