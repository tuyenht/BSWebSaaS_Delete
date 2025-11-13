import type { CollectionConfig } from 'payload';

export const AiSettings: CollectionConfig = {
  slug: 'ai-settings',
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
    },
    {
      name: 'provider',
      type: 'select',
      options: ['openai', 'azure', 'other'],
      defaultValue: 'openai',
    },
    {
      name: 'model',
      type: 'text',
      defaultValue: 'gpt-4.1-mini',
    },
    {
      name: 'apiKeyMode',
      type: 'select',
      options: ['global', 'perSite'],
      defaultValue: 'global',
    },
    {
      name: 'siteApiKey',
      type: 'text',
    },
    {
      name: 'maxTokensPerRequest',
      type: 'number',
      defaultValue: 2000,
    },
    {
      name: 'dailyTokenLimit',
      type: 'number',
    },
    {
      name: 'featuresEnabled',
      type: 'group',
      fields: [
        { name: 'seo', type: 'checkbox', defaultValue: true },
        { name: 'translate', type: 'checkbox', defaultValue: true },
        { name: 'summary', type: 'checkbox', defaultValue: true },
        { name: 'assistantChat', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
  access: {
    read: () => true,
  },
};
