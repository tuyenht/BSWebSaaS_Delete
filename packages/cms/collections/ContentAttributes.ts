import type { CollectionConfig } from 'payload';

export const ContentAttributes: CollectionConfig = {
  slug: 'content-attributes',
  fields: [
    { name: 'key', type: 'text', required: true, unique: true },
    { name: 'label', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['boolean', 'string', 'number'],
    },
    {
      name: 'defaultValue',
      type: 'text',
    },
  ],
  access: {
    read: () => true,
  },
};
