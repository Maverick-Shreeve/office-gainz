import { useState } from 'react';

export default function Record() {
  const [exercise, setExercise] = useState('');
  const [count, setCount] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would handle sending the data to your storage solution
    console.log(`Exercise: ${exercise}, Count: ${count}`);
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