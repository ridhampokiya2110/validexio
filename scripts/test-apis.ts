import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { PrismaClient } from "@prisma/client";

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

// 1. Manually load env variables from .env and .env.local
function loadEnv() {
  const envFiles = [".env", ".env.local"];
  let loadedCount = 0;

  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const firstEquals = trimmed.indexOf("=");
          const key = trimmed.substring(0, firstEquals).trim();
          let val = trimmed.substring(firstEquals + 1).trim();
          // Strip quotes
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      });
      loadedCount++;
    }
  }
  console.log(`${colors.cyan}Loaded ${loadedCount} environment file(s).${colors.reset}\n`);
}

// Helper to mask API keys for display
function maskKey(key?: string): string {
  if (!key) return "NOT FOUND";
  if (key.length <= 8) return "PRESENT (Too short)";
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

async function runTests() {
  console.log(`${colors.bold}${colors.cyan}===============================================`);
  console.log("          VALIDEXIO AI API TEST UTILITY");
  console.log(`===============================================${colors.reset}\n`);

  loadEnv();

  // Initialize tests array
  const results: { name: string; status: "SUCCESS" | "FAILED" | "SKIPPED"; details: string; latency?: number }[] = [];

  // ─── TEST 1: GEMINI API ───
  console.log(`${colors.bold}Testing Google Gemini API...${colors.reset}`);
  const geminiKey = process.env.GEMINI_API_KEY;
  console.log(`Key: ${colors.dim}${maskKey(geminiKey)}${colors.reset}`);
  
  if (!geminiKey) {
    results.push({ name: "Google Gemini API", status: "SKIPPED", details: "GEMINI_API_KEY not configured in env" });
    console.log(`${colors.yellow}Skipped: No API key found.${colors.reset}\n`);
  } else {
    // We will test the primary model used in the codebase: gemini-3.5-flash
    const testModels = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest"];
    let success = false;
    
    for (const testModel of testModels) {
      try {
        const start = Date.now();
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: testModel });
        
        const response = await model.generateContent("Say 'hello' in one word.");
        const text = response.response.text().trim();
        const latency = Date.now() - start;
        
        results.push({ 
          name: `Google Gemini API (${testModel})`, 
          status: "SUCCESS", 
          details: `Connected successfully. Response: "${text}"`,
          latency 
        });
        console.log(`${colors.green}✓ Success with ${testModel} (${latency}ms): "${text}"${colors.reset}`);
        success = true;
        break; // Stop at first success
      } catch (err: any) {
        console.log(`${colors.dim}Tried ${testModel}: failed (${err.message || err})${colors.reset}`);
      }
    }

    if (!success) {
      // Fetch available models to diagnose
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await res.json();
        const available = data.models ? data.models.map((m: any) => m.name.replace("models/", "")).join(", ") : "None";
        results.push({ 
          name: "Google Gemini API", 
          status: "FAILED", 
          details: `All models failed. Available models for this key: ${available}` 
        });
        console.log(`${colors.red}✗ Failed: Available models are [${available}]${colors.reset}\n`);
      } catch (e) {
        results.push({ name: "Google Gemini API", status: "FAILED", details: "Connection failed completely" });
        console.log(`${colors.red}✗ Failed completely.${colors.reset}\n`);
      }
    } else {
      console.log("");
    }
  }

  // ─── TEST 2: CEREBRAS API ───
  console.log(`${colors.bold}Testing Cerebras AI API...${colors.reset}`);
  const cerebrasKey = process.env.CEREBRAS_API_KEY;
  console.log(`Key: ${colors.dim}${maskKey(cerebrasKey)}${colors.reset}`);

  if (!cerebrasKey) {
    results.push({ name: "Cerebras AI API", status: "SKIPPED", details: "CEREBRAS_API_KEY not configured in env" });
    console.log(`${colors.yellow}Skipped: No API key found.${colors.reset}\n`);
  } else {
    // Codebase uses llama3.1-70b. Let's see if we can use it or fallback models
    const testModels = ["llama3.1-70b", "llama3.1-8b", "zai-glm-4.7", "gemma-4-31b"];
    let success = false;

    for (const testModel of testModels) {
      try {
        const start = Date.now();
        const client = new Cerebras({ apiKey: cerebrasKey });
        const response = await client.chat.completions.create({
          model: testModel,
          messages: [{ role: "user", content: "Say 'hello' in one word." }],
          max_completion_tokens: 10,
          temperature: 0.1,
        });
        const text = (response.choices?.[0]?.message?.content || "").trim();
        const latency = Date.now() - start;

        results.push({ 
          name: `Cerebras AI API (${testModel})`, 
          status: "SUCCESS", 
          details: `Connected successfully. Response: "${text}"`,
          latency 
        });
        console.log(`${colors.green}✓ Success with ${testModel} (${latency}ms): "${text}"${colors.reset}`);
        success = true;
        break; // Stop at first success
      } catch (err: any) {
        console.log(`${colors.dim}Tried ${testModel}: failed (${err.message || err})${colors.reset}`);
      }
    }

    if (!success) {
      try {
        const res = await fetch("https://api.cerebras.ai/v1/models", {
          headers: { "Authorization": `Bearer ${cerebrasKey}` }
        });
        const data = await res.json();
        const available = data.data ? data.data.map((m: any) => m.id).join(", ") : "None";
        results.push({ 
          name: "Cerebras AI API", 
          status: "FAILED", 
          details: `All models failed. Available models for this key: ${available}` 
        });
        console.log(`${colors.red}✗ Failed: Available models are [${available}]${colors.reset}\n`);
      } catch (e) {
        results.push({ name: "Cerebras AI API", status: "FAILED", details: "Connection failed completely" });
        console.log(`${colors.red}✗ Failed completely.${colors.reset}\n`);
      }
    } else {
      console.log("");
    }
  }

  // ─── TEST 3: TAVILY SEARCH API ───
  console.log(`${colors.bold}Testing Tavily Search API...${colors.reset}`);
  const tavilyKey = process.env.TAVILY_API_KEY;
  console.log(`Key: ${colors.dim}${maskKey(tavilyKey)}${colors.reset}`);

  if (!tavilyKey) {
    results.push({ name: "Tavily Search API", status: "SKIPPED", details: "TAVILY_API_KEY not configured in env" });
    console.log(`${colors.yellow}Skipped: No API key found.${colors.reset}\n`);
  } else {
    try {
      const start = Date.now();
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query: "latest tech startups 2025",
          max_results: 1,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const latency = Date.now() - start;
      const resultCount = data.results?.length || 0;

      results.push({
        name: "Tavily Search API",
        status: "SUCCESS",
        details: `Connected successfully. Fetched ${resultCount} search result(s).`,
        latency,
      });
      console.log(`${colors.green}✓ Success (${latency}ms): Found ${resultCount} result(s).${colors.reset}\n`);
    } catch (err: any) {
      results.push({ name: "Tavily Search API", status: "FAILED", details: err.message || String(err) });
      console.log(`${colors.red}✗ Failed: ${err.message || err}${colors.reset}\n`);
    }
  }

  // ─── TEST 4: SERPAPI SEARCH API ───
  console.log(`${colors.bold}Testing SerpApi (Google Search) API...${colors.reset}`);
  const serpapiKey = process.env.SERPAPI_API_KEY;
  console.log(`Key: ${colors.dim}${maskKey(serpapiKey)}${colors.reset}`);

  if (!serpapiKey) {
    results.push({ name: "SerpApi Search API", status: "SKIPPED", details: "SERPAPI_API_KEY not configured in env" });
    console.log(`${colors.yellow}Skipped: No API key found.${colors.reset}\n`);
  } else {
    try {
      const start = Date.now();
      const res = await fetch(`https://serpapi.com/search.json?q=test&api_key=${serpapiKey}&num=1`);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const latency = Date.now() - start;
      const errorMsg = data.error;

      if (errorMsg) {
        throw new Error(`SerpApi response error: ${errorMsg}`);
      }

      const resultCount = data.organic_results?.length || 0;
      results.push({
        name: "SerpApi Search API",
        status: "SUCCESS",
        details: `Connected successfully. Fetched ${resultCount} search result(s).`,
        latency,
      });
      console.log(`${colors.green}✓ Success (${latency}ms): Found ${resultCount} result(s).${colors.reset}\n`);
    } catch (err: any) {
      results.push({ name: "SerpApi Search API", status: "FAILED", details: err.message || String(err) });
      console.log(`${colors.red}✗ Failed: ${err.message || err}${colors.reset}\n`);
    }
  }

  // ─── TEST 5: PRISMA DATABASE ───
  console.log(`${colors.bold}Testing Prisma Database Connection...${colors.reset}`);
  const dbUrl = process.env.DATABASE_URL;
  console.log(`URL: ${colors.dim}${maskKey(dbUrl)}${colors.reset}`);

  if (!dbUrl) {
    results.push({ name: "Prisma Database", status: "SKIPPED", details: "DATABASE_URL not configured in env" });
    console.log(`${colors.yellow}Skipped: No URL found.${colors.reset}\n`);
  } else {
    const prisma = new PrismaClient();
    try {
      const start = Date.now();
      await prisma.$connect();
      // Execute a basic query
      const userCount = await prisma.user.count();
      const latency = Date.now() - start;

      results.push({
        name: "Prisma Database",
        status: "SUCCESS",
        details: `Connected successfully. Database contains ${userCount} users.`,
        latency,
      });
      console.log(`${colors.green}✓ Success (${latency}ms): Database contains ${colors.bold}${userCount}${colors.reset}${colors.green} users.${colors.reset}\n`);
    } catch (err: any) {
      results.push({ name: "Prisma Database", status: "FAILED", details: err.message || String(err) });
      console.log(`${colors.red}✗ Failed: ${err.message || err}${colors.reset}\n`);
    } finally {
      await prisma.$disconnect();
    }
  }

  // ─── FINAL REPORT ───
  console.log(`\n${colors.bold}${colors.cyan}===============================================`);
  console.log("                 SUMMARY REPORT");
  console.log(`===============================================${colors.reset}`);

  results.forEach((r) => {
    let statusText = "";
    if (r.status === "SUCCESS") {
      statusText = `${colors.green}${colors.bold}[ SUCCESS ]${colors.reset}`;
    } else if (r.status === "FAILED") {
      statusText = `${colors.red}${colors.bold}[ FAILED  ]${colors.reset}`;
    } else {
      statusText = `${colors.yellow}${colors.bold}[ SKIPPED ]${colors.reset}`;
    }

    const latencyText = r.latency ? ` (${r.latency}ms)` : "";
    console.log(`${statusText} ${colors.bold}${r.name}${colors.reset}${colors.dim}${latencyText}${colors.reset}`);
    console.log(`          Details: ${colors.dim}${r.details}${colors.reset}\n`);
  });

  const allPassed = results.every((r) => r.status !== "FAILED");
  if (allPassed) {
    console.log(`${colors.green}${colors.bold}🎉 All active APIs connected successfully!${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}⚠️ Some API connections failed. Please check your env credentials and quotas above.${colors.reset}`);
  }
}

runTests().catch(console.error);
