"use client";
import { useState } from "react";
import Link from "next/link";
import { Calculator, Zap, ArrowRight, DollarSign, Users, TrendingUp } from "lucide-react";

export function TamCalculator() {
  const [totalMarket, setTotalMarket] = useState<number | string>(10000);
  const [targetSegment, setTargetSegment] = useState<number | string>(20);
  const [marketShare, setMarketShare] = useState<number | string>(5);
  const [arpu, setArpu] = useState<number | string>(1200);
  const [cac, setCac] = useState<number | string>(400);
  const [grossMargin, setGrossMargin] = useState<number | string>(80);

  const calculateTAM = () => Number(totalMarket) * Number(arpu);
  const calculateSAM = () => calculateTAM() * (Number(targetSegment) / 100);
  const calculateSOM = () => calculateSAM() * (Number(marketShare) / 100);
  
  const calculateCustomersNeeded = () => Math.ceil(calculateSOM() / Number(arpu));
  const calculateMRR = () => calculateSOM() / 12;
  const calculateLTV = () => Number(arpu) * 3;
  const calculateLtvCacRatio = () => (calculateLTV() * (Number(grossMargin) / 100)) / Number(cac);
  const calculatePaybackMonths = () => Number(cac) / ((Number(arpu) / 12) * (Number(grossMargin) / 100));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/40 backdrop-blur-md border border-[#1B1716]/10 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-cherry/10 rounded-full flex items-center justify-center mr-4">
          <Calculator className="w-6 h-6 text-cherry" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[#1B1716]">
          Interactive TAM / SAM / SOM Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Total Potential Customers (TAM)
            </label>
            <input 
              type="number"
              value={totalMarket}
              onChange={(e) => setTotalMarket(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#1B1716]/20 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cherry focus:border-transparent outline-none transition-all"
              placeholder="e.g. 10000"
            />
            <p className="text-xs text-[#1B1716]/50 mt-1">Total global universe of people who could use your product.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Annual Revenue Per User (ARPU)
            </label>
            <input 
              type="number"
              value={arpu}
              onChange={(e) => setArpu(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#1B1716]/20 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cherry focus:border-transparent outline-none transition-all"
              placeholder="e.g. 1200"
            />
            <p className="text-xs text-[#1B1716]/50 mt-1">Average $ earned per customer per year.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
              Target Segment % (SAM)
            </label>
            <input 
              type="number"
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#1B1716]/20 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cherry focus:border-transparent outline-none transition-all"
              placeholder="e.g. 20"
            />
            <p className="text-xs text-[#1B1716]/50 mt-1">The % of the TAM you can practically reach.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
              Realistic Market Share % (SOM)
            </label>
            <input 
              type="number"
              value={marketShare}
              onChange={(e) => setMarketShare(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#1B1716]/20 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cherry focus:border-transparent outline-none transition-all"
              placeholder="e.g. 5"
            />
            <p className="text-xs text-[#1B1716]/50 mt-1">The % of the SAM you can realistically capture in years 1-3.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
              Customer Acquisition Cost (CAC)
            </label>
            <input 
              type="number"
              value={cac}
              onChange={(e) => setCac(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#1B1716]/20 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cherry focus:border-transparent outline-none transition-all"
              placeholder="e.g. 400"
            />
            <p className="text-xs text-[#1B1716]/50 mt-1">Average marketing & sales cost to win 1 customer.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1B1716]/80 mb-2">
              Gross Margin %
            </label>
            <input 
              type="number"
              value={grossMargin}
              onChange={(e) => setGrossMargin(e.target.value)}
              className="w-full bg-[#FDFCF8] border border-[#1B1716]/20 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cherry focus:border-transparent outline-none transition-all"
              placeholder="e.g. 80"
            />
            <p className="text-xs text-[#1B1716]/50 mt-1">Percentage of revenue left after direct costs (hosting, API limits).</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#1B1716] text-[#FDFCF8] rounded-xl p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">Total Addressable Market (TAM)</p>
              <h3 className="text-3xl md:text-4xl font-black text-white">{formatCurrency(calculateTAM())}</h3>
              <p className="text-xs text-[#FDFCF8]/40 mt-1">The total market demand.</p>
            </div>
            
            <div>
              <p className="text-sm text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">Serviceable Available Market (SAM)</p>
              <h3 className="text-3xl md:text-4xl font-black text-white">{formatCurrency(calculateSAM())}</h3>
              <p className="text-xs text-[#FDFCF8]/40 mt-1">The segment targeted by your products/services.</p>
            </div>
            
            <div className="bg-cherry/20 border border-cherry/30 rounded-lg p-4">
              <p className="text-sm text-cherry-light font-semibold uppercase tracking-wider flex items-center mb-1">
                <TrendingUp className="w-4 h-4 mr-2" />
                Serviceable Obtainable Market (SOM)
              </p>
              <h3 className="text-4xl md:text-5xl font-black text-cherry-light">{formatCurrency(calculateSOM())}</h3>
              <p className="text-xs text-cherry-light/70 mt-1">Your realistic revenue target.</p>
            </div>
            
            {/* New Added Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-[#FDFCF8]/10">
              <div>
                 <p className="text-[10px] text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">Customers Needed</p>
                 <h4 className="text-xl md:text-2xl font-black text-white">{calculateCustomersNeeded().toLocaleString()}</h4>
                 <p className="text-[10px] text-[#FDFCF8]/40 mt-1">To hit your SOM target.</p>
              </div>
              <div>
                 <p className="text-[10px] text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">Target MRR</p>
                 <h4 className="text-xl md:text-2xl font-black text-white">{formatCurrency(calculateMRR())}</h4>
                 <p className="text-[10px] text-[#FDFCF8]/40 mt-1">Monthly Recurring Revenue.</p>
              </div>
              <div>
                 <p className="text-[10px] text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">LTV Goal</p>
                 <h4 className="text-xl md:text-2xl font-black text-white">{formatCurrency(calculateLTV())}</h4>
                 <p className="text-[10px] text-[#FDFCF8]/40 mt-1">Assuming 3-year retention.</p>
              </div>
              <div>
                 <p className="text-[10px] text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">LTV:CAC Ratio</p>
                 <h4 className={`text-xl md:text-2xl font-black ${calculateLtvCacRatio() >= 3 ? 'text-emerald-400' : 'text-orange-400'}`}>
                   {calculateLtvCacRatio().toFixed(1)}:1
                 </h4>
                 <p className="text-[10px] text-[#FDFCF8]/40 mt-1">Over 3:1 is excellent.</p>
              </div>
              <div>
                 <p className="text-[10px] text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">Payback Period</p>
                 <h4 className={`text-xl md:text-2xl font-black ${calculatePaybackMonths() <= 12 ? 'text-emerald-400' : 'text-orange-400'}`}>
                   {calculatePaybackMonths().toFixed(1)} mo
                 </h4>
                 <p className="text-[10px] text-[#FDFCF8]/40 mt-1">Months to recover CAC.</p>
              </div>
              <div>
                 <p className="text-[10px] text-[#FDFCF8]/60 font-semibold uppercase tracking-wider mb-1">Gross Margin MRR</p>
                 <h4 className="text-xl md:text-2xl font-black text-white">{formatCurrency(calculateMRR() * (Number(grossMargin) / 100))}</h4>
                 <p className="text-[10px] text-[#FDFCF8]/40 mt-1">MRR after direct costs.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#FDFCF8]/10 text-center">
            <p className="text-sm text-[#FDFCF8]/80 mb-4 font-medium">
              Want the exact database schema and React code to capture this market?
            </p>
            <Link href="/" className="btn-primary w-full inline-flex items-center justify-center py-3">
              Generate My Startup Assets
              <Zap className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
