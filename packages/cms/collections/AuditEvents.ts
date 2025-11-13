import type { CollectionConfig } from 'payload';

export const AuditEvents: CollectionConfig = {
  slug: 'audit-events',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'user', 'site', 'createdAt'],
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    {
      name: 'type',
      type: 'select',
      options: [
        'login',
        'logout',
        'loginFailed',
        'create',
        'update',
        'delete',
        'publish',
        'export',
        'permissionChange',
      ],
    },
    { name: 'collection', type: 'text' },
    { name: 'docId', type: 'text' },
    { name: 'meta', type: 'json' },
  ],
  access: {
    read: () => true,
  },
};
