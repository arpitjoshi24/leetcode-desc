import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const location = useLocation();
const { name } = location.state || { name: 'user' }; // Default name if not provided
// Default name if not provided

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`fetch_profile?endpoint=${name}`, {
          baseURL: 'http://172.16.10.141:8080/',
      });
      
        console.log(response.data); // Log the response to debug
        setProfileData(response.data.data);
      } catch (error) {
        console.error('Error fetching the profile data:', error);
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
    return <div>Error loading profile data.</div>;
  }

  const { easy_total_qs, hard_total_qs, medium_total_qs, total_qs, username } = profileData;

  return (
    <>
      <header className='bg-zinc-600 border-[#1F2120ff] mt-0 px-4'>
        <div>
          <h3 className='py-4 text-xl text-white font-semibold'>Gehu Leetcode</h3>
        </div>
      </header>
      <section className='bg-black text-white py-6'>
        <h1 className='text-center text-4xl font-bold py-4'>Profile</h1>
        <div className='md:flex mx-12 py-6 gap-32 justify-center'>
          <div>
            <img
              width={300}
              height={300}
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="Profile"
            />
          </div>
          <div className='space-y-2 mt-20'>
            <h2 className='text-2xl font-bold'>{name}</h2>
            <p>Username: <a href={`https://leetcode.com/${username}`} target="_blank" rel="noopener noreferrer">{username}</a></p>
            <p>Leetcode Rating: 1550/1567</p>
            <p>Software Engineer</p>
          </div>
        </div>

        {/* Leetcode Stats Section */}
        <div className='md:flex space-y-6 md:space-y-0 mx-12 my-12 gap-32 justify-center'>
          <div className="h-[16em] w-[18em] md:w-[24em] border-2 border-[rgba(75,30,133,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(75,30,133,1)] to-[rgba(75,30,133,0.2)] flex flex-col justify-center items-center">
            <h3 className='text-xl font-bold'>LeetCode Stats</h3>
            <div className='flex mx-2 gap-8 my-12'>
            <p className='bg-gray-600 p-2 '>Total Questions: {total_qs}</p>
            <p className='bg-green-600 p-2 '> Easy Questions: {easy_total_qs}</p>
            </div>
            <div className='flex mx-2 gap-8'>
            <p className='bg-yellow-600 p-2 '>Medium Questions: {medium_total_qs}</p>
            <p className='bg-red-600 p-2 '>Hard Questions: {hard_total_qs}</p>
            </div>
           
            
            
          </div>
        </div>
      </section>
    </>
  );
}
