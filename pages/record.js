import { useState } from 'react';

export default function Record() {
  const [exercise, setExercise] = useState('');
  const [count, setCount] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/record-pushup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercise, count }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Record saved:', data);
      // Reset form or give user feedback
    } catch (error) {
      console.error('Error recording pushup:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="exercise">Exercise:</label>
      <input
        type="text"
        id="exercise"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
      />
      <label htmlFor="count">Count:</label>
      <input
        type="number"
        id="count"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button type="submit">Record Exercise</button>
       </form>
     );
   }
