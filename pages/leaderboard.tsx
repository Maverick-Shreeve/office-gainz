import React, { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { GetServerSideProps } from 'next';
import moment from 'moment';

interface ExerciseRecord {
  user_id: string;
  type: string;
  count: number;
  duration?: number;
  created_at: string;
}

interface UserWithResults {
  id: string;
  displayName: string;
  total_reps: number;
  total_duration: number;
  sets: number;
}

interface LeaderboardProps {
  initialData: UserWithResults[];
}

const extractNameFromFullName = (fullName: string): string => {
  const match = fullName.match(/\(([^)]+)\)/);
  return match ? match[1] : fullName;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ initialData }) => {
  const [leaderboardData, setLeaderboardData] = useState<UserWithResults[]>(initialData);

  useEffect(() => {
    setLeaderboardData(initialData);
  }, [initialData]);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Exercise Leaderboard</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
        Ranked by total pushups. The user with the most pushups is at the top.
      </p>
      {leaderboardData.length > 0 ? (
        <table className="min-w-full bg-white dark:bg-gray-800 table-auto">
        <thead>
          <tr>
            <th className="px-8 py-2 text-center border-b border-gray-200 dark:border-gray-700">Rank</th>
            <th className="px-8 py-2 text-center border-b border-gray-200 dark:border-gray-700">User</th>
            <th className="px-8 py-2 text-center border-b border-gray-200 dark:border-gray-700">Total Pushups</th>
            <th className="px-8 py-2 text-center border-b border-gray-200 dark:border-gray-700">Total Duration (minutes)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={user.id} className="text-center">
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{index + 1}</td>
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{user.displayName}</td>
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                {user.total_reps}
                <span className="text-xs text-gray-600 dark:text-gray-300"> ({user.sets} sets)</span>
              </td>
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{Math.round(user.total_duration / 60)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">No exercise records found.</p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  if (!supabaseAdmin) {
    console.error('Supabase admin client is not initialized.');
    return { props: { initialData: [] } };
  }

  try {
    const { data: exerciseData, error: exerciseError } = await supabaseAdmin
      .from('exercises')
      .select('*');

    if (exerciseError) {
      console.error('Error fetching exercises:', exerciseError);
      return { props: { initialData: [] } };
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error('Error fetching user profiles:', userError);
      return { props: { initialData: [] } };
    }

    const userResults: Record<string, UserWithResults> = {};

    exerciseData.forEach((record: ExerciseRecord) => {
      if (!userResults[record.user_id]) {
        const user = userData.users.find((u: any) => u.id === record.user_id);
        const fullName = user?.user_metadata?.full_name || 'Unknown';
        const displayName = extractNameFromFullName(fullName);

        userResults[record.user_id] = {
          id: record.user_id,
          displayName,
          total_reps: 0,
          total_duration: 0,
          sets: 0,
        };
      }
      userResults[record.user_id].total_reps += Number(record.count);
      userResults[record.user_id].total_duration += Number(record.duration || 0);
      userResults[record.user_id].sets += 1;
    });

    const leaderboardArray = Object.values(userResults).sort((a, b) => b.total_reps - a.total_reps);

    return { props: { initialData: leaderboardArray } };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { props: { initialData: [] } };
  }
};

export default Leaderboard;
