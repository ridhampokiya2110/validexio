import { CheckCircle2, AlertCircle } from "lucide-react";
import { FairAssessment as FairAssessmentType } from "@/lib/data/competitors";

interface FairAssessmentProps {
  competitorName: string;
  data: FairAssessmentType;
}

export function FairAssessment({ competitorName, data }: FairAssessmentProps) {
  if (!data) return null;

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto border-t border-[#1B1716]/10">
      <div className="text-center mb-12">
        <span className="badge badge-cherry mb-4">Objectivity</span>
        <h2 className="text-3xl md:text-4xl font-black text-[#1B1716] tracking-tight mb-4">
          A Fair Assessment of {competitorName}
        </h2>
        <p className="text-lg text-[#1B1716]/70 max-w-2xl mx-auto">
          {data.description}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {data.pros.map((pro, idx) => (
          <div key={idx} className="bg-white border border-[#1B1716]/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-[#1B1716]">{pro.title}</h3>
            <p className="text-[#1B1716]/70 text-sm leading-relaxed">
              {pro.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#75070C]/5 border border-[#75070C]/20 rounded-2xl p-8 flex gap-4 items-start">
        <AlertCircle className="w-6 h-6 text-[#75070C] shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-lg text-[#75070C] mb-2">The Catch</h4>
          <p className="text-[#1B1716]/80 leading-relaxed">
            While {competitorName} is great at what it does, it stops at the starting line. It gives you research, plans, or grades—but it doesn't build your product. Validation without execution is just hallucination.
          </p>
        </div>
      </div>
    </section>
  );
}
