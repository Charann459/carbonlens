import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ErrorBar 
} from 'recharts';

// Custom Tooltip styled for dark mode
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const rawData = payload[0].payload.originalData;
    
    const getConfidenceColor = (pct) => {
      if (pct > 75) return 'text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]';
      if (pct >= 60) return 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]';
      return 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]';
    };

    return (
      <div className="bg-zinc-900/95 backdrop-blur-md p-4 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.8)] rounded-xl min-w-[200px]">
        <h4 className="font-bold text-white border-b border-white/10 pb-2 mb-3">
          {rawData.description}
        </h4>
        <div className="space-y-2">
          <p className="text-sm text-zinc-400 flex justify-between">
            <span>Estimate:</span> 
            <span className="font-bold text-orange-500">{rawData.co2e_estimate.toLocaleString()} kg</span>
          </p>
          <p className="text-xs text-zinc-500 flex justify-between">
            <span>Min:</span> 
            <span className="text-zinc-300">{rawData.co2e_min.toLocaleString()} kg</span>
          </p>
          <p className="text-xs text-zinc-500 flex justify-between">
            <span>Max:</span> 
            <span className="text-zinc-300">{rawData.co2e_max.toLocaleString()} kg</span>
          </p>
        </div>
        <div className={`mt-4 pt-3 border-t border-white/10 text-xs font-bold ${getConfidenceColor(rawData.confidence_pct)}`}>
          Confidence Level: {rawData.confidence_pct}%
        </div>
      </div>
    );
  }
  return null;
};

const ConfidenceChart = ({ products }) => {
  if (!products || products.length === 0) return null;

  const chartData = products.map(product => {
    const errorMargin = [
      product.co2e_estimate - product.co2e_min,
      product.co2e_max - product.co2e_estimate
    ];

    return {
      name: product.description.length > 20 
        ? product.description.substring(0, 17) + '...' 
        : product.description,
      estimate: product.co2e_estimate,
      errorMargin: errorMargin,
      originalData: product 
    };
  });

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 w-full">
      <div className="mb-8">
        <h3 className="text-3xl font-serif text-white">Emissions by Node</h3>
        <p className="text-sm text-zinc-400/80 mt-2 font-light">90% confidence intervals based on Bayesian disaggregation.</p>
      </div>
      {/* ... The rest of the Recharts BarChart container remains the same ... */}
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            {/* Defining the gradient for the bars (Orange to Amber) */}
            <defs>
              <linearGradient id="colorEstimate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}t`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
            
            <Bar 
              dataKey="estimate" 
              fill="url(#colorEstimate)" 
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            >
              <ErrorBar 
                dataKey="errorMargin" 
                width={10} 
                strokeWidth={2} 
                stroke="#f8fafc" 
                direction="y" 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConfidenceChart;