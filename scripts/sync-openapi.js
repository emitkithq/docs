#!/usr/bin/env node

/**
 * Sync OpenAPI Specification
 *
 * Fetches the latest OpenAPI spec from production and merges it with
 * our custom x-codeSamples for SDK examples.
 */

const fs = require('fs');
const path = require('path');

const OPENAPI_URL = 'https://api.emitkit.com/api/openapi.json';
const OUTPUT_PATH = path.join(__dirname, '../api-reference/openapi.json');

// SDK examples to preserve
const SDK_EXAMPLES = {
  '/v1/events': {
    post: {
      'x-codeSamples': [
        {
          lang: 'javascript',
          label: 'Create Event',
          source: `import { EmitKit } from '@emitkit/js';
const client = new EmitKit('emitkit_xxxxxxxxxxxxxxxxxxxxx');

const result = await client.events.create({
  channelName: 'payments',
  title: 'Payment Received',
  description: 'User upgraded to Pro plan',
  icon: '💰',
  metadata: {
    amount: 99.99,
    currency: 'USD'
  }
});

console.log('Event created:', result.data.id);`
        },
        {
          lang: 'javascript',
          label: 'With User ID',
          source: `import { EmitKit } from '@emitkit/js';
const client = new EmitKit('emitkit_xxxxxxxxxxxxxxxxxxxxx');

await client.events.create({
  channelName: 'user-signups',
  title: 'New User Registered',
  userId: 'user_123',
  notify: true,
  displayAs: 'notification',
  tags: ['signup', 'onboarding']
});`
        },
        {
          lang: 'javascript',
          label: 'With Idempotency',
          source: `import { EmitKit } from '@emitkit/js';
const client = new EmitKit('emitkit_xxxxxxxxxxxxxxxxxxxxx');

const result = await client.events.create(
  {
    channelName: 'payments',
    title: 'Payment Received',
    metadata: { paymentId: 'pay_123' }
  },
  { idempotencyKey: 'payment-pay_123-webhook' }
);

// Check if this was a replay
console.log('Was replayed:', result.wasReplayed);`
        },
        {
          lang: 'bash',
          label: 'cURL',
          source: `curl -X POST https://api.emitkit.com/v1/events \\
  -H "Authorization: Bearer emitkit_xxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channelName": "payments",
    "title": "Payment Received",
    "description": "User upgraded to Pro plan",
    "icon": "💰",
    "metadata": {
      "amount": 99.99,
      "currency": "USD"
    }
  }'`
        }
      ]
    }
  },
  '/v1/identify': {
    post: {
      'x-codeSamples': [
        {
          lang: 'javascript',
          label: 'Identify User',
          source: `import { EmitKit } from '@emitkit/js';
const client = new EmitKit('emitkit_xxxxxxxxxxxxxxxxxxxxx');

await client.identify({
  user_id: 'user_123',
  properties: {
    email: 'john@example.com',
    name: 'John Doe',
    plan: 'pro'
  },
  aliases: ['john@example.com', 'johndoe']
});`
        },
        {
          lang: 'javascript',
          label: 'Update Properties',
          source: `import { EmitKit } from '@emitkit/js';
const client = new EmitKit('emitkit_xxxxxxxxxxxxxxxxxxxxx');

// Properties are replaced, not merged
await client.identify({
  user_id: 'user_123',
  properties: {
    email: 'john@example.com',
    plan: 'enterprise',
    seats: 50,
    upgradeDate: '2025-01-20'
  }
});`
        },
        {
          lang: 'javascript',
          label: 'Use Aliases in Events',
          source: `import { EmitKit } from '@emitkit/js';
const client = new EmitKit('emitkit_xxxxxxxxxxxxxxxxxxxxx');

// First, create aliases
await client.identify({
  user_id: 'user_123',
  properties: { email: 'john@example.com' },
  aliases: ['john@example.com', 'johndoe']
});

// Then use aliases in events - automatically resolved!
await client.events.create({
  channelName: 'user-activity',
  title: 'User Logged In',
  userId: 'john@example.com',  // ← Alias works!
  metadata: { ip: '192.168.1.1' }
});`
        },
        {
          lang: 'bash',
          label: 'cURL',
          source: `curl -X POST https://api.emitkit.com/v1/identify \\
  -H "Authorization: Bearer emitkit_xxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "properties": {
      "email": "john@example.com",
      "name": "John Doe",
      "plan": "pro"
    },
    "aliases": [
      "john@example.com",
      "johndoe"
    ]
  }'`
        }
      ]
    }
  }
};

async function fetchOpenAPI() {
  console.log('Fetching OpenAPI spec from:', OPENAPI_URL);

  try {
    const response = await fetch(OPENAPI_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const spec = await response.json();
    console.log('✓ Fetched OpenAPI spec');

    return spec;
  } catch (error) {
    console.error('✗ Failed to fetch OpenAPI spec:', error.message);
    process.exit(1);
  }
}

function mergeSDKExamples(spec) {
  console.log('Merging SDK examples...');

  for (const [path, methods] of Object.entries(SDK_EXAMPLES)) {
    if (spec.paths[path]) {
      for (const [method, data] of Object.entries(methods)) {
        if (spec.paths[path][method]) {
          spec.paths[path][method]['x-codeSamples'] = data['x-codeSamples'];
          console.log(`  ✓ Added x-codeSamples to ${method.toUpperCase()} ${path}`);
        }
      }
    }
  }

  return spec;
}

function saveOpenAPI(spec) {
  console.log('Saving to:', OUTPUT_PATH);

  try {
    const formatted = JSON.stringify(spec, null, 2);
    fs.writeFileSync(OUTPUT_PATH, formatted + '\n', 'utf8');
    console.log('✓ OpenAPI spec saved successfully');
  } catch (error) {
    console.error('✗ Failed to save OpenAPI spec:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('🔄 Syncing OpenAPI specification...\n');

  const spec = await fetchOpenAPI();
  const enhanced = mergeSDKExamples(spec);
  saveOpenAPI(enhanced);

  console.log('\n✅ OpenAPI sync complete!');
}

main();
