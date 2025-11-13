import type { CollectionConfig } from 'payload';

export const Themes: CollectionConfig = {
  slug: 'themes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['key', 'name', 'version', 'isActive'],
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'version',
      type: 'text',
    },
    {
      name: 'config',
      type: 'json',
    },
    {
      name: 'pageBlueprints',
      type: 'json',
    },
    {
      name: 'defaultSections',
      type: 'json',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  access: {
    read: () => true,
  },
};
