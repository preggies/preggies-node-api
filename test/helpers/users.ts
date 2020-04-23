export const verifyUser = (user): void => {
  ['fullname', 'email', 'meta', 'uuid', 'dob'].forEach(k => {
    expect(user).toHaveProperty(k);
  });
};

export const verifyResponse = (user, payload): void => {
  ['meta.active', 'fullname', 'email'].forEach(k => {
    expect(user[k]).toEqual(payload[k]);
  });
};
