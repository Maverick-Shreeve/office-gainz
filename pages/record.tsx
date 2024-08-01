import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { ThemeContext } from '../context/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';

interface Props {}

interface ExerciseRecord {
  id: number;
  type: string;
  count?: number;
  duration?: number;
  created_at: string;
}

const Record: React.FC<Props> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pushupCount, setPushupCount] = useState<string>('');
  const [wallSitDuration, setWallSitDuration] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [lastPushups, setLastPushups] = useState<ExerciseRecord[]>([]);
  const [lastWallSits, setLastWallSits] = useState<ExerciseRecord[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalRecords, setModalRecords] = useState<ExerciseRecord[]>([]);
  const router = useRouter();
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { theme } = themeContext;

  useEffect(() => {
    const fetchSession = async () => {
      console.log("Fetching session...");
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      console.log("Session data:", data);
      setUser(data.session?.user ?? null);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setUser(session?.user ?? null);
    });

    return () => {
      if (listener && listener.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, [router.asPath]);

  useEffect(() => {
    if (user) {
      console.log("User logged in, fetching exercises...");
      fetchLastExercises('pushup', setLastPushups);
      fetchLastExercises('wall-sit', setLastWallSits);
    }
  }, [user]);

  const fetchLastExercises = async (type: string, setState: React.Dispatch<React.SetStateAction<ExerciseRecord[]>>) => {
    console.log(`Fetching last exercises of type ${type}...`);
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', user?.id)
      .eq('type', type)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error(`Error fetching ${type} exercises:`, error);
    } else {
      console.log(`Fetched ${type} exercises:`, data);
      setState(data);
    }
  };

  const handlePushupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const pushupValue = parseInt(pushupCount);
    if (!user) {
      setMessage('No user logged in.');
      return;
    } else if (pushupValue <= 0 || isNaN(pushupValue)) {
      setMessage('Please enter a positive number of pushups.');
      return;
    }

    try {
      console.log("Inserting pushup record...");
      const response = await supabase
        .from('exercises')
        .insert([{ type: 'pushup', count: pushupValue, user_id: user.id }]);

      if (response.error) throw response.error;

      console.log("Pushup record inserted:", response);
      setMessage('Pushup record saved successfully!');
      setPushupCount('');
      fetchLastExercises('pushup', setLastPushups);
    } catch (error: any) {
      console.error("Error inserting pushup record:", error);
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handlePushupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPushupCount(e.target.value);
  };

  const handleWallSitSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const wallSitValue = parseInt(wallSitDuration);
    if (!user) {
      setMessage('No user logged in.');
      return;
    } else if (wallSitValue <= 0 || isNaN(wallSitValue)) {
      setMessage('Please enter a positive duration for the wall sit.');
      return;
    }

    try {
      console.log("Inserting wall sit record...");
      const response = await supabase
        .from('exercises')
        .insert([{ type: 'wall-sit', duration: wallSitValue, count: 1, user_id: user.id }]);

      if (response.error) throw response.error;

      console.log("Wall sit record inserted:", response);
      setMessage('Wall sit recorded successfully!');
      setWallSitDuration('');
      fetchLastExercises('wall-sit', setLastWallSits);
    } catch (error: any) {
      console.error("Error inserting wall sit record:", error);
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handleWallSitDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallSitDuration(e.target.value);
  };

  const handleEdit = (type: string) => {
    console.log(`Editing ${type} records...`);
    setModalType(type);
    setModalRecords(type === 'pushup' ? lastPushups : lastWallSits);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    console.log(`Deleting record with id ${id}...`);
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log("Record deleted successfully.");
      setMessage('Record deleted successfully!');
      setModalRecords(modalRecords.filter(record => record.id !== id));
      fetchLastExercises(modalType, modalType === 'pushup' ? setLastPushups : setLastWallSits);
    } catch (error: any) {
      console.error("Error deleting record:", error);
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handleUpdate = async (record: ExerciseRecord) => {
    console.log(`Updating record with id ${record.id}...`);
    try {
      const updatedValue = modalType === 'pushup' ? record.count : record.duration;
      if (updatedValue === undefined || updatedValue <= 0) {
        setMessage('Please enter valid positive values.');
        return;
      }

      const { data, error } = await supabase
        .from('exercises')
        .update({
          count: record.type === 'pushup' ? updatedValue : undefined,
          duration: record.type === 'wall-sit' ? updatedValue : undefined
        })
        .eq('id', record.id)
        .select();

      if (error) throw error;

      console.log("Record updated:", data);
      if (data.length > 0) {
        setMessage('Record updated successfully!');
        setModalRecords(modalRecords.map(r => (r.id === record.id ? { ...r, count: updatedValue, duration: updatedValue } : r)));
        fetchLastExercises(modalType, modalType === 'pushup' ? setLastPushups : setLastWallSits);
      } else {
        setMessage('No record was updated.');
      }
    } catch (error: any) {
      console.error("Error updating record:", error);
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-dark-background text-white' : ''}`}>
      {user ? (
        <div className="flex flex-col items-center">
          <div className="w-full lg:w-3/4 xl:w-2/3">
            <h1 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : ''}`}>Record Your Exercises</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form onSubmit={handlePushupSubmit} className={`p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white'}`}>
                <label htmlFor="pushupCount" className="block mb-2 font-bold">Pushups Count:</label>
                <input
                  type="number"
                  id="pushupCount"
                  value={pushupCount}
                  onChange={handlePushupChange}
                  className={`w-full p-2 mb-3 border rounded-md ${theme === 'dark' ? 'bg-dark-card border-gray-600' : 'border-gray-300'}`}
                  placeholder="Enter Pushups"
                  min="1"
                />
                <button type="submit" className="button w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Record Pushups
                </button>
              </form>
              <form onSubmit={handleWallSitSubmit} className={`p-4 shadow-md rounded-md ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white'}`}>
                <label className="block mb-2 font-bold">Wall Sit Duration (seconds):</label>
                <input
                  type="number"
                  value={wallSitDuration}
                  onChange={handleWallSitDurationChange}
                  className={`w-full p-2 mb-3 border rounded-md ${theme === 'dark' ? 'bg-dark-card border-gray-600' : 'border-gray-300'}`}
                  placeholder="Enter duration in seconds"
                  min="1"
                />
                <button type="submit" className="button w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Record Wall Sit
                </button>
              </form>
            </div>
            {message && <div className={`message ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-green-100 border-green-400 text-green-700'} px-4 py-3 rounded relative mt-4`}>{message}</div>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <h2 className={`text-2xl font-bold mb-4 text-left ${theme === 'dark' ? 'text-white' : ''}`}>Last 5 Pushups</h2>
                <table className={`w-full shadow-md rounded-md text-xs table-auto border-collapse ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}>
                  <thead>
                    <tr>
                      <th className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>Date</th>
                      <th className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>Count</th>
                      <th className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastPushups.map((record) => (
                      <tr key={record.id}>
                        <td className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>{new Date(record.created_at).toLocaleDateString()}</td>
                        <td className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>{record.count}</td>
                        <td className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>
                          <button onClick={() => handleEdit('pushup')} className="text-black hover:text-blue-800 p-1" style={{ padding: '2px', fontSize: '10px' }}>
                            <i className="fa fa-edit" aria-hidden="true" style={{ fontSize: '10px' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h2 className={`text-2xl font-bold mb-4 text-left ${theme === 'dark' ? 'text-white' : ''}`}>Last 5 Wall Sits</h2>
                <table className={`w-full shadow-md rounded-md text-xs table-auto border-collapse ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'}`}>
                  <thead>
                    <tr>
                      <th className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>Date</th>
                      <th className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>Duration (seconds)</th>
                      <th className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastWallSits.map((record) => (
                      <tr key={record.id}>
                        <td className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>{new Date(record.created_at).toLocaleDateString()}</td>
                        <td className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>{record.duration}</td>
                        <td className={`p-1 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-400'} text-center`}>
                          <button onClick={() => handleEdit('wall-sit')} className="text-black hover:text-blue-800 p-1" style={{ padding: '2px', fontSize: '10px' }}>
                            <i className="fa fa-edit" aria-hidden="true" style={{ fontSize: '10px' }}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : ''}`}>Please Log In</h1>
          <p className={`text-gray-600 ${theme === 'dark' ? 'dark:text-gray-400' : ''}`}>You need to log in to record your exercises.</p>
          <div className="flex justify-center mt-4">
            <Image
              src="/exerciseExample.jpeg"
              alt="Exercise Example"
              width={900}
              height={700}
              className="rounded shadow-md"
            />
          </div>
          <p className="mt-4">This is an example of how the page will look once you have logged in and recorded exercises.</p>
          <Link href="/auth">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center justify-center mt-4">
              Sign In
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6 ml-2" />
            </button>
          </Link>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-3 rounded shadow-lg w-80 ${theme === 'dark' ? 'bg-dark-card text-white' : 'bg-white'}`}>
            <h2 className="text-lg font-bold mb-3">Edit Last 5 {modalType === 'pushup' ? 'Pushups' : 'Wall Sits'}</h2>
            <form>
              {modalRecords.map((record, index) => (
                <div key={record.id} className="mb-2">
                  <label className="block mb-1 text-sm font-bold">Record {index + 1}:</label>
                  {modalType === 'pushup' ? (
                    <input
                      type="number"
                      value={record.count ?? ''}
                      onChange={(e) => {
                        const updatedRecords = [...modalRecords];
                        updatedRecords[index] = { ...updatedRecords[index], count: parseInt(e.target.value) || 0 };
                        setModalRecords(updatedRecords);
                      }}
                      className={`w-full p-1 border rounded-md text-xs ${theme === 'dark' ? 'bg-dark-card border-gray-600' : 'border-gray-300'}`}
                      min="1"
                    />
                  ) : (
                    <input
                      type="number"
                      value={record.duration ?? ''}
                      onChange={(e) => {
                        const updatedRecords = [...modalRecords];
                        updatedRecords[index] = { ...updatedRecords[index], duration: parseInt(e.target.value) || 0 };
                        setModalRecords(updatedRecords);
                      }}
                      className={`w-full p-1 border rounded-md text-xs ${theme === 'dark' ? 'bg-dark-card border-gray-600' : 'border-gray-300'}`}
                      min="1"
                    />
                  )}
                  <div className="flex justify-between mt-1">
                    <button type="button" onClick={() => handleDelete(record.id)} className="text-xs text-black hover:text-red-500">Delete</button>
                    <button type="button" onClick={() => handleUpdate(record)} className="text-xs text-black hover:text-blue-500">Update</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="button p-1 rounded-md text-white bg-gray-600 hover:bg-gray-700 text-xs">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Record;
