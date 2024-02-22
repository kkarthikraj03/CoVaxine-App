import React, { useEffect, useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import home from '/images/independance.jpg';

const Home = () => {
  const navigate = useNavigate();

  const handleSlots = (e) => {
    e.preventDefault();
    navigate('/centres');
  }
  return (
    <div className='home'>
      <div className="home-showDiv">
        <div className="leftShow">
          <h2>Prevention is Better than Cure!!!</h2>
          <div className='showGet'>Get Vaccinated Now</div>
          <button className='bookBtn' onClick={handleSlots}>Book Your Slots</button>
          <div className='smallShow'>*Search for your nearest Vaccination Centre</div>

        </div>
        <img src={home} alt="logo" />
      </div>
      <div className="home-total">
        <div>Total Vaccinations Done - 12,34,655</div>
        <div>Vaccinations Done Today - 655</div>
      </div>
      <div className="home-steps">
        <div>Get Vaccinated in 3 Easy Steps</div>
        <div className="home-stepsDiv">
          <div className="home-step">Step 1 - Book an Appointment</div> -
          <div className="home-step">Step 2 - Get your Vaccination Safely</div> - 
          <div className="home-step">Step 3 - Download Vaccination Certificate</div>
        </div>
      </div>
      <div className="home-book">
        <div>Book Your Slots Now!!!</div>
        <div className="home-slotDiv">
          <button onClick={handleSlots}>Book Slot</button>
        </div>
      </div>
    </div>
  )
}

export default Home
