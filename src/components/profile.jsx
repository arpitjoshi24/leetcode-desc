import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
        console.log(response.data)
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  const { easy_total_qs, hard_total_qs, medium_total_qs, total_qs, username } = profileData;

  return (
    <>
      <header className='bg-zinc-600 border-[#1F2120ff] mt-0 px-4'>
        <div>
            <Link to="/">
          <h3 className='py-4 text-xl text-white font-semibold'>Gehu Leetcode</h3>
            </Link>
        </div>
      </header>
      <section className='bg-black text-white py-6'>
        <h1 className='text-center text-4xl font-bold py-4'>Profile</h1>
        <div className='md:flex flex-col sm:flex-row mx-4 md:mx-12 py-6 gap-12 justify-center'>
          <div className='flex justify-center'>
            <img
              className='rounded-full object-cover w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64'
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Profile"
            />
          </div>
          <div className='text-center sm:text-left space-y-4 mt-6 sm:mt-0'>
            <h2 className='text-2xl font-bold'>{name}</h2>
            <p>Username: {username}</p>
            <p>Leetcode Rating: 1550/1567</p>
            <p>Software Engineer</p>
          </div>
        </div>

        {/* Leetcode Stats Section */}
        <div className='grid sm:grid-cols-2 gap-6 mx-4 md:ml-[30rem] my-12'>
          <div className="h-[16em] w-full sm:w-auto border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.2)] flex flex-col justify-center items-center">
            <h3 className='text-xl font-bold'>LeetCode Stats</h3>
            <div className='flex justify-around my-8 w-full'>
              <p className='bg-gray-600 p-2 w-32 text-center'>Total: {total_qs}</p>
              <p className='bg-green-600 p-2 w-32 text-center'>Easy: {easy_total_qs}</p>
            </div>
            <div className='flex justify-around w-full'>
              <p className='bg-yellow-600 p-2 w-32 text-center'>Medium: {medium_total_qs}</p>
              <p className='bg-red-600 p-2 w-32 text-center'>Hard: {hard_total_qs}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
