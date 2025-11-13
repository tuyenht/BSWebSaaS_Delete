import type { CollectionConfig } from 'payload';

export const AutomationRuns: CollectionConfig = {
  slug: 'automation-runs',
  fields: [
    { name: 'rule', type: 'relationship', relationTo: 'automation-rules' },
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    {
      name: 'status',
      type: 'select',
      options: ['success', 'failed', 'skipped'],
      defaultValue: 'success',
    },
    { name: 'error', type: 'textarea' },
    { name: 'input', type: 'json' },
    { name: 'output', type: 'json' },
    { name: 'latencyMs', type: 'number' },
  ],
  access: {
    read: () => true,
  },
};
