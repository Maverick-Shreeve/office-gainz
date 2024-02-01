import { useState } from 'react';



export default function Record() {
  const [pushupCount, setPushupCount] = useState('');
  const [wallSitDuration, setWallSitDuration] = useState(''); 
  const [message ,setMessage]= useState('');

  const handlePushupSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); 

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/record-pushup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ exercise: 'pushup', count: pushupCount }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Pushup record saved:', data);
      setMessage('Pushup record saved successfully!');
  
      // reset form
      setPushupCount(0);
    } catch (error) {
      console.error('Error recording pushup:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handlePushupChange = (e) => {
    const value = e.target.value;
    setPushupCount(value ? Math.max(0, Number(value)) : '');
  };

 

  const handleWallSitSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/record-wall-sit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ exercise: 'wall-sit', duration: wallSitDuration }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Wall sit recorded:', data);
      setMessage('Wall sit recorded successfully!');

      // Reset form field
      setWallSitDuration(0);
    } catch (error) {
      console.error('Error recording wall sit:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleWallSitDurationChange = (e) => {
    const value = e.target.value;
    setWallSitDuration(value ? Math.max(0, Number(value)) : '');
  };



  return (

    <div className="container">
      <form onSubmit={handlePushupSubmit} className="mb-5">
        <label htmlFor="pushupCount" className="block mb-2 font-bold">Pushups Count:</label>
        <input
          type="number"
          id="pushupCount"
          placeholder='Enter Pushups'
          value={pushupCount}
          onChange={handlePushupChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md"
        />
        <button type="submit" className="button w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Record Pushups
        </button>
      </form>
      <div className="message">{message}</div>

      <form onSubmit={handleWallSitSubmit} className="mb-5">
        <label className="block mb-2 font-bold">Wall Sit Duration (seconds):</label>
        <input
          type="number"
          value={wallSitDuration}
          onChange={handleWallSitDurationChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md"
          placeholder="Enter duration in seconds"
        />
        <button type="submit" className="button w-full p-2 mt-3 rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Record Wall Sit
        </button>
      </form>
      <div className="message">{message}</div>
    </div>
  );
}