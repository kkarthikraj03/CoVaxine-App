import React, { useContext, useState } from 'react'
import UserContext from '../context/userContext';
import { Link, useNavigate } from 'react-router-dom';



const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [logData,SetLogData] = useState({
    name: '',
    password: '',
  });
  const handleIpChange = (e) => {
    const { name,value } = e.target;
    SetLogData({
      ...logData,
      [name] : value,
    });
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(logData)
      });
      const data = await response.json();
      if(response.ok){
        console.log("Successfully Logged in");
        localStorage.setItem('token',data.token);
        const name = data.user.Name;
        setUser({ name });
        localStorage.setItem('user', JSON.stringify(name));
        navigate('/');
      } else {
        console.log("Error in Logging in");
      }
    } catch(error) {
      console.log("Error in API-Frontend", error);
    }
  }
  return (
    <div className="reg">
      <h3>Login</h3>
      <div className="reg-ipDiv">
        <input type="input" className="reg-field" placeholder="Name" name="name" id="name" value={logData.name} onChange={handleIpChange} required />
      </div>
      <div className="reg-ipDiv">
        <input type="password" className="reg-field" placeholder="Password" name="password" id="password" value={logData.password} onChange={handleIpChange} required />
      </div>
      <div className="reg-btnDiv">
        <button className="reg-btn" onClick={handleSubmit}>Login</button>
      </div>
      <div className="reg-switch">
          <Link to='/register'>Didn't have an account? Register here! </Link>
      </div>
    </div>
  )
}

export default Login
