import type { CollectionConfig } from 'payload';

export const DemoContentSets: CollectionConfig = {
  slug: 'demo-content-sets',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'theme', type: 'relationship', relationTo: 'themes' },
    { name: 'data', type: 'json' },
  ],
  access: {
    read: () => true,
  },
};
