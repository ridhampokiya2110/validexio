"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface PremiumRevenueChartProps {
  year1: string;
  year2: string;
  year3: string;
}

const parseValue = (val: string) => {
  if (!val || val === "-") return 0;
  const cleanStr = val.replace(/[^0-9.]/g, "");
  let num = parseFloat(cleanStr);
  if (isNaN(num)) return 0;

  const hasBillion = /[0-9.]+\s*(B|BILLION)\b/i.test(val);
  const hasMillion = /[0-9.]+\s*(M|MILLION)\b/i.test(val);
  const hasThousand = /[0-9.]+\s*(K|THOUSAND)\b/i.test(val);

  // Only apply multiplier if the parsed number is small (e.g., 1.5). 
  // If it's already 100000, it doesn't need a multiplier even if the string has an 'm' (like '100000/mo').
  if (num < 1000) {
    if (hasBillion) {
      num *= 1000000000;
    } else if (hasMillion) {
      num *= 1000000;
    } else if (hasThousand) {
      num *= 1000;
    }
  }

  return num;
};

const formatCurrency = (val: number) => {
  if (val >= 1000000) {
    return `$${(val / 1000000).toFixed(1)}M`;
  } else if (val >= 1000) {
    return `$${(val / 1000).toFixed(0)}k`;
  }
  return `$${val}`;
};

export function PremiumRevenueChart({ year1, year2, year3 }: PremiumRevenueChartProps) {
  const data = useMemo(() => {
    return [
      { name: "Year 1", revenue: parseValue(year1) },
      { name: "Year 2", revenue: parseValue(year2) },
      { name: "Year 3", revenue: parseValue(year3) },
    ];
  }, [year1, year2, year3]);

  // Determine if we have actual data to show
  const hasData = data.some(d => d.revenue > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-400 text-sm font-medium">Insufficient data for chart projection</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#630102]/5 to-[#ff4d4f]/5 rounded-full blur-[80px] -z-10 group-hover:bg-[#630102]/10 transition-colors duration-1000"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Projection</h3>
          <p className="text-gray-500 text-xs font-medium mt-1">3-Year ARR Forecast</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <div className="w-2 h-2 rounded-full bg-[#630102] shadow-[0_0_8px_rgba(99,1,2,0.6)] animate-pulse"></div>
          <span className="text-xs font-bold text-gray-700 tracking-wider uppercase">Live</span>
        </div>
      </div>

      <div className="h-56 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#630102" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#630102" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
              tickFormatter={formatCurrency}
              width={50}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '16px',
                border: '1px solid #F3F4F6',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
                backdropFilter: 'blur(8px)'
              }}
              itemStyle={{ color: '#111827', fontWeight: 800, fontSize: '16px' }}
              labelStyle={{ color: '#6B7280', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}
              formatter={(value: number) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value), 'Projected ARR']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#630102" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 8, fill: "#630102", stroke: "#FFFFFF", strokeWidth: 3 }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
