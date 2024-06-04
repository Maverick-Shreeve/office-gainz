import React, { useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

interface Props {}

const Record: React.FC<Props> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pushupCount, setPushupCount] = useState<string>('');
  const [wallSitDuration, setWallSitDuration] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      console.log("Fetched session on mount or router change:", data.session);
      setUser(data.session?.user ?? null);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed, new session data:", session);
      setUser(session?.user ?? null);
    });

    return () => {
      if (listener && listener.subscription) {
        console.log("Unsubscribing auth listener");
        listener.subscription.unsubscribe();
      }
    };
  }, [router.asPath]);

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
    } catch (error: any) {
      console.error('Error recording pushups:', error);
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
    } catch (error: any) {
      console.error('Error recording wall sit:', error);
      setMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handleWallSitDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallSitDuration(e.target.value);
  };

  return (
    <div className="container mx-auto p-6">
      {user ? (
        <>
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
        </>
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
    </div>
  );
};

export default Record;
