import { Worker } from 'bullmq';
import { processValidationJob } from '../lib/queue/processJob';
import * as dotenv from 'dotenv';

// Load environment variables for local testing (Railway loads them automatically)
dotenv.config({ path: '.env.local' });
dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
};

console.log('👷 Starting ValidationAIProcessing Worker...');
console.log(`🔌 Connecting to Redis at ${connection.host}:${connection.port}`);

// Process jobs with a concurrency limit
// Concurrency: 200 ensures massive parallel processing now that Gemini Pay-as-you-go tier is active
const worker = new Worker(
  'ValidationAIProcessing',
  async (job) => {
    console.log(`[Worker] Picked up job ${job.id} for Idea: ${job.data.ideaId}`);
    try {
      // Execute the heavy LLM and API workflow
      const result = await processValidationJob(
        { ideaId: job.data.ideaId, userId: job.data.userId },
        job.id
      );
      console.log(`[Worker] Successfully completed job ${job.id}`);
      return result;
    } catch (error) {
      console.error(`[Worker] Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 200, // Safely handles 200 users validating simultaneously
  }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} has failed with ${err.message}`);
});

worker.on('error', (err) => {
  console.error('🚨 Worker Error:', err);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
