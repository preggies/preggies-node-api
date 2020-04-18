export default {
  title: 'Users document',
  type: 'object',
  properties: {
    users: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fullname: {
            type: 'string',
          },
          email: {
            description: 'User email address',
            type: 'string',
          },
          uuid: {
            description: 'User ID',
            type: 'string',
          },
          dob: {
            description: 'Date of birth',
            type: 'string',
          },
        },
      },
    },
  },
};
