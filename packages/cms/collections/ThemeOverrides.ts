import type { CollectionConfig } from 'payload';

export const ThemeOverrides: CollectionConfig = {
  slug: 'theme-overrides',
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
    },
    {
      name: 'theme',
      type: 'relationship',
      relationTo: 'themes',
    },
    {
      name: 'target',
      type: 'select',
      options: ['section', 'page', 'global'],
    },
    {
      name: 'targetKey',
      type: 'text',
    },
    {
      name: 'overrides',
      type: 'json',
    },
  ],
  access: {
    read: () => true,
  },
};
