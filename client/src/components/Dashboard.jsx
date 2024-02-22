import React, { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
    const [isAdmin, SetIsAdmin] = useState(false);
    const [centreData, SetCentreData] = useState([]);
    const [slotData, SetSlotData] = useState([]);
    const [reqData, SetReqData] = useState({
        Centre_ID: '',
        Centre_Name: '',
        Cost: '',
        Vaccine_Type: '',
        Slots: '',
        State: '',
        City: '',
    })
    const handleRemove = async (centreId) => {
        try {
            const response = await fetch('http://localhost:3001/removeCentre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ centreId: centreId })
            })
            if (response.ok) {
                console.log("Successfully Deleted");
                fetchCentres1();
                fetchSlots1();
            } else {
                console.log("Error in Deleting");
            }
        } catch (error) {
            console.log("An Error occured in API", error);
        }
    }
    const handleIncrement = async (centreId, slotNumber) => {
        try {
            const reqData = {
                centreId,
                slotNumber
            }
            const response = await fetch('http://localhost:3001/increment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData)
            })
            if (response.ok) {
                fetchSlots1();
            } else {
                console.log("Error in Increment");
            }
        } catch (error) {
            console.log("Error in API", error);
        }
    }
    const handleDecrement = async (centreId, slotNumber) => {
        try {
            const reqData = {
                centreId,
                slotNumber
            }
            const response = await fetch('http://localhost:3001/decrement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData)
            })
            if (response.ok) {
                fetchSlots1();
            } else {
                console.log("Error in Decrement");
            }
        } catch (error) {
            console.log("Error in API", error);
        }
    }
    const handleDataChange = (e) => {
        const { name, value } = e.target;
        SetReqData({
            ...reqData,
            [name]: value,
        });
    }
    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/addCentre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData)
            })
            if (response.ok) {
                console.log("Centre Added Successfully");
                fetchCentres1();
                fetchSlots1();
            } else {
                console.log("Error in Adding Centres");
            }
        } catch (error) {
            console.log("Error in API ", error);
        }
    }
    const fetchSlots1 = async () => {
        try {
            await fetch('http://localhost:3001/slotList')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Http error!: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    SetSlotData(data.results);
                })
                .catch(error => {
                    console.log("Error: ", error);
                })
        } catch (error) {
            console.log("Error in Fetching API", error);
        }
    }
    const fetchCentres1 = async () => {
        try {
            const response = await fetch('http://localhost:3001/centreList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: 'select',
                    city: 'select',
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
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const { userName } = decodedToken;
            if (userName === 'admin')
                SetIsAdmin(true);
        }
        const fetchCentres = async () => {
            try {
                const response = await fetch('http://localhost:3001/centreList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        state: 'select',
                        city: 'select',
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
        const fetchSlots = async () => {
            try {
                await fetch('http://localhost:3001/slotList')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Http error!: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {

                        SetSlotData(data.results);
                    })
                    .catch(error => {
                        console.log("Error: ", error);
                    })
            } catch (error) {
                console.log("Error in Fetching API", error);
            }
        }
        fetchCentres();
        fetchSlots();
    }, [])
    if (!isAdmin) return (<div className='noDashboard'>403 - Unauthorized Access</div>)
    else
        return (
            <div className='dashboard'>
                <h2>Admin Dashboard</h2>
                <div className="welcome">Welcome Admin!</div>
                <div className="centreDetails">
                    <div className="head">Centre Details</div>
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
                                            <button onClick={() => handleRemove(centre.centre_id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="slotDetails">
                        <div className="head">Slot Details</div>
                        <div className="center-tableDiv">
                            <table border={2}>
                                <thead>
                                    <tr>
                                        <th>Centre_Name</th>
                                        <th>Slot_1</th>
                                        <th>Slot_2</th>
                                        <th>Slot_3</th>
                                        <th>Slot_4</th>
                                        <th>Slot_5</th>
                                        <th>Slot_6</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slotData.map((slot) => (
                                        <tr key={slot.centre_id}>
                                            <td>{slot.centre_name}</td>
                                            <td>
                                                <button className='decBtn' onClick={() => handleDecrement(slot.centre_id, 1)}>-</button>
                                                {slot.slot_1}
                                                <button className='incBtn' onClick={() => handleIncrement(slot.centre_id, 1)}>+</button>
                                            </td>
                                            <td>
                                                <button className='decBtn' onClick={() => handleDecrement(slot.centre_id, 2)}>-</button>
                                                {slot.slot_2}
                                                <button className='incBtn' onClick={() => handleIncrement(slot.centre_id, 2)}>+</button>
                                            </td>
                                            <td>
                                                <button className='decBtn' onClick={() => handleDecrement(slot.centre_id, 3)}>-</button>
                                                {slot.slot_3}
                                                <button className='incBtn' onClick={() => handleIncrement(slot.centre_id, 3)}>+</button>

                                            </td>
                                            <td>
                                                <button className='decBtn' onClick={() => handleDecrement(slot.centre_id, 4)}>-</button>
                                                {slot.slot_4}
                                                <button className='incBtn' onClick={() => handleIncrement(slot.centre_id, 4)}>+</button>
                                            </td>
                                            <td>
                                                <button className='decBtn' onClick={() => handleDecrement(slot.centre_id, 5)}>-</button>
                                                {slot.slot_5}
                                                <button className='incBtn' onClick={() => handleIncrement(slot.centre_id, 5)}>+</button>
                                            </td>
                                            <td>
                                                <button className='decBtn' onClick={() => handleDecrement(slot.centre_id, 6)}>-</button>
                                                {slot.slot_6}
                                                <button className='incBtn' onClick={() => handleIncrement(slot.centre_id, 6)}>+</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="addCentre">
                        <div className="addhead">Add Centre</div>
                        <div className="addForm">
                            <div className="add-box">
                                <label htmlFor="name" className="add-label">Enter Centre ID: </label>
                                <input name="Centre_ID" className="add-ip" value={reqData.Centre_ID} onChange={handleDataChange} />
                            </div>
                            <div className="add-box">
                                <label htmlFor="name" className="add-label">Enter Centre Name: </label>
                                <input name="Centre_Name" className="add-ip" value={reqData.Centre_Name} onChange={handleDataChange} />
                            </div>
                            <div className="add-box">
                                <label htmlFor="cost" className="add-label">Enter Cost: </label>
                                <input type="radio" name="Cost" value="Paid" checked={reqData.Cost === 'Paid'} onChange={handleDataChange} /> Paid
                                <input type="radio" name="Cost" value="Free" checked={reqData.Cost === 'Free'} onChange={handleDataChange} /> Free
                            </div>
                            <div className="add-box">
                                <label htmlFor="type" className="add-label">Enter Vaccine Type: </label>
                                <input type="radio" name="Vaccine_Type" value="Covaxine" checked={reqData.Vaccine_Type === 'Covaxine'} onChange={handleDataChange} /> Covaxine
                                <input type="radio" name="Vaccine_Type" value="CoWin" checked={reqData.Vaccine_Type === 'CoWin'} onChange={handleDataChange} /> CoWin
                            </div>
                            <div className="add-box">
                                <label htmlFor="slot" className="add-label">Enter Slots: </label>
                                <input type="text" name="Slots" className="add-ip" value={reqData.Slots} onChange={handleDataChange} />
                            </div>
                            <div className="add-box">
                                <label htmlFor="state" className="add-label">Enter State: </label>
                                <input type="text" name="State" className="add-ip" value={reqData.State} onChange={handleDataChange} />
                            </div>
                            <div className="add-box">
                                <label htmlFor="city" className="add-label">Enter City: </label>
                                <input type="text" name="City" className="add-ip" value={reqData.City} onChange={handleDataChange} />
                            </div>
                            <div className="add-box">
                                <button className="addBtn" onClick={handleAdd}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default Dashboard

