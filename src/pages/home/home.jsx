// src/pages/home/Home.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { getAllTasks } from '../../utils/api/tasks/tasks.service';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#FBBF24', '#3B82F6', '#10B981'];
const RADIAN = Math.PI / 180;

// only show labels >0%
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent === 0) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Home() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState([
    { name: 'Pending', value: 0 },
    { name: 'In Progress', value: 0 },
    { name: 'Completed', value: 0 },
  ]);
  const [hasTasks, setHasTasks] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const tasks = await getAllTasks(user.userId);
        if (!tasks?.length) {
          setHasTasks(false);
          return;
        }
        const stats = { Pending: 0, 'In Progress': 0, Completed: 0 };
        tasks.forEach(t => stats[t.status] !== undefined && stats[t.status]++);
        setTaskStats([
          { name: 'Pending', value: stats.Pending },
          { name: 'In Progress', value: stats['In Progress'] },
          { name: 'Completed', value: stats.Completed },
        ]);
        setHasTasks(true);
      } catch {
        setHasTasks(false);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userId) fetchTasks();
  }, [user]);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
      <p className="text-gray-600 mb-6">
        Here’s an overview of your current tasks.
      </p>

      <div className="bg-base-100 shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Task Status Overview</h2>
        <div className="relative h-[300px]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100/75 z-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}

          {!loading && hasTasks && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  key={JSON.stringify(taskStats)}            // force remount on data change
                  data={taskStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={100}
                  animationEasing="ease-out"
                >
                  {taskStats.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          )}

          {!loading && !hasTasks && (
            <div className="flex justify-center items-center h-full text-sm text-gray-500">
              No tasks found. Create a task to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
