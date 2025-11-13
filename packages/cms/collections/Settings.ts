import type { CollectionConfig } from 'payload';

export const Settings: CollectionConfig = {
  slug: 'settings',
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        { name: 'titleTemplate', type: 'text' },
        { name: 'defaultDescription', type: 'textarea' },
        { name: 'defaultImage', type: 'relationship', relationTo: 'media' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'address', type: 'text' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'advanced',
      type: 'json',
    },
  ],
  access: {
    read: () => true,
  },
};
