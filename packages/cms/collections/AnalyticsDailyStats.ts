import type { CollectionConfig } from 'payload';

export const AnalyticsDailyStats: CollectionConfig = {
  slug: 'analytics-daily-stats',
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'date', type: 'date', required: true },
    { name: 'pageviews', type: 'number', defaultValue: 0 },
    { name: 'uniqueVisitors', type: 'number', defaultValue: 0 },
    { name: 'leads', type: 'number', defaultValue: 0 },
    { name: 'forms', type: 'number', defaultValue: 0 },
    { name: 'automationRuns', type: 'number', defaultValue: 0 },
    { name: 'exports', type: 'number', defaultValue: 0 },
    { name: 'aiTokens', type: 'number', defaultValue: 0 },
  ],
  access: {
    read: () => true,
  },
};
