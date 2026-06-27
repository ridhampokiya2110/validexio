import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const intakeSchema = z.object({
  industry: z.enum(["SaaS", "D2C", "Local Service"], {
    errorMap: () => ({ message: "Invalid industry type." }),
  }),

  businessIdea: z
    .string()
    .min(20, "Business idea must be at least 20 characters.")
    .max(1000, "Business idea must not exceed 1000 characters.")
    .transform((val) => DOMPurify.sanitize(val)),

  targetScope: z.string().optional(),
  targetCountry: z.string().optional(),
  targetState: z.string().optional(),
  targetCity: z.string().optional(),

  pricingModel: z.enum(["One-time", "Subscription", "High-Ticket"], {
    errorMap: () => ({ message: "Invalid pricing model." }),
  }),
}).strict(); // Strips all unlisted keys

export type IntakeSchemaType = z.infer<typeof intakeSchema>;
