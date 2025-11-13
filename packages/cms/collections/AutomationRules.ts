import type { CollectionConfig } from 'payload';

export const AutomationRules: CollectionConfig = {
  slug: 'automation-rules',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      options: ['form.submit', 'lead.created', 'post.published', 'export.completed'],
    },
    { name: 'conditions', type: 'json' },
    {
      name: 'actions',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: ['email', 'webhook', 'ai.reply', 'ai.summary', 'ai.seo', 'ai.translate', 'log'],
        },
        { name: 'config', type: 'json' },
      ],
    },
    { name: 'runAs', type: 'relationship', relationTo: 'users' },
  ],
  access: {
    read: () => true,
  },
};