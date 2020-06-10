export const mock = (predicate: any): jest.Mocked<any> => jest.fn().mockImplementation(predicate);

export const emptyFn = <T extends object>(): jest.Mocked<T> => {
  const val = {} as T;
  return mock(val);
};
