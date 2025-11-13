import type { CollectionConfig } from 'payload';

export const ThemeSettings: CollectionConfig = {
  slug: 'theme-settings',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['site', 'theme', 'primaryColor', 'darkModeEnabled'],
  },
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
    },
    {
      name: 'theme',
      type: 'relationship',
      relationTo: 'themes',
      required: true,
    },
    {
      name: 'primaryColor',
      type: 'text',
    },
    {
      name: 'palette',
      type: 'json',
    },
    {
      name: 'darkModeEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'typography',
      type: 'json',
    },
    {
      name: 'layout',
      type: 'json',
    },
  ],
  access: {
    read: () => true,
  },
};
