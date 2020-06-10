import { objectId, uuidV4 } from '../../src/utils/regex';

declare global {
  namespace jest {
    interface Matchers<R> {
      containExactly: (array: any[]) => CustomMatcherResult;
      toBeValidUUID: () => CustomMatcherResult;
      toBeValidObjectId: () => CustomMatcherResult;
    }

    interface Expect {
      containExactly: (array: any[]) => CustomMatcherResult;
      toBeValidUUID: () => CustomMatcherResult;
      toBeValidObjectId: () => CustomMatcherResult;
    }
  }
}

export default expect.extend({
  toBeValidUUID(value) {
    return {
      pass: uuidV4.test(value),
      message: () => `${value} not a valid uuid.v4`,
    };
  },

  toBeValidObjectId(value) {
    return {
      pass: objectId.test(value),
      message: () => `${value} not a valid MongoDB ObjectID`,
    };
  },

  containExactly(received, expected) {
    return {
      pass: (() => {
        if (!expected || received.length !== expected.length) return false;
        return received.every(curr => expected.includes(curr));
      })(),
      message: () => `${JSON.stringify(expected)} is not the same as ${JSON.stringify(received)}`,
    };
  },
});
