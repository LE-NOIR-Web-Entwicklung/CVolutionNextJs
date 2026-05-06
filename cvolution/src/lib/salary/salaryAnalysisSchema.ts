export function validateSalaryAnalysisJson(payload: any) {
  const required = ["executiveSummary", "currentCompensation", "marketBenchmark", "qualificationAnalysis", "salaryPotential", "recommendations", "negotiationArguments", "wordingExamples", "methodology", "qualityWarnings"];
  for (const key of required) if (!(key in payload)) return { ok: false, error: `Missing ${key}` };
  if (!Array.isArray(payload.qualityWarnings)) return { ok: false, error: "qualityWarnings must be array" };
  return { ok: true } as const;
}
