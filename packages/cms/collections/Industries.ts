import type { CollectionConfig } from 'payload';

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'icon', type: 'text' },
  ],
  access: {
    read: () => true,
  },
};
