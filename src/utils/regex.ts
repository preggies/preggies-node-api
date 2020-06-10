// > Minimum 6 characters
// > At least 1 Uppercase Alphabet
// > At least 1 Lowercase Alphabet
// > At least 1 Number
// > At least 1 Special Character
export const password = /(?=^.{6,}$)((?=.+[0-9])(?=.*[^a-zA-Z0-9_]+))(?![.\n\t\r])(?=.*[a-z]).*$/;

export const objectId = /\b[0-9a-fA-F]{24}\b/;

export const jwtToken = /\b(?=(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9)\b)\1\.[0-9a-z_\\\-./]+/i;

export const uuidV4 = /\b(?=([0-9A-F]{8})\b)\1-(?=([0-9A-F]{4}))\2-(?=(4[0-9A-F]{3}))\3-(?=([89AB][0-9A-F]{3}))\4-(?=([0-9A-F]{12}))\5\b/i;

export const email = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]{2,}@[a-zA-Z0-9-]{2,}(?:\.[a-zA-Z0-9-]+)*$/;
