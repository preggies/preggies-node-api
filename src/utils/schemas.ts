import { Root } from 'joi';

export const metaRequestSchema = (validate: Root): object => ({
  active: validate.boolean(),
});

export const metaResponseSchema = {
  meta: {
    description: 'Metadata',
    type: 'object',
    properties: {
      active: {
        type: 'boolean',
      },
      created: {
        type: 'string',
        format: 'date-time',
      },
      updated: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
};

export const errorResponseSchema = {
  error: {
    type: 'object',
    required: ['code', 'message'],
    properties: {
      code: {
        type: 'integer',
        format: 'int32',
      },
      message: {
        type: 'string',
      },
      stack: {
        type: 'string',
      },
      error: {
        type: 'string',
      },
    },
  },
};

export const arraySchema = (template: object): object => ({
  type: 'array',
  items: {
    type: 'object',
    ...template,
  },
});

export interface ResponseTemplate {
  title: string;
  required?: string[];
  properties?: object;
}

export const responseDocumentSchema = ({
  title,
  required,
  properties,
}: ResponseTemplate): object => ({
  title,
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        required,
        properties: {
          ...properties,
          id: {
            type: 'string',
          },
          ...metaResponseSchema,
        },
      },
    },
    ...errorResponseSchema,
  },
});
