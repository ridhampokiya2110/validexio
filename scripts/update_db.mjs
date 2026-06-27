import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const idea = await prisma.idea.findFirst({
    where: { title: { contains: 'heeratrack', mode: 'insensitive' } },
    include: { reports: true }
  });

  if (!idea || idea.reports.length === 0) {
    console.log('Idea not found in DB');
    return;
  }

  const report = idea.reports[0];
  
  const uiMockupDescriptions = [
    {
      screen: 'Executive Intelligence Console',
      description: 'A bespoke, high-fidelity dark-mode canvas accented with subtle volumetric lighting, delivering an uncompromising executive experience.',
      keyElements: [
        'Real-time Emotional Resonance Matrix (High-Conviction, Cognitive-Load, Deal-Friction)',
        'Kinetic Behavioral Nudges (e.g., "Pacing Deceleration Required", "Price-Sensitivity Threshold Approaching")',
        'Air-Gapped Telemetry Node (Cryptographic Zero-Trust Edge Processing Status)',
        'Granular Heuristic Engagements (Vocal Resonance, Micro-Facial Topography, Lexical Density)',
        'Algorithmic Friction Calibrators for Neural Nudge Frequency'
      ],
      userFlow: 'The founder securely authenticates into the zero-latency console, calibrates the behavioral heuristics, and deploys the air-gapped tracking engine.'
    }
  ];

  const landingPageCopy = {
    headline: 'Orchestrate Your Startup with Algorithmic Precision',
    subheadline: 'The uncompromising, AI-driven intelligence toolkit for founders who demand market dominance.',
    valueProp: 'Deploy bespoke, zero-latency semantic processing engines to transform raw behavioral telemetry into immediate tactical advantages.',
    cta: 'Request Executive Access',
    socialProof: "Powering the execution of the world's most demanding venture-backed engineering teams.",
    features: [
      { title: 'Zero-Latency Insight Engine', description: 'Bypass generic dashboards. Access raw, real-time behavioral streams processed in milliseconds at the edge.' },
      { title: 'Air-Gapped Telemetry', description: 'Absolute privacy. Our zero-trust validation architecture ensures 0 bytes are ever transferred to the cloud.' },
      { title: 'Military-Grade Cryptography', description: 'Your strategic data is secured within an end-to-end encrypted local vault, built to exceed SOC2 Type II standards.' },
      { title: 'Granular Heuristic Controls', description: 'Achieve infinite precision over vocal resonance, micro-facial topography, and lexical density tracking.' },
      { title: 'Direct Neural Integrations', description: 'Seamlessly weave our low-latency infrastructure directly into your existing enterprise stack.' }
    ]
  };

  await prisma.validationReport.update({
    where: { id: report.id },
    data: {
      uiMockupDescriptions,
      landingPageCopy
    }
  });

  console.log('Successfully updated the database with professional, expensive copy!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
