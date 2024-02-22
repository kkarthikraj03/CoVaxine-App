import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Register = () => {
    const [regData, SetRegData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const handleIpChange = (e) => {
        const { name, value } = e.target;
        SetRegData({
            ...regData,
            [name]: value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regData)
            });
            if (response.ok) {
                console.log("Data Submitted Successfully");
            } else {
                console.log("Error in Submitting Data");
            }
        } catch (error) {
            console.log("Error in API", error);
        }
    }
    return (
        <div className="reg">
            <h3>Register</h3>
            <div className="reg-ipDiv">
                <input type="input" className="reg-field" placeholder="Name" name="name" id="name" value={regData.name} onChange={handleIpChange} required />
            </div>
            <div className="reg-ipDiv">
                <input type="input" className="reg-field" placeholder="Email" name="email" id="email" value={regData.email} onChange={handleIpChange} required />
            </div>
            <div className="reg-ipDiv">
                <input type="password" className="reg-field" placeholder="Password" name="password" id="password" value={regData.password} onChange={handleIpChange} required />
            </div>
            <div className="reg-btnDiv">
                <button className="reg-btn" onClick={handleSubmit}>Register</button>
            </div>
            <div className="reg-switch">
                <Link to='/login'>Already Registered? Log in</Link>
            </div>
        </div>
    )
}

export default Register
