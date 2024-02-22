import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import location from '/images/location.png';
import centre1 from '/images/center-1.jpg';
const SlotBooking = ({ slotId, isButtonDisabled, handleSlot }) => {
  return (
    <div className="gridItem">
      <div className="slotName">{`Slot_${slotId}`}</div>
      <div className="slotTime">{/* Add your time logic here */}</div>
      <button className='slotBtn' onClick={() => handleSlot(`slot_${slotId}`)} disabled={isButtonDisabled}>
        Book
      </button>
    </div>
  );
};
const Description = () => {
  let { centreId } = useParams();
  const [data, setData] = useState([]);
  const [buttonStates, setButtonStates] = useState([false, false, false, false, false, false]);
  const disableButton = (slotNumber) => {
    setButtonStates(prevStates => {
      const newState = [...prevStates];
      newState[slotNumber - 1] = true;
      return newState;
    });
  };

  const enableButton = (slotNumber) => {
    setButtonStates(prevStates => {
      const newState = [...prevStates];
      newState[slotNumber - 1] = false;
      return newState;
    });
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/details/${centreId}`);
      const result = await response.json();
      const centreData = result.results[0];
      setData(centreData);
    } catch (error) {
      console.log("Error in API", error);
    }
  }
  const handleSlot = async (slotNumber) => {
    try {
      const sendData = {
        slotNumber,
        centreId
      }
      const response = await fetch('http://localhost:3001/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData)
      })
      if (response.ok) {
        console.log("Slot Booked Successfully");
        fetchSlotCount(slotNumber, centreId);
      } else {
        console.log("Error in Booking");
      }
    } catch (error) {
      console.log("Error in API", error);
    }
  }
  const fetchSlotCount = async (slotNumber, centreId) => {
    try {
      const reqData = {
        slotNumber,
        centreId
      }
      const response = await fetch('http://localhost:3001/slotCount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
      })
      if (response.ok) {
        const count = await response.json();
        const numericSlot = parseInt(slotNumber.replace("slot_", ""), 10);
        if (count.slotValue === 0) {
          disableButton(numericSlot);
        }
        else {
          enableButton(numericSlot);
        }
      } else {
        console.log("Error in Fetching Slot Count");
      }
    } catch (error) {
      console.log("Error in API", error);
    }
  }
  useEffect(() => {
    fetchData();
    fetchSlotCount('slot_1', centreId);
    fetchSlotCount('slot_2', centreId);
    fetchSlotCount('slot_3', centreId);
    fetchSlotCount('slot_4', centreId);
    fetchSlotCount('slot_5', centreId);
    fetchSlotCount('slot_6', centreId);
  }, []);
  return (
    <div className='description'>
      <div className='centreDetails'>
        <h2>{data.centre_name}</h2>
        <div className="centrePage">
          <div className="left">
            <div className="imgDiv">
              <img src={centre1} alt="" />
            </div>
          </div>
          <div className="right">
            <div className="firstDiv">
              <div className="locationDiv">
                <span><img className='locationImg' src={location} /></span>
                <span className="location">{data.city} , {data.state}</span>
              </div>
              <div className="idDiv">ID: #{data.centre_id}</div>
            </div>
            <div className="firstDiv">
              <div>Cost: {data.cost}</div>
              <div>Type: {data.vaccine_type}</div>
            </div>
            <div className="firstDiv">
              <div>Slots: {data.slots}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="slotDetails">
        <h3 className="bookDiv">Book your Slots Here!!!</h3>
        <div className="gridContainer">
          {[1, 2, 3, 4, 5, 6].map(slotNumber => (
            <SlotBooking
              key={slotNumber}
              slotId={slotNumber}
              isButtonDisabled={buttonStates[slotNumber - 1]}
              handleSlot={handleSlot}
            />
          ))}
        </div>
      </div>
      <div className="generalDiv">
        <h3>Guidelines to be followed</h3>
        <ul>
          <li>Please wear a mask at all times while inside the vaccination center.</li>
          <li>Keep a safe distance of at least 6 feet from others while waiting and moving through the center.</li>
          <li>Use hand sanitizer provided at entry points and throughout the center.</li>
          <li>Adhere to posted signs and floor markings for guidance on movement and spacing.</li>
          <li>Allow for temperature checks at entry points to ensure a safe environment.</li>
          <li>If you're feeling unwell or have a fever, please reschedule your vaccination appointment.</li>
          <li>Minimize physical contact by using contactless forms and payment methods.</li>
          <li>Share your feedback on the vaccination process to help improve the experience for others.</li>
        </ul>
      </div>
    </div>
  )
}

export default Description


// < div className = "gridItem" >
//           <div className="slotName">Slot 1</div>
//           <div className="slotTime">9:00 am - 9:30am</div>
//           <button className='slotBtn' onClick={() => handleSlot('Slot_1')} disabled={isButtonDisabled}>Book</button>
//         </ >
//         <div className="gridItem">
//           <div className="slotName">Slot 2</div>
//           <div className="slotTime">10:00 am - 10:30am</div>
//           <button className='slotBtn' onClick={() => handleSlot('Slot_2')} disabled={isButtonDisabled}>Book</button>
//         </div>
//         <div className="gridItem">
//           <div className="slotName">Slot 3</div>
//           <div className="slotTime">1:00 pm - 1:30 pm</div>
//           <button className='slotBtn' onClick={() => handleSlot('Slot_3')} disabled={isButtonDisabled}>Book</button>
//         </div>
//         <div className="gridItem">
//           <div className="slotName">Slot 4</div>
//           <div className="slotTime">2:00 pm - 2:30 pm</div>
//           <button className='slotBtn' onClick={() => handleSlot('Slot_4')} disabled={isButtonDisabled}>Book</button>
//         </div>
//         <div className="gridItem">
//           <div className="slotName">Slot 5</div>
//           <div className="slotTime">4:00 pm - 4:30 pm</div>
//           <button className='slotBtn' onClick={() => handleSlot('Slot_5')} disabled={isButtonDisabled}>Book</button>
//         </div>
//         <div className="gridItem">
//           <div className="slotName">Slot 6</div>
//           <div className="slotTime">5:00 pm - 5:30 pm</div>
//           <button className='slotBtn' onClick={() => handleSlot('Slot_6')} disabled={isButtonDisabled}>Book</button>
//         </div>
