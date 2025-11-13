import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  admin: {
    useAsTitle: 'filename',
  },
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
      name: 'alt',
      type: 'text',
    },
    {
      name: 'folder',
      type: 'text',
    },
    {
      name: 'width',
      type: 'number',
    },
    {
      name: 'height',
      type: 'number',
    },
  ],
  access: {
    read: () => true,
  },
};
