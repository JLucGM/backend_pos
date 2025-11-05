import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DeliveryTypeChart({ data }) {
  // Transformar los datos en formato adecuado para Recharts
  const chartData = Object.keys(data).map(key => ({
    type: key.charAt(0).toUpperCase() + key.slice(1), // Capitalizar (e.g., "Delivery")
    Cantidad: data[key],
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}