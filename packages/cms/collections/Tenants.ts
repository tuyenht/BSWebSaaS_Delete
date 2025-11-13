import type { CollectionConfig } from 'payload';

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'plan', 'isActive'],
  },
  fields: [
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
      name: 'owners',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'plan',
      type: 'select',
      defaultValue: 'free',
      options: ['free', 'pro', 'enterprise'],
    },
    {
      name: 'sitesLimit',
      type: 'number',
    },
    {
      name: 'localesLimit',
      type: 'number',
    },
    {
      name: 'storageLimitMb',
      type: 'number',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
  access: {
    read: () => true,
  },
};
