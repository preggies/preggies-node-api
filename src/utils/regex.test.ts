import { password, objectId, jwtToken, uuidV4, email } from './regex';

describe('Regex', () => {
  describe('Password', () => {
    describe('Invalid password', () => {
      it('rejects password that dont match spec', () => {
        const badPassword = 'qwerty';
        expect(badPassword).toEqual(expect.not.stringMatching(password));
      });

      it('rejects password thats not up to the min length', () => {
        const badPassword = 'hello';
        expect(badPassword).toEqual(expect.not.stringMatching(password));
      });

      it('rejects password that does not include special character', () => {
        const badPassword = 'qW3rty';
        expect(badPassword).toEqual(expect.not.stringMatching(password));
      });

      it('rejects password that does not include numbers', () => {
        const badPassword = 'qwer@TY';
        expect(badPassword).toEqual(expect.not.stringMatching(password));
      });

      it('rejects password that does not include lowercased letters', () => {
        const badPassword = 'QW3R@TY';
        expect(badPassword).toEqual(expect.not.stringMatching(password));
      });
    });

    describe('Valid password', () => {
      it('accepts password that matches the spec', () => {
        const goodPassword = 'p4s4pR"9';
        expect(goodPassword).toEqual(expect.stringMatching(password));
      });

      it('accepts existing passwords', () => {
        const existingPassword = 'u<Ym2h:C';
        expect(existingPassword).toEqual(expect.stringMatching(password));
      });
    });
  });

  describe('ObjectId', () => {
    describe('Invalid objectId', () => {
      it('rejects objectId that dont match mongo spec', () => {
        const badId = '5e594cf8a6d46192af747';
        expect(badId).toEqual(expect.not.stringMatching(objectId));
      });

      it('rejects objectId thats not up to the accepted length', () => {
        const badId = '5e594cf8a6d6192af747';
        expect(badId).toEqual(expect.not.stringMatching(objectId));
      });

      it('rejects objectId that is not a valid HEX string', () => {
        const badId = '5e594cf8a6d34546192af7hh';
        expect(badId).toEqual(expect.not.stringMatching(objectId));
      });
    });

    describe('Valid objectId', () => {
      it('accepts objectId that matches the spec', () => {
        const goodId = '5c3cad20a5676122753b33ba';
        expect(goodId).toEqual(expect.stringMatching(objectId));
      });

      it('accepts mongo objectIds from DB', () => {
        const existingId = '5c3c9fb3eaaf2b1b8106086e';
        expect(existingId).toEqual(expect.stringMatching(objectId));
      });

      it('accepts objectId that does include uppercased letters', () => {
        const goodId = '5E594CF8A6d34546192AF747';
        expect(goodId).toEqual(expect.stringMatching(objectId));
      });

      it('accepts objectId that does starts with a number', () => {
        const badId = 'fe594cf8a6d34546192af747';
        expect(badId).toEqual(expect.stringMatching(objectId));
      });
    });
  });

  describe('UUIDv4', () => {
    describe('Invalid uuid', () => {
      it('rejects not compliant uuid', () => {
        const badId = '0211718hj-a5d5-4681-b087-8b4b337d5b8d';
        expect(badId).toEqual(expect.not.stringMatching(uuidV4));
      });

      it('rejects uuid thats not up to the accepted length', () => {
        const badId = '02117187-a5d5-4681-b087-8b337d5b8d';
        expect(badId).toEqual(expect.not.stringMatching(uuidV4));
      });

      it('rejects uuid that is not a valid HEX string', () => {
        const badId = '02117187-a5d5-4681-b087-8b4l337k5b8d';
        expect(badId).toEqual(expect.not.stringMatching(uuidV4));
      });

      it('rejects valid uuid that is not version 4', () => {
        const badId = '58daf7f0-9837-11ea-a133-7dc6e7f7bffd';
        expect(badId).toEqual(expect.not.stringMatching(uuidV4));
      });
    });

    describe('Valid uuid', () => {
      it('accepts version 4 uuid', () => {
        const goodId = '02117187-a5d5-4681-b087-8b4b337d5b8d';
        expect(goodId).toEqual(expect.stringMatching(uuidV4));
      });

      it('accepts uuid that include uppercased letters', () => {
        const goodId = '02117187-A5D5-4681-B087-8B4B337d5B8D';
        expect(goodId).toEqual(expect.stringMatching(uuidV4));
      });

      it('accepts uuid that does starts with a character', () => {
        const badId = 'af117187-a5d5-4681-b087-8b4b337d5b8d';
        expect(badId).toEqual(expect.stringMatching(uuidV4));
      });
    });
  });

  describe('JWT', () => {
    describe('Invalid token', () => {
      it('rejects token that dont match JWT spec', () => {
        const badToken =
          'eyJhbGciOiJIUzI1NiIslltcCI6IkpXVCJ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        expect(badToken).toEqual(expect.not.stringMatching(jwtToken));
      });

      it('rejects token that is not up to the accepted length', () => {
        const badToken = 'eyJhbGciOiJIUzI1NiIslltcCI6IkpXV';
        expect(badToken).toEqual(expect.not.stringMatching(jwtToken));
      });
    });

    describe('Valid token', () => {
      it('accepts token that matches the spec', () => {
        const goodToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        expect(goodToken).toEqual(expect.stringMatching(jwtToken));
      });

      it('accepts valid JWT token signed with a different secret', () => {
        const existingId =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6IkJvbGF0YW4gSWJyYWhpbSIsInJvbGUiOiI1ZWIwMWQ3NjJhNzhlOGU3NGMzZmY1NmYiLCJlbWFpbCI6ImVoYnJhaGVlbUBnbWFpbC5jb20iLCJpYXQiOjE1ODk1NTM1MzYsImV4cCI6MTU4OTYzOTkzNn0.72tvRTbup06-XTACbAZIwTwTRFhtUBfqgpCfwlyhR98';
        expect(existingId).toEqual(expect.stringMatching(jwtToken));
      });
    });
  });

  describe('Email', () => {
    describe('Invalid email', () => {
      it('rejects not compliant email', () => {
        const badEmail = 'test#preggies.co';
        expect(badEmail).toEqual(expect.not.stringMatching(email));
      });

      it('rejects email with thats not up to the accepted length for user identifier', () => {
        const badEmail = 't@preggies.co';
        expect(badEmail).toEqual(expect.not.stringMatching(email));
      });

      it('rejects email with thats not up to the accepted length for user domain', () => {
        const badEmail = 'test@p.co';
        expect(badEmail).toEqual(expect.not.stringMatching(email));
      });

      it('rejects email without domain extension', () => {
        const badEmail = 'test@p.co';
        expect(badEmail).toEqual(expect.not.stringMatching(email));
      });
    });

    describe('Valid email', () => {
      it('accepts valid email', () => {
        const goodEmail = 'test@preggies.co';
        expect(goodEmail).toEqual(expect.stringMatching(email));
      });

      it('accepts email with non-word character', () => {
        const goodEmail = 'bolatan_ibrahim@preggies.co';
        expect(goodEmail).toEqual(expect.stringMatching(email));
      });

      it('accepts email without a domain extension', () => {
        const badEmail = 'bolatan.ibrahim@preggies';
        expect(badEmail).toEqual(expect.stringMatching(email));
      });
    });
  });
});
