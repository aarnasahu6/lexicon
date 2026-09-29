import { z } from "zod";
export const LanguageSchema = z.enum([
  "Hindi / Hinglish",
  "Spanish",
  "English",
]);
export type Language = z.infer<typeof LanguageSchema>;
export const ProfileSchema = z.object({
  language: LanguageSchema,
  stage: z.enum(["Student", "Intern", "New Grad", "Professional"]),
  field: z.enum(["Finance", "Accounting", "Consulting", "General Business"]),
});
export type Profile = z.infer<typeof ProfileSchema>;
export const ConceptSchema = z.object({
  term: z.string().min(1).max(120),
  definition: z.string().min(1).max(1500),
  localizedExplanation: z.string().min(1).max(1500),
  example: z.string().max(1500),
});
export const ResultSchema = z.object({
  responseKind: z.enum(["scenario", "glossary"]).default("scenario"),
  simpleMeaning: z.string().min(1).max(3000),
  professionalVersion: z.string().max(3000),
  concepts: z.array(ConceptSchema).min(1).max(22),
  localizedExplanation: z.string().min(1).max(3000),
  whyItMatters: z.string().min(1).max(3000),
});
export type Result = z.infer<typeof ResultSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type SavedTerm = Concept & {
  id: string;
  learned: boolean;
  created_at: string;
};
export type History = {
  id: string;
  action_type: "bridge" | "understand";
  input_text: string;
  output: Result;
  created_at: string;
};
export type ExplanationRequest = Profile & {
  action: "bridge" | "understand";
  input: string;
};
export type Store = {
  profile: Profile | null;
  saved: SavedTerm[];
  history: History[];
};
