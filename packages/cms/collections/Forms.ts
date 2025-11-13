import type { CollectionConfig } from 'payload';

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    useAsTitle: 'key',
  },
  fields: [
    { name: 'tenant', type: 'relationship', relationTo: 'tenants' },
    { name: 'site', type: 'relationship', relationTo: 'sites' },
    { name: 'key', type: 'text', required: true },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'fields',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: ['text', 'textarea', 'email', 'phone', 'select', 'checkbox', 'radio', 'file'],
        },
        { name: 'labelKey', type: 'text' },
        { name: 'placeholderKey', type: 'text' },
        { name: 'required', type: 'checkbox', defaultValue: false },
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'select' || siblingData?.type === 'radio',
          },
          fields: [
            { name: 'value', type: 'text' },
            { name: 'labelKey', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'submitHandler',
      type: 'select',
      options: ['lead', 'webhook', 'email'],
      defaultValue: 'lead',
    },
    { name: 'successMessageKey', type: 'text' },
    { name: 'errorMessageKey', type: 'text' },
    { name: 'active', type: 'checkbox', defaultValue: true },
  ],
  access: {
    read: () => true,
  },
};
