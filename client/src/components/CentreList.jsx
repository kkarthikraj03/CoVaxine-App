import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CentreList = () => {
  const [centreData, SetCentreData] = useState([]);
  const [selectedState, SetSelectedState] = useState('select');
  const [selectedCity, SetSelectedCity] = useState('select');
  const navigate = useNavigate();
  const citiesByState = {
    select: [],
    Tamilnadu: ['Chennai', 'Madurai', 'Salem', 'Tirunelveli'],
    Andhra_Pradhesh: ['Anakapalli', 'Kakinada', 'Nellore', 'Kadapa'],
    Maharashtra: ['Mumbai', 'Thane', 'Nashik', 'Pune'],
  }
  const handleState = (e) => {
    const stateValue = e.target.value;
    SetSelectedState(stateValue);
    SetSelectedCity('select');
  }
  const handleCity = (e) => {
    const cityValue = e.target.value;
    SetSelectedCity(cityValue);
  }
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/centreList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state: selectedState,
          city: selectedCity,
        }),
      });
      if (!response.ok) {
        throw new Error(`Http Error! Status ${response.status}`);
      }
      const data = await response.json();
      SetCentreData(data.results);
    } catch (error) {
      console.log("Error in Fetching API", error);
    }
  }
  const handleBook = async (centreID) => {
    console.log("Clicked!");
    navigate(`/details/${centreID}`);
  }
  return (
    <div className="centre">
      <h2 className='centre-h2'>Health Centres Available</h2>
      <div className='centre-div'>Search for your nearest Vaccination Centre</div>
      <div className="centre-searchBar">
        <span className="centre-searchIp">
          <span className='center-select'>
            <label htmlFor="state">State: </label>
            <select id='state' name='state' value={selectedState} onChange={handleState}>
              <option value="select">Select State</option>
              <option value="Tamilnadu">TamilNadu</option>
              <option value="Andhra_Pradhesh">Andhra Pradhesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </span>
          <span>
            <label htmlFor="city">City: </label>
            <select id='city' name='city' className='center-select' value={selectedCity} onChange={handleCity}>
              <option value="select">Select City</option>
              {citiesByState[selectedState].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </span>
          <button onClick={handleSearch}>Search</button>
        </span>
      </div>
      <div className="center-tableDiv">
        <table border={2}>
          <thead>
            <tr>
              <th>Centre_Name</th>
              <th>Cost</th>
              <th>Vaccine_Type</th>
              <th>Slots</th>
              <th>State</th>
              <th>City</th>
              <th>Book</th>
            </tr>
          </thead>
          <tbody>
            {centreData.map((centre) => (
              <tr key={centre.centre_id}>
                <td>{centre.centre_name}</td>
                <td>{centre.cost}</td>
                <td>{centre.vaccine_type}</td>
                <td>{centre.slots}</td>
                <td>{centre.state}</td>
                <td>{centre.city}</td>
                <td>
                  <button onClick={() => handleBook(centre.centre_id)}>Book</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CentreList

//Name, Address, Paid or Free , Dose , Slots available
