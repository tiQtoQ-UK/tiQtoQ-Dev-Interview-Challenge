export type RiskLevel = "Low" | "Medium" | "High";

export type RiskSignal = {
  label: string;
  weight: number;
  areas: string[];
  testingActivities: string[];
};

export type ChangeRiskAnalysis = {
  riskLevel: RiskLevel;
  impactedAreas: string[];
  recommendedTesting: string[];
  rationale: string[];
};

export type ChangeRiskRequest = {
  description: string;
};

export type ChangeRiskResponse = {
  analysis: ChangeRiskAnalysis;
};

export type ApiErrorResponse = {
  error: string;
};
