import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface ExerciseRecord {
  id: number;
  type: string;
  count: number;
  duration?: number;
  created_at: string;
}

interface ExerciseSummary {
  total_reps: number; // Total pushups or wall-sit reps
  total_duration: number; // Total duration for wall-sit
  sets: number; // Count of entries for each type
}

const Progress: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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
            acc[type] = { total_reps: 0, total_duration: 0, sets: 0 };
          }
          acc[type].total_reps += Number(count);
          acc[type].total_duration += Number(duration);
          acc[type].sets += 1;
          return acc;
        }, {});
        setExerciseSummary(summary);
        setLoading(false);
      }
    };

    fetchExercises();
  }, [user, router]);

  const renderChart = () => {
    const labels = Object.keys(exerciseSummary);
    const dataReps = labels.map(type => exerciseSummary[type].total_reps);
    const dataDuration = labels.map(type => type === 'wall-sit' ? (exerciseSummary[type].total_duration / 60).toFixed(2) : exerciseSummary[type].total_duration); //tofixed2 so it moves 2 decimal places over for minutes
    const dataSets = labels.map(type => exerciseSummary[type].sets);

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Total Reps',
          data: dataReps,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          datalabels: {
            anchor: 'center' as const,
            align: 'center' as const,
            color: 'black',
            font: {
              weight: 'bold' as const
            },
            formatter: (value: number) => value.toLocaleString(),
          }
        },
        {
          label: 'Total Duration (minutes)',
          data: dataDuration,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          datalabels: {
            anchor: 'center' as const,
            align: 'center' as const,
            color: 'black',
            font: {
              weight: 'bold' as const
            },
            formatter: (value: number) => value.toLocaleString(),
          }
        },
        {
          label: 'Total Sets',
          data: dataSets,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          datalabels: {
            anchor: 'center' as const,
            align: 'center' as const,
            color: 'black',
            font: {
              weight: 'bold' as const
            },
            formatter: (value: number) => value.toLocaleString(),
          }
        }
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        datalabels: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'decimal' }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };

  const renderPushupTable = () => (
    <table className="table-auto mx-auto mt-6">
      <thead>
        <tr>
          <th className="px-4 py-2">Exercise</th>
          <th className="px-4 py-2">Total Reps</th>
          <th className="px-4 py-2">Total Sets</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(exerciseSummary).filter(([type]) => type === 'pushup').map(([type, { total_reps, sets }]) => (
          <tr key={type}>
            <td className="border px-4 py-2">{type}</td>
            <td className="border px-4 py-2">{total_reps}</td>
            <td className="border px-4 py-2">{sets}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderWallSitTable = () => (
    <table className="table-auto mx-auto mt-6">
      <thead>
        <tr>
          <th className="px-4 py-2">Exercise</th>
          <th className="px-4 py-2">Total Duration (minutes)</th>
          <th className="px-4 py-2">Total Sets</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(exerciseSummary).filter(([type]) => type === 'wall-sit').map(([type, { total_duration, sets }]) => (
          <tr key={type}>
            <td className="border px-4 py-2">{type}</td>
            <td className="border px-4 py-2">{(total_duration / 60).toFixed(2)}</td>
            <td className="border px-4 py-2">{sets}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return <div className="container mx-auto text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto text-center mt-10">
        <h1 className="text-3xl font-bold mb-6">Exercise Progress</h1>
        <p>Once you've logged in, this page will show you your progress.</p>
        <div className="outline mt-4 p-4 border-2 border-dashed border-gray-400">
          <h2 className="text-2xl font-semibold">Outline:</h2>
          <ul>
            <li>Pushups: [Total Reps] reps, [Total Sets] sets</li>
            <li>Wall sit: [Total Reps] reps, total duration: [Total Duration] seconds</li>
          </ul>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto text-center mt-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Exercise Progress</h1>
      {Object.keys(exerciseSummary).length > 0 ? (
        <>
          {renderChart()}
          {renderPushupTable()}
          {renderWallSitTable()}
        </>
      ) : (
        <p>No exercise records found.</p>
      )}
    </div>
  );
};

export default Progress;
