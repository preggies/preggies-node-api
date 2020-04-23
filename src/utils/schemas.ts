export const makeMetaRequestPayloadSchema = (validate): object => ({
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
