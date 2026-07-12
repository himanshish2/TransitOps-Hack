import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FleetUtilizationChart({ data = [] }) {
  return (
    <div className="surface-card h-100">
      <h2 className="fs-6 fw-semibold mb-3">Fleet Utilization Trend</h2>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--primary-orange)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: 'var(--primary-orange)' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
