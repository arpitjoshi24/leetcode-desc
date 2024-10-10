import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Profile() {
  const location = useLocation();
  const { name } = location.state || { name: 'user' }; // Default name if not provided

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!name) {
        setError('No username provided.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`https://leetcode-repo.onrender.com/fetch_profile?endpoint=${name}`);
        console.log(response.data);
        setProfileData(response.data.data);
      } catch (error) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [name]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Show error message
  }

  if (!profileData) {
    return <div className="text-center text-gray-500">No profile data found.</div>;
  }

  const { sname, easy_total_qs, hard_total_qs, medium_total_qs, total_qs, username, advance, fundamental, intermediate } = profileData;

  // Safe JSON parsing
  const parseJSONSafely = (data) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch {
      return {};
    }
  };

  const advanceQuestions = parseJSONSafely(advance);
  const fundamentalQuestions = parseJSONSafely(fundamental);
  const intermediateQuestions = parseJSONSafely(intermediate);

  // Data for the bar chart
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [40, 20, 12, 8],
        backgroundColor: [
          'rgba(153, 50, 204, 0.8)', // Week 1
          'rgba(0, 128, 0, 0.8)', // Week 2
          'rgba(255, 215, 0, 0.8)', // Week 3
          'rgba(255, 0, 0, 0.8)', // Week 4
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)', // White border around bars
        borderWidth: 2, // Width of the border
        borderRadius: 8, // Rounded corners for the bars
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false, // Hide the legend if the dataset label is not needed
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Tooltip background color
        titleColor: 'rgba(75, 30, 133, 1)', // Tooltip title color
        bodyColor: 'rgba(0, 0, 0, 0.8)', // Tooltip body color
        borderColor: 'rgba(75, 30, 133, 1)', // Tooltip border color
        borderWidth: 1, // Tooltip border width
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 45,
        ticks: {
          stepSize: 5,
          color: 'white', // Tick color
          font: {
            size: 12, // Tick font size
          },
        },
        grid: {
          color: '#475569', // Color of vertical grid lines
        },
      },
      x: {
        ticks: {
          color: 'white', // Label color for x-axis
          font: {
            size: 12, // X-axis label font size
          },
        },
        grid: {
          display: false, // Hide horizontal grid lines if not needed
        },
      },
    },
  };

  return (
    <>
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 py-4 shadow-md">
        <div className="container mx-auto">
          <Link to="/">
            <h3 className="text-white text-2xl font-bold text-center">Gehu Leetcode</h3>
          </Link>
        </div>
      </header>

      <section className="bg-gray-900 text-white py-8">
        <h1 className="text-center text-5xl font-extrabold py-6">Student Data</h1>
        <div className="flex flex-col md:flex-row justify-center items-center container mx-auto py-8 gap-8">
          <div className="flex justify-center">
            <img
              className="rounded-full object-cover w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 border-4 border-indigo-500 shadow-lg"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Profile"
            />
          </div>
          <div className="text-center sm:text-left space-y-4">
            <h2 className="text-3xl font-semibold">{sname}</h2>
            <p className="text-lg">Username: <span className="text-purple-300">{username}</span></p>
            <p className="text-lg">Leetcode Rating: <span className="text-green-400">1550/1567</span></p>
            <p className="text-lg">Software Engineer</p>
          </div>
        </div>

        {/* Student Data Cards */}
        <div className='flex flex-wrap justify-center mx-4 my-12 gap-8'>
          {/* LeetCode Stats Card */}
          <div className="h-auto w-full sm:w-[400px] md:w-[600px] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.2)] flex flex-col justify-center items-center p-4">
            <h3 className='text-xl font-bold'>LeetCode Stats</h3>
            <div className='flex flex-wrap justify-around my-4 w-full'>
              <p className='bg-gray-600 p-2 w-32 text-center'>Total: {total_qs}</p>
              <p className='bg-green-600 p-2 w-32 text-center'>Easy: {easy_total_qs}</p>
              <p className='bg-yellow-600 p-2 w-32 text-center'>Medium: {medium_total_qs}</p>
              <p className='bg-red-600 p-2 w-32 text-center'>Hard: {hard_total_qs}</p>
            </div>
          </div>

          {/* Bar Chart Card */}
          <div className="h-auto w-full sm:w-[400px] md:w-[600px] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.2)] flex flex-col justify-center items-center p-4">
            <h3 className='text-xl font-bold'>Questions Solved Breakdown</h3>
            <Bar data={data} options={options} />
          </div>
        </div>

        {/* Question Details */}
        <div className='flex justify-center'>
  <div className="h-full w-full sm:w-[400px] md:w-[1200px] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.2)] p-4 md:mx-12 mx-4">
    <h4 className='text-center text-3xl text-white'>Types of Questions</h4>
    <div className='my-4'>
      <h5 className='text-lg text-gray-300'>Advanced Questions</h5>
      <div className='flex flex-wrap justify-around gap-6 my-4 w-full'>
        {Object.entries(advanceQuestions).map(([type, count]) => (
          <p key={type} className='bg-gray-600 p-2 w-1/6 my-12 text-center'>{type}: {count}</p>
        ))}
      </div>
    </div>
    <div className='my-4'>
      <h5 className='text-lg text-gray-300'>Fundamental Questions</h5>
      <div className='flex flex-wrap justify-around gap-6 my-4 w-full '>
        {Object.entries(fundamentalQuestions).map(([type, count]) => (
          <p key={type} className='bg-gray-600 p-2 my-12 w-1/6 text-center'>{type}: {count}</p>
        ))}
      </div>
    </div>
    <div className='my-4'>
      <h5 className='text-lg text-gray-300'>Intermediate Questions</h5>
      <div className='flex flex-wrap justify-around gap-6 my-4 w-full'>
        {Object.entries(intermediateQuestions).map(([type, count]) => (
          <p key={type} className='bg-gray-600 p-2 w-1/6 my-12 text-center'>{type}: {count}</p>
        ))}
      </div>
    </div>
  </div>
</div>

      </section>
    </>
  );
}
