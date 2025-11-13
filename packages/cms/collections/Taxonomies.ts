import type { CollectionConfig } from 'payload';

export const Taxonomies: CollectionConfig = {
  slug: 'taxonomies',
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
    },
    {
      name: 'type',
      type: 'select',
      options: ['category', 'tag', 'industry'],
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'locale',
      type: 'text',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'taxonomies',
    },
    {
      name: '_status',
      type: 'select',
      options: ['draft', 'published'],
      defaultValue: 'draft',
    },
  ],
  access: {
    read: () => true,
  },
};
