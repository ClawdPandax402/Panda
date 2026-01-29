# Agent Automation Example

Autonomous payment agent for automated workflows.

---

## Use Case

An AI agent that needs to access paid APIs without human intervention for each payment.

---

## Setup

```bash
npm install @pandax402/sdk @solana/web3.js
```

---

## Basic Agent

```typescript
// agent.ts
import { Pandax402Agent } from '@pandax402/sdk';
import { Keypair, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Create a dedicated agent wallet (never use your main wallet!)
const agentWallet = Keypair.generate();
console.log('Agent wallet:', agentWallet.publicKey.toString());

// Fund the agent wallet (on devnet for testing)
async function fundAgent() {
  const connection = new Connection('https://api.devnet.solana.com');
  const signature = await connection.requestAirdrop(
    agentWallet.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
  console.log('Agent funded with 1 SOL');
}

// Create agent with safety limits
const agent = new Pandax402Agent({
  wallet: agentWallet,
  network: 'devnet',
  
  // Budget controls
  budgetLimit: 0.1,          // Max 0.1 SOL per session
  maxPricePerRequest: 0.01,  // Max 0.01 SOL per request
  dailyLimit: 0.5,           // Max 0.5 SOL per day
  
  // Security
  allowedDomains: ['api.example.com'],
  requireHttps: true,
  
  // Privacy
  privacyMode: false,
});

// Execute paid requests
async function runAgent() {
  await fundAgent();
  
  // Make a paid request
  const response = await agent.execute({
    url: 'https://api.example.com/premium-data',
    method: 'GET',
  });
  
  const data = await response.json();
  console.log('Received:', data);
  console.log('Spent so far:', agent.getSpent(), 'SOL');
  console.log('Budget remaining:', agent.getRemainingBudget(), 'SOL');
}

runAgent().catch(console.error);
```

---

## Data Collection Agent

```typescript
// data-collector.ts
import { Pandax402Agent } from '@pandax402/sdk';

const agent = new Pandax402Agent({
  wallet: agentWallet,
  budgetLimit: 1.0,
  allowedDomains: ['data-api.example.com'],
});

interface DataRecord {
  id: string;
  value: number;
  timestamp: number;
}

async function collectData(ids: string[]): Promise<DataRecord[]> {
  const records: DataRecord[] = [];
  
  for (const id of ids) {
    // Check budget before each request
    if (agent.getRemainingBudget() < 0.001) {
      console.log('Budget low, stopping collection');
      break;
    }
    
    try {
      const response = await agent.execute({
        url: `https://data-api.example.com/record/${id}`,
        method: 'GET',
      });
      
      const record = await response.json();
      records.push(record);
      
      console.log(`Collected ${id}, spent: ${agent.getSpent()} SOL`);
      
    } catch (error) {
      if (error.code === 'BUDGET_EXCEEDED') {
        console.log('Budget exceeded, stopping');
        break;
      }
      throw error;
    }
  }
  
  return records;
}

// Run
const ids = ['rec-001', 'rec-002', 'rec-003', 'rec-004', 'rec-005'];
collectData(ids).then(records => {
  console.log(`Collected ${records.length} records`);
  console.log('Total spent:', agent.getSpent(), 'SOL');
});
```

---

## Scheduled Agent

```typescript
// scheduled-agent.ts
import { Pandax402Agent } from '@pandax402/sdk';
import cron from 'node-cron';

const agent = new Pandax402Agent({
  wallet: agentWallet,
  dailyLimit: 1.0,
  allowedDomains: ['metrics-api.example.com'],
});

// Fetch metrics every hour
cron.schedule('0 * * * *', async () => {
  console.log('Fetching hourly metrics...');
  
  try {
    const response = await agent.execute({
      url: 'https://metrics-api.example.com/hourly',
      method: 'GET',
    });
    
    const metrics = await response.json();
    await saveMetrics(metrics);
    
    console.log('Metrics saved. Daily spend:', agent.getDailySpent(), 'SOL');
    
  } catch (error) {
    if (error.code === 'BUDGET_EXCEEDED') {
      console.log('Daily budget exhausted, skipping until tomorrow');
    } else {
      console.error('Error:', error.message);
    }
  }
});

async function saveMetrics(metrics: any) {
  // Save to database or file
  console.log('Saving metrics:', metrics);
}

console.log('Scheduled agent started. Fetching metrics every hour.');
```

---

## Multi-Service Agent

```typescript
// multi-service-agent.ts
import { Pandax402Agent } from '@pandax402/sdk';

const agent = new Pandax402Agent({
  wallet: agentWallet,
  budgetLimit: 2.0,
  allowedDomains: [
    'api.weather.example.com',
    'api.news.example.com',
    'api.stocks.example.com',
  ],
});

interface DailyReport {
  weather: any;
  headlines: any;
  stocks: any;
}

async function generateDailyReport(): Promise<DailyReport> {
  // Fetch weather
  const weatherRes = await agent.execute({
    url: 'https://api.weather.example.com/today',
    method: 'GET',
  });
  const weather = await weatherRes.json();
  
  // Fetch news
  const newsRes = await agent.execute({
    url: 'https://api.news.example.com/headlines',
    method: 'GET',
  });
  const headlines = await newsRes.json();
  
  // Fetch stocks
  const stocksRes = await agent.execute({
    url: 'https://api.stocks.example.com/market-summary',
    method: 'GET',
  });
  const stocks = await stocksRes.json();
  
  console.log('Report generated. Total spent:', agent.getSpent(), 'SOL');
  
  return { weather, headlines, stocks };
}

generateDailyReport().then(report => {
  console.log('Daily Report:', JSON.stringify(report, null, 2));
});
```

---

## Agent with Error Handling

```typescript
// robust-agent.ts
import { 
  Pandax402Agent,
  BudgetExceededError,
  DomainNotAllowedError,
  PaymentFailedError,
} from '@pandax402/sdk';

const agent = new Pandax402Agent({
  wallet: agentWallet,
  budgetLimit: 0.5,
  retryAttempts: 3,
});

async function safeExecute(url: string) {
  try {
    const response = await agent.execute({ url, method: 'GET' });
    return await response.json();
    
  } catch (error) {
    if (error instanceof BudgetExceededError) {
      console.error('Budget exceeded. Remaining:', agent.getRemainingBudget());
      // Maybe top up wallet or wait for daily reset
      return null;
      
    } else if (error instanceof DomainNotAllowedError) {
      console.error('Domain not in whitelist:', error.domain);
      // Log for review
      return null;
      
    } else if (error instanceof PaymentFailedError) {
      console.error('Payment failed:', error.reason);
      if (error.reason === 'INSUFFICIENT_BALANCE') {
        // Need to add funds
        await topUpWallet();
        // Retry once
        return agent.execute({ url, method: 'GET' }).then(r => r.json());
      }
      return null;
      
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}

async function topUpWallet() {
  // Add more SOL to agent wallet
  console.log('Topping up wallet...');
}
```

---

## Security Best Practices

1. **Dedicated wallet** — Never use your main wallet
2. **Minimum funds** — Only fund what the agent needs
3. **Budget limits** — Set session, per-request, and daily limits
4. **Domain whitelist** — Explicitly list allowed services
5. **Monitoring** — Log all payments for review
6. **Rotation** — Periodically rotate agent wallets
