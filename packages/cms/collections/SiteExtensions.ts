import type { CollectionConfig } from 'payload';

export const SiteExtensions: CollectionConfig = {
  slug: 'site-extensions',
  fields: [
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'extension', type: 'relationship', relationTo: 'extensions' },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'config', type: 'json' },
    {
      name: 'license',
      type: 'select',
      options: ['free', 'paid', 'trial'],
    },
  ],
  access: {
    read: () => true,
  },
};
