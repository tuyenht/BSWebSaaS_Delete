import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'roles', 'status', 'lastLoginAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        'saasOwner',
        'saasAdmin',
        'siteOwner',
        'siteAdmin',
        'siteEditor',
        'siteTranslator',
        'siteViewer',
      ],
    },
    {
      name: 'tenants',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: true,
    },
    {
      name: 'sites',
      type: 'relationship',
      relationTo: 'sites',
      hasMany: true,
    },
    {
      name: 'adminLanguage',
      type: 'select',
      required: true,
      defaultValue: 'vi',
      options: ['vi', 'en', 'ja', 'zh'],
    },
    {
      name: 'twoFactorEnabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'twoFactorVerifiedAt',
      type: 'date',
    },
    {
      name: 'lastLoginAt',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: ['active', 'suspended', 'invited'],
    },
  ],
  access: {
    read: () => true,
  },
};
