import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const competitors = [
  {
    slug: 'preuve',
    name: 'Preuve AI',
    basePrice: '₹1,199 one-time',
    dataSourceType: '50+ live sources',
    reportFormatStyle: '15 sections',
    primaryStrength: 'Source-linked claims, multi-run cross-checks, and analytics.',
    fatalTradeoff: 'Evidence report only. Completely lacks code execution or pre-launch workspaces.',
    verifiableSourcesScore: 7,
    hasLiveSources: true,
    hasPivotLogic: true,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: false,
    specificAttackVector: 'Preuve proves the market exists, then leaves you with a reading assignment. Validexio hands you the functional database schema, outbound messaging, and the frontend codebase to capture it.'
  },
  {
    slug: 'dimeadozen',
    name: 'DimeADozen',
    basePrice: 'From $129',
    dataSourceType: 'Web search + GPT-4 static records',
    reportFormatStyle: '40+ page PDF',
    primaryStrength: 'Longest written reports with public filing comp-sets.',
    fatalTradeoff: 'Extremely expensive single-report pricing. Zero multi-run validation cross-checks.',
    verifiableSourcesScore: 4,
    hasLiveSources: true,
    hasPivotLogic: false,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: false,
    specificAttackVector: 'DimeADozen charges a premium for a massive, unformatted information dump. Validexio strips the text bloat and gives you pure, actionable technical infrastructure components.'
  },
  {
    slug: 'pitchbob',
    name: 'PitchBob',
    basePrice: 'From $29.90',
    dataSourceType: '150K static investor database',
    reportFormatStyle: 'Pitch deck + Canvas plan',
    primaryStrength: 'Strong boilerplate pitch deck assembly for venture capital pitches.',
    fatalTradeoff: 'Pitch deck layout generator first, objective validation second. No live external source verification.',
    verifiableSourcesScore: 3,
    hasLiveSources: false,
    hasPivotLogic: false,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: true,
    specificAttackVector: 'PitchBob trains you to ask investors for money before you prove you can build anything. Validexio is for elite engineers and self-funded bootstrappers who prioritize revenue generation over venture pitching.'
  },
  {
    slug: 'ideaproof',
    name: 'IdeaProof',
    basePrice: 'From €24.99',
    dataSourceType: 'AI-generated base tokens',
    reportFormatStyle: '10 sections, 20+ pages',
    primaryStrength: 'Flexible credit tiers with 90 introductory validation credits.',
    fatalTradeoff: 'Zero trace links or clickable evidence. No verifiable methodology or trusted public platform reviews.',
    verifiableSourcesScore: 1,
    hasLiveSources: false,
    hasPivotLogic: false,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: false,
    specificAttackVector: 'IdeaProof drops an AI-generated text document and vanity branding tools. Validexio outputs fully compilable technical boilerplate schemas and active sales funnels.'
  },
  {
    slug: 'tryverdikt',
    name: 'Verdikt',
    basePrice: '$49.99 one-time',
    dataSourceType: '35-50 cited sources',
    reportFormatStyle: 'One-page 5-section memo',
    primaryStrength: 'Transparent risk assessment thresholds and analytical scoring math.',
    fatalTradeoff: 'Free tier is strictly limited to an isolated rating metric. Deep report access requires steep entry payment.',
    verifiableSourcesScore: 6,
    hasLiveSources: true,
    hasPivotLogic: false,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: false,
    specificAttackVector: 'Verdikt limits their output to a flat, single-page summary memo. Validexio scales across both analytical execution strategies and full deployment assets.'
  },
  {
    slug: 'validatorai',
    name: 'ValidatorAI',
    basePrice: '$49 for 3 sessions',
    dataSourceType: 'AI-generated inference',
    reportFormatStyle: 'Interactive chat interface',
    primaryStrength: 'Conversational prompt environment allowing basic follow-up questions.',
    fatalTradeoff: 'Pure model text answers operating blindly with absolutely zero real-time market data backing them up.',
    verifiableSourcesScore: 1,
    hasLiveSources: false,
    hasPivotLogic: false,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: false,
    specificAttackVector: 'ValidatorAI behaves like a standard chatbot wrapper giving generic chat feedback. Validexio provides precise cloud specifications and lead data.'
  },
  {
    slug: 'painmap',
    name: 'PainMap',
    basePrice: '$29-$99/mo',
    dataSourceType: 'Community web forums',
    reportFormatStyle: 'Single-page pain clusters',
    primaryStrength: 'Extracts organic, unprompted customer frustrations directly from live Reddit threads.',
    fatalTradeoff: 'Niche problem discovery map only. Does not provide technical viability testing or go-to-market mechanics.',
    verifiableSourcesScore: 5,
    hasLiveSources: true,
    hasPivotLogic: false,
    hasNextjsBoilerplate: false,
    hasAwsBlueprints: false,
    hasApolloLeads: false,
    specificAttackVector: 'PainMap maps crowd complaints but offers zero paths to resolving them. Validexio synthesizes market gaps and delivers immediate technical answers.'
  }
];

async function main() {
  console.log('Seeding competitor matrices...');
  
  for (const comp of competitors) {
    await prisma.competitorMatrix.upsert({
      where: { slug: comp.slug },
      update: comp,
      create: comp,
    });
    console.log(`Upserted competitor: ${comp.name}`);
  }
  
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
