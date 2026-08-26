import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export const RadarSkillChart = ({ skillCoverage = [] }) => {
  if (!skillCoverage || skillCoverage.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        No skill data available for chart.
      </div>
    );
  }

  // Format data for Radar chart
  const data = skillCoverage.map(item => ({
    skill: item.skill,
    'Team Coverage': item.coveredProficiency || 0,
    'Target Requirement': item.requiredMin || 60,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <p className="font-bold text-slate-200 mb-1">{payload[0]?.payload?.skill}</p>
          <p className="text-indigo-400">
            Team Proficiency: <span className="font-semibold">{payload[0]?.value}%</span>
          </p>
          <p className="text-pink-400">
            Target Threshold: <span className="font-semibold">{payload[1]?.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Radar
            name="Team Coverage"
            dataKey="Team Coverage"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
          <Radar
            name="Target Requirement"
            dataKey="Target Requirement"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.15}
            strokeDasharray="4 4"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
            formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
