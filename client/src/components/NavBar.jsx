import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import UserContext from '../context/userContext'
import { useNavigate } from 'react-router-dom';


const NavBar = () => {
    const navigate = useNavigate();
    const [showOptions, SetShowOptions] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const handleLogout = (e) => {
        e.preventDefault();
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    }
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser({ name: JSON.parse(storedUser) });
        }
    }, []);
    return (
        <div className="navbar">
            <div className="logo">CoVaxine</div>
            <div className='home-menu'>
                <li>
                    <Link to='/'>
                        Home
                    </Link>
                </li>
                <li>About Us</li>
                <li>Contact</li>
            </div>
            <div className='home-profile'
                onMouseEnter={() => SetShowOptions(true)}
                onMouseLeave={() => SetShowOptions(false)}
            >
                {user ? (
                    <>
                        Hi, {user.name}
                        {showOptions && (
                            <div className="logout-options">
                                <button className="logout" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <Link to='/register'>
                            <span>Register</span> / <span>Sign In</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default NavBar
