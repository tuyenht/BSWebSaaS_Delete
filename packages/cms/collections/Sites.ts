import type { CollectionConfig } from 'payload';

export const Sites: CollectionConfig = {
  slug: 'sites',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'tenant', 'status'],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'domains',
      type: 'array',
      fields: [
        {
          name: 'host',
          type: 'text',
          required: true,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isStaging',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'locales',
      type: 'array',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'licensed',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'defaultLocale',
      type: 'text',
    },
    {
      name: 'theme',
      type: 'relationship',
      relationTo: 'themes',
    },
    {
      name: 'settings',
      type: 'relationship',
      relationTo: 'settings',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: ['active', 'suspended', 'archived'],
    },
    {
      name: 'exportEnabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  access: {
    read: () => true,
  },
};
