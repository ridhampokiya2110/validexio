"use client";

interface MetricsRowProps {
  tam: string;
  sam: string;
  som: string;
  cagr: string;
}

export function MetricsRow({ tam, sam, som, cagr }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <MetricCard label="Total Market (TAM)" value={tam} />
      <MetricCard label="Serviceable Market (SAM)" value={sam} />
      <MetricCard label="Obtainable Market (SOM)" value={som} />
      <MetricCard label="Compound Annual Growth (CAGR)" value={cagr} />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#1B1716]/10 rounded-xl p-4 sm:p-5 text-center shadow-sm flex flex-col justify-center items-center min-h-[120px] break-words overflow-hidden min-w-0">
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1B1716] tracking-tight mb-2">{value}</p>
      <p className="text-[10px] font-bold text-[#1B1716]/50 uppercase tracking-widest">{label}</p>
    </div>
  );
}
