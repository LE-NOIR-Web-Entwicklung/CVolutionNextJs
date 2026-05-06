import { validateSalaryAnalysisJson } from "../salary/salaryAnalysisSchema";

const SYSTEM_PROMPT = `Du bist ein erfahrener Compensation-&-Benefits-Consultant für den Schweizer Arbeitsmarkt.
Verwende ausschliesslich bereitgestellte Daten, erfinde keine Marktdaten oder Quellen, nutze Schweizer Rechtschreibung und gib nur valides JSON zurück.`;

export async function generateSalaryAnalysis(input: unknown) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY fehlt");

  for (let i = 0; i < 2; i++) {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_SALARY_ANALYSIS_MODEL || "gpt-5",
        input: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: JSON.stringify(input) }, ...(i === 1 ? [{ role: "user", content: "Return only valid JSON matching the schema." }] : [])],
        text: { format: { type: "json_object" } },
      }),
    });
    const data = await res.json();
    const parsed = JSON.parse(data.output_text || "{}");
    const valid = validateSalaryAnalysisJson(parsed);
    if (valid.ok) return parsed;
  }

  throw new Error("Ungültiger JSON-Output von OpenAI");
}
