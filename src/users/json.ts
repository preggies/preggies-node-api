export default {
  title: 'Users document',
  required: ['fullname'],
  properties: {
    fullname: {
      type: 'string',
    },
    email: {
      description: 'User email address',
      type: 'string',
    },
    role: {
      description: 'User role',
      type: 'string',
    },
    dob: {
      description: 'Date of birth',
      type: 'string',
      format: 'date-time',
    },
  },
};
