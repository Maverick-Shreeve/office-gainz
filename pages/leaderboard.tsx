import React, { useState, useEffect, useContext } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { GetServerSideProps } from 'next';
import moment from 'moment';
import { ThemeContext } from '../context/ThemeContext';

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
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { theme } = themeContext;

  useEffect(() => {
    setLeaderboardData(initialData);
  }, [initialData]);

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-dark-background text-white' : 'bg-white'}`}>
      <div className="container mx-auto mt-10 p-6 rounded shadow-lg">
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-black' : 'text-gray-800'}`}>
          Exercise Leaderboard
        </h1>
        <p className={`text-center mb-4 ${theme === 'dark' ? 'text-black' : 'text-gray-600'}`}>
          Ranked by total pushups. The user with the most pushups is at the top.
        </p>
        {leaderboardData.length > 0 ? (
          <table className={`min-w-full table-auto border-collapse ${theme === 'dark' ? 'bg-dark-card' : 'bg-white'}`}>
            <thead>
              <tr>
                <th className={`px-8 py-2 text-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>Rank</th>
                <th className={`px-8 py-2 text-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>User</th>
                <th className={`px-8 py-2 text-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>Total Pushups</th>
                <th className={`px-8 py-2 text-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>Total Duration Wall sit (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <tr key={user.id} className="text-center">
                  <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{index + 1}</td>
                  <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{user.displayName}</td>
                  <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    {user.total_reps}
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}> ({user.sets} sets)</span>
                  </td>
                  <td className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>{Math.round(user.total_duration / 60)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No exercise records found.</p>
        )}
      </div>
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
