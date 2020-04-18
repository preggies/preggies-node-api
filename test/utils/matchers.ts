declare global {
  namespace jest {
    interface Matchers<R> {
      containExactly: (array: any[]) => CustomMatcherResult;
      toBeValidUUID: (value: string) => CustomMatcherResult;
    }

    interface Expect {
      containExactly: (array: any[]) => CustomMatcherResult;
      toBeValidUUID: (value: string) => CustomMatcherResult;
    }
  }
}

export default expect.extend({
  toBeValidUUID(value) {
    return {
      pass: /\b(?=([0-9A-F]{8})\b)\1-(?=([0-9A-F]{4}))\2-(?=(4[0-9A-F]{3}))\3-(?=([89AB][0-9A-F]{3}))\4-(?=([0-9A-F]{12}))\5\b/i.test(
        value
      ),
      message: () => `${value} not a valid uuid.v4`,
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
