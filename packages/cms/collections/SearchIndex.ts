import type { CollectionConfig } from 'payload';

export const SearchIndex: CollectionConfig = {
  slug: 'search-index',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    {
      name: 'collection',
      type: 'select',
      options: ['posts', 'products', 'pages'],
      required: true,
    },
    { name: 'docId', type: 'text', required: true },
    { name: 'locale', type: 'text' },
    { name: 'slug', type: 'text' },
    { name: 'title', type: 'text' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'path', type: 'text' },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'value', type: 'text' }],
    },
    { name: 'publishedAt', type: 'date' },
  ],
  access: {
    read: () => true,
  },
};
