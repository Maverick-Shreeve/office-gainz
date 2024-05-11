import React, { useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

interface ExerciseRecord {
  id: number;
  type: string;
  count: number;
  duration?: number;
  created_at: string;
}

interface ExerciseSummary {
  total_count: number;
  total_duration: number;
}

const Progress: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  const [exerciseSummary, setExerciseSummary] = useState<Record<string, ExerciseSummary>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setError('Failed to fetch user session');
        setLoading(false);
        return;
      }
      
      if (data.session && data.session.user) {
        setUser(data.session.user);
      } else {
        setError('User not logged in');
        setLoading(false);
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser(session.user);
      } else {
        setError('User not logged in');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router.asPath]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchExercises = async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching exercises:', error);
        setError('Failed to fetch exercises');
        setLoading(false);
      } else {
        const summary = data.reduce((acc, exercise) => {
          const { type, count, duration = 0 } = exercise;
          if (!acc[type]) {
            acc[type] = { total_count: 0, total_duration: 0 };
          }
          acc[type].total_count += parseInt(count);
          acc[type].total_duration += parseInt(duration);
          return acc;
        }, {});
        setExerciseSummary(summary);
        setLoading(false);
      }
    };

    fetchExercises();
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Exercise Progress</h1>
      {Object.keys(exerciseSummary).length > 0 ? (
        <ul>
          {Object.entries(exerciseSummary).map(([type, { total_count, total_duration }]) => (
            <li key={type}>
              <p>{type}: {total_count} times{total_duration ? `, total duration: ${total_duration} seconds` : ''}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No exercise records found.</p>
      )}
    </div>
  );
};

export default Progress;
