const { useState, useEffect } = require ('react');

export default function Progress() {
  // This state would eventually be from DB 
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // should fetch this data from a server
    const fetchedExercises = [
      { id: 1, name: 'Pushups', count: 20, date: '2023-01-01' },
      { id: 2, name: 'Squats', count: 15, date: '2023-01-02' },
     
    ];
    
    setExercises(fetchedExercises);
  }, []);

  return (
    <div>
      <h1>Exercise Progress</h1>
      {exercises.length > 0 ? (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              {exercise.name}: {exercise.count} repetitions on {exercise.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No exercise records found.</p>
      )}
    </div>
  );
}
