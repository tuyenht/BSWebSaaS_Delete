import type { CollectionConfig } from 'payload';

export const Extensions: CollectionConfig = {
  slug: 'extensions',
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'type',
      type: 'select',
      options: ['block', 'integration', 'theme'],
    },
    { name: 'configSchema', type: 'json' },
    { name: 'version', type: 'text' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
  access: {
    read: () => true,
  },
};
