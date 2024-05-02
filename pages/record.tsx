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

    // listener for auth state changes
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

    if (!user) {
      setMessage('No user logged in.');
      return;
    }

    try {
      const response = await supabase
        .from('exercises')
        .insert([
          { type: 'pushup', count: parseInt(pushupCount), user_id: user.id },
        ]);

      if (response.error) throw response.error;

      setMessage('Pushup record saved successfully!');
      setPushupCount('');
    } catch (error: any) {
      console.error('Error recording pushup:', error);
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  const handlePushupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPushupCount(e.target.value);
  };

  const handleWallSitSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('No user logged in.');
      return;
    }

    try {
      const response = await supabase
        .from('exercises')
        .insert([
          { type: 'wall-sit', duration: parseInt(wallSitDuration), user_id: user.id },
        ]);

      if (response.error) throw response.error;

      setMessage('Wall sit recorded successfully!');
      setWallSitDuration('');
    } catch (error: any) {
      console.error('Error recording wall sit:', error);
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    }
  };

  const handleWallSitDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallSitDuration(e.target.value);
  };

  return (
    <div className="container">
      <form onSubmit={handlePushupSubmit} className="mb-5">
        <label htmlFor="pushupCount" className="block mb-2 font-bold">Pushups Count:</label>
        <input
          type="number"
          id="pushupCount"
          value={pushupCount}
          onChange={handlePushupChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded-md"
          placeholder="Enter Pushups"
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
};

export default Record;