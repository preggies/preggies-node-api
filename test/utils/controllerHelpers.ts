import { Config } from 'convict';
import { Joi } from '@hapi/joi';
import { emptyFn, mock } from './mock';
import { PreggiesJson } from '../../src/server';

export const json = emptyFn<PreggiesJson>();
export const config = emptyFn<Config<object>>();

export const validator = emptyFn<Joi>();

export const res = {
  status: jest.fn(),
  end: jest.fn(),
  contentType: jest.fn(),
} as any;

res.end.mockImplementation(() => res);
res.contentType.mockImplementation(() => res);
res.status.mockImplementation(() => res);

export const next = mock(val => val);
