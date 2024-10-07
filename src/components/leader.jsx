import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './leader.css';

export default function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // State to hold API data
  const [loading, setLoading] = useState(true); // State to show loading
  const [error, setError] = useState(null); // State to show error message
  const itemsPerPage = 10; // Number of items per page

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
      
        const response = await axios.get('fetch_allprofile', {
          baseURL: 'http://172.16.10.141:8080/', // Set the base URL here
        });
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search bar
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting logic (only for total, easy, medium, and hard)
  const handleSort = (key) => {
    if (!['total', 'easy', 'medium', 'hard'].includes(key)) return; // Only sort on these fields

    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort data based on the selected column and direction
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

  // Filter data based on the search term (case insensitive)
  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Next and Previous Page Handlers
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

  // Render arrow icon based on sort direction
  const renderArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <header className='bg-zinc-600 border-black mt-0 px-4'>
        <div>
          <h3 className='py-4 text-xl text-white font-semibold'>Gehu Leetcode</h3>
        </div>
      </header>
      <section className='leader text-white py-6 bg-[#1F2120ff]'>

        <h1 className='text-center text-4xl font-bold py-6'>Leaderboard</h1>

        <div className='flex justify-start ml-6'>
          <input
            className={`border-2 py-1 px-2 rounded-xl text-black`}
            type="text"
            placeholder='Search name'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className='ml-2 py-1 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none'>
            Search
          </button>
        </div>

        <section className={`border-2 my-6 md:mx-6 mx-2 border-black`}>
          <section className={`border-b-2 flex justify-around border-black bg-zinc-600`}>
            {['SNO.', 'Name', 'Total', 'Easy', 'Medium', 'Hard', 'Mentor'].map((heading, index) => (
              <div
                key={index}
                className={`w-full text-center border-l border-black `}
                onClick={heading !== 'SNO.' && heading !== 'Name' ? () => handleSort(heading.toLowerCase()) : undefined}
              >
                <h4 className='md:text-xl text-sm font-semibold py-4'>
                  {heading} {renderArrow(heading.toLowerCase())}
                </h4>
              </div>
            ))}
          </section>

          {/* Data rows (only show currentData based on pagination) */}
          {currentData.map((item, index) => (
            <section key={index} className={`
              border-black
              border-b flex justify-around
              ${index % 2 === 0 ? 'bg-[#767877ff]' : 'bg-[#464747ff]'}
            `}>
              <div className='w-full text-center'>
                <ul className='list-none'>
                  <li className='md:py-4 md:text-base text-sm py-2'>{item.sno}</li>
                </ul>
              </div>
              <div className={`w-full text-center border-l-2 border-black `}>
                <ul className='list-none'>
                  <li className='md:py-4 py-2 md:text-base text-sm'>
                    <Link to="/profile" state={{ name: item.name }} className={`hover:underline`}>
                      {item.name}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={`w-full text-center border-l-2 border-black `}>
                <ul className='list-none'>
                  <li className='md:py-4 py-2 md:text-base text-sm'>{item.total}</li>
                </ul>
              </div>
              <div className={`w-full text-center border-l-2 border-black `}>
                <ul className='list-none'>
                  <li className='md:py-4 py-2 md:text-base text-sm text-green-500 font-extrabold' >{item.easy}</li>
                </ul>
              </div>
              <div className={`w-full text-center border-l-2 border-black`}>
                <ul className='list-none'>
                  <li className='md:py-4 py-2 md:text-base text-sm text-yellow-500 font-extrabold'>{item.medium}</li>
                </ul>
              </div>
              <div className={`w-full text-center border-l-2 border-black `}>
                <ul className='list-none'>
                  <li className='md:py-4 py-2 md:text-base text-sm text-red-500 font-extrabold'>{item.hard}</li>
                </ul>
              </div>
              <div className={`w-full text-center border-l-2 border-black`}>
                <ul className='list-none'>
                  <li className='py-4 md:text-base text-sm'>{item.mentor}</li>
                </ul>
              </div>
            </section>
          ))}
        </section>

        {/* Pagination controls */}
        <div className='flex justify-center py-4'>
          <button
            className='mx-2 px-4 py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-400'
            onClick={prevPage}
            disabled={currentPage === 1} // Disable Previous if on first page
          >
            Previous
          </button>
          <button
            className='mx-2 px-4 py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-400'
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)} // Disable Next if on last page
          >
            Next
          </button>
        </div>

      </section>
    </>
  );
}
