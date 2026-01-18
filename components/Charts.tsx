import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface WeeklyData {
  day: string;
  completed: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card shadow-sm border-0 p-2 rounded-3 text-center" style={{ fontSize: '0.75rem' }}>
        <p className="fw-bold mb-0 text-body">{label}</p>
        <p className="text-primary mb-0">{`${payload[0].value} Habits`}</p>
      </div>
    );
  }
  return null;
};

export const WeeklyProgressChart: React.FC<{ data: WeeklyData[] }> = ({ data }) => {
  return (
    <div className="w-100 mt-3" style={{ height: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            // Use CSS variable for body color to adapt to theme, ensuring dark text in light mode
            tick={{ fill: 'var(--bs-body-color)', fontSize: 10, opacity: 0.8, fontWeight: 500 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--bs-body-color)', fontSize: 10, opacity: 0.8, fontWeight: 500 }} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="completed" radius={[4, 4, 4, 4]} barSize={20}>
            {data.map((entry, index) => (
              // Use brand indigo colors instead of generic purple
              <Cell key={`cell-${index}`} fill={entry.completed >= 3 ? '#6366f1' : '#a5b4fc'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CompletionPieChart: React.FC<{ rate: number, label: string, color: string }> = ({ rate, label, color }) => {
  const data = [
    { name: 'Completed', value: rate },
    { name: 'Remaining', value: 100 - rate },
  ];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center position-relative">
        <div style={{ height: '130px', width: '130px' }}>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
            >
                <Cell fill={color} />
                <Cell fill="#e9ecef" /> 
            </Pie>
            </PieChart>
        </ResponsiveContainer>
        </div>
        <div className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center justify-content-center pe-none">
            <span className="h4 fw-bold mb-0 text-body">{Math.round(rate)}%</span>
            <span className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>{label}</span>
        </div>
    </div>
  );
};