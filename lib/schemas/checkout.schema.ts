import { z } from "zod";

export const checkoutSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID format."),
  tier: z.enum(["STARTER", "PRO"], {
    errorMap: () => ({ message: "Tier must be STARTER or PRO." }),
  }),
}).strict();

export type CheckoutSchemaType = z.infer<typeof checkoutSchema>;
