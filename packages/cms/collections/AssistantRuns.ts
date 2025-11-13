import type { CollectionConfig } from 'payload';

export const AssistantRuns: CollectionConfig = {
  slug: 'assistant-runs',
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    {
      name: 'type',
      type: 'select',
      options: ['seo', 'translate', 'summary', 'chat'],
    },
    { name: 'model', type: 'text' },
    { name: 'tokensPrompt', type: 'number' },
    { name: 'tokensCompletion', type: 'number' },
    { name: 'tokensTotal', type: 'number' },
    { name: 'request', type: 'json' },
    { name: 'response', type: 'json' },
  ],
  access: {
    read: () => true,
  },
};
