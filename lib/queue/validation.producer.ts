import { Queue } from "bullmq";

// In a real application, you would use Redis URL from environment variables
// Using Upstash Redis URL or standard Redis URL
const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || "",
};

// Create a new queue instance for validation jobs
export const validationQueue = new Queue("ValidationAIProcessing", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export interface ValidationJobPayload {
  sessionId: string;
  industry: string;
  businessIdea: string;
  targetScope?: string;
  targetCountry?: string;
  targetState?: string;
  targetCity?: string;
  pricingModel: string;
  isPriority?: boolean;
}

/**
 * Dispatches a new job to the BullMQ queue for heavy Data Engine processing
 */
export async function dispatchValidationJob(payload: ValidationJobPayload) {
  try {
    // Priority 1 = Paid (skip the line), Priority 10 = Free (wait in line)
    const priority = payload.isPriority ? 1 : 10;
    const job = await validationQueue.add("processIntake", payload, { priority });
    return job.id;
  } catch (error) {
    console.error("Failed to enqueue validation job:", error);
    throw error;
  }
}
