import type { CollectionConfig } from 'payload';

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['site', 'form', 'status', 'createdAt'],
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'form', type: 'relationship', relationTo: 'forms' },
    { name: 'locale', type: 'text' },
    { name: 'data', type: 'json' },
    {
      name: 'status',
      type: 'select',
      options: ['new', 'inProgress', 'won', 'lost'],
      defaultValue: 'new',
    },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'source', type: 'text' },
    { name: 'summary', type: 'textarea' },
    { name: 'aiReply', type: 'textarea' },
  ],
  access: {
    read: () => true,
  },
};
