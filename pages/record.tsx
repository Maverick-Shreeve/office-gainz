import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

interface Props {}

interface ExerciseRecord {
  id: number;
  type: string;
  count: number;
  duration: number;
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

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      setUser(data.session?.user ?? null);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
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
      fetchLastExercises('pushup', setLastPushups);
      fetchLastExercises('wall-sit', setLastWallSits);
    }
  }, [user]);

  const fetchLastExercises = async (type: string, setState: React.Dispatch<React.SetStateAction<ExerciseRecord[]>>) => {
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
    } else if (pushupValue <= 0) {
      setMessage('Please enter a positive number of pushups.');
      return;
    }

    try {
      const response = await supabase
        .from('exercises')
        .insert([{ type: 'pushup', count: pushupValue, user_id: user.id }]);

      if (response.error) throw response.error;

      setMessage('Pushup record saved successfully!');
      setPushupCount('');
      fetchLastExercises('pushup', setLastPushups);
    } catch (error: any) {
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
    } else if (wallSitValue <= 0) {
      setMessage('Please enter a positive duration for the wall sit.');
      return;
    }

    try {
      const response = await supabase
        .from('exercises')
        .insert([{ type: 'wall-sit', duration: wallSitValue, count: 1, user_id: user.id }]);

      if (response.error) throw response.error;

      setMessage('Wall sit recorded successfully!');
      setWallSitDuration('');
      fetchLastExercises('wall-sit', setLastWallSits);
    } catch (error: any) {
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handleWallSitDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallSitDuration(e.target.value);
  };

  const handleEdit = (type: string) => {
    setModalType(type);
    setModalRecords(type === 'pushup' ? lastPushups : lastWallSits);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('Record deleted successfully!');
      setModalOpen(false);
      fetchLastExercises(modalType, modalType === 'pushup' ? setLastPushups : setLastWallSits);
    } catch (error: any) {
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      for (const record of modalRecords) {
        const { error } = await supabase
          .from('exercises')
          .update({
            count: record.type === 'pushup' ? record.count : undefined,
            duration: record.type === 'wall-sit' ? record.duration : undefined
          })
          .eq('id', record.id);

        if (error) throw error;
      }

      setMessage('Records updated successfully!');
      setModalOpen(false);
      fetchLastExercises(modalType, modalType === 'pushup' ? setLastPushups : setLastWallSits);
    } catch (error: any) {
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {user ? (
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 px-2">
            <h1 className="text-3xl font-bold mb-6 text-center">Record Your Exercises</h1>
            <form onSubmit={handlePushupSubmit} className="mb-5 bg-white p-4 shadow-md rounded-md">
              <label htmlFor="pushupCount" className="block mb-2 font-bold">Pushups Count:</label>
              <input
                type="number"
                id="pushupCount"
                value={pushupCount}
                onChange={handlePushupChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded-md"
                placeholder="Enter Pushups"
                min="1"
              />
              <button type="submit" className="button w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Record Pushups
              </button>
            </form>
            <form onSubmit={handleWallSitSubmit} className="mb-5 bg-white p-4 shadow-md rounded-md">
              <label className="block mb-2 font-bold">Wall Sit Duration (seconds):</label>
              <input
                type="number"
                value={wallSitDuration}
                onChange={handleWallSitDurationChange}
                className="w-full p-2 mb-3 border border-gray-300 rounded-md"
                placeholder="Enter duration in seconds"
                min="1"
              />
              <button type="submit" className="button w-full p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Record Wall Sit
              </button>
            </form>
            {message && <div className="message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">{message}</div>}
          </div>
          <div className="w-full lg:w-1/2 px-2">
            <div className="mb-4 mt-6">
              <h2 className="text-2xl font-bold mb-4 text-left">Last 5 Pushups</h2>
            </div>

            <table className="w-full bg-white shadow-md rounded-md text-xs table-auto border-collapse border border-gray-400" style={{ width: '70%', fontSize: '12px', padding: '4px' }}>
              <thead>
                <tr>
                  <th className="p-1 border border-gray-400 text-center">Date</th>
                  <th className="p-1 border border-gray-400 text-center">Count</th>
                  <th className="p-1 border border-gray-400 text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                {lastPushups.map((record) => (
                  <tr key={record.id}>
                    <td className="p-1 border border-gray-400 text-center">{new Date(record.created_at).toLocaleDateString()}</td>
                    <td className="p-1 border border-gray-400 text-center">{record.count}</td>
                    <td className="p-1 border border-gray-400 text-center">
                      <button onClick={() => handleEdit('pushup')} className="text-blue-600 hover:text-blue-800 p-1" style={{ padding: '2px', fontSize: '10px' }}>
                        <i className="fa fa-edit" aria-hidden="true" style={{ fontSize: '10px' }}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mb-4 mt-6">
              <h2 className="text-2xl font-bold mb-4 text-left">Last 5 Wall Sits</h2>
            </div>
            <table className="w-full bg-white shadow-md rounded-md text-xs table-auto border-collapse border border-gray-400" style={{ width: '70%', fontSize: '12px', padding: '4px' }}>
              <thead>
                <tr>
                  <th className="p-1 border border-gray-400 text-center">Date</th>
                  <th className="p-1 border border-gray-400 text-center">Duration (seconds)</th>
                  <th className="p-1 border border-gray-400 text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                {lastWallSits.map((record) => (
                  <tr key={record.id}>
                    <td className="p-1 border border-gray-400 text-center">{new Date(record.created_at).toLocaleDateString()}</td>
                    <td className="p-1 border border-gray-400 text-center">{record.duration}</td>
                    <td className="p-1 border border-gray-400 text-center">
                      <button onClick={() => handleEdit('wall-sit')} className="text-blue-600 hover:text-blue-800 p-1" style={{ padding: '2px', fontSize: '10px' }}>
                        <i className="fa fa-edit" aria-hidden="true" style={{ fontSize: '10px' }}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Please Log In</h1>
          <p className="text-gray-600">You need to log in to record your exercises.</p>
          <button
            className="button w-full p-2 mt-4 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/auth')}
          >
            Go to Login
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Last 5 {modalType === 'pushup' ? 'Pushups' : 'Wall Sits'}</h2>
            <form onSubmit={handleUpdate}>
              {modalRecords.map((record, index) => (
                <div key={record.id} className="mb-3">
                  <label className="block mb-1 font-bold">Record {index + 1}:</label>
                  {modalType === 'pushup' ? (
                    <input
                      type="number"
                      value={record.count}
                      onChange={(e) => {
                        const updatedRecords = [...modalRecords];
                        updatedRecords[index].count = parseInt(e.target.value);
                        setModalRecords(updatedRecords);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md text-xs"
                      min="1"
                    />
                  ) : (
                    <input
                      type="number"
                      value={record.duration}
                      onChange={(e) => {
                        const updatedRecords = [...modalRecords];
                        updatedRecords[index].duration = parseInt(e.target.value);
                        setModalRecords(updatedRecords);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md text-xs"
                      min="1"
                    />
                  )}
                  <button type="button" onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-800 text-xs mt-1">Delete</button>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button type="submit" className="button p-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-xs">
                  Update
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="button p-2 rounded-md text-white bg-gray-600 hover:bg-gray-700 text-xs">
                  Cancel
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
