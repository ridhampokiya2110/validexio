const fs = require('fs');
const path = require('path');

const data1Path = path.join(__dirname, 'data1.json');
const data2Path = path.join(__dirname, 'data2.json');
const destPath = path.join(__dirname, '..', 'lib', 'data', 'competitors.ts');

const data1 = JSON.parse(fs.readFileSync(data1Path, 'utf8'));
const data2 = JSON.parse(fs.readFileSync(data2Path, 'utf8'));

const combined = [...data1, ...data2];

const fileContent = `export interface DeepFeature {
  name: string;
  pill: string;
  validexio: {
    title: string;
    impact: string;
  };
  competitor: {
    title: string;
  };
}

export interface ComparisonSection {
  id: string;
  title: string;
  subtitle: string;
  features: DeepFeature[];
}

export interface PipelineStage {
  id: number;
  name: string;
  iconName: "Lightbulb" | "FileText" | "Code2" | "Users";
  competitorHas: boolean;
  validexioHas: boolean;
  description: string;
}

export interface CompetitorPipeline {
  description: string;
  stages: PipelineStage[];
}

export interface Competitor {
  id: string;
  name: string;
  slug: string;
  heroHeadline: string;
  heroSubheadline: string;
  targetOutputCompetitor: string;
  pipeline?: CompetitorPipeline;
  sections: ComparisonSection[];
}

export const competitors: Competitor[] = ${JSON.stringify(combined, null, 2)};
`;

fs.writeFileSync(destPath, fileContent, 'utf8');
console.log("Successfully rewrote competitors.ts");
