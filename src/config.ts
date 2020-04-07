import convict, { Config } from 'convict';

const mongoConfig = {
  mongo: {
    host: {
      doc: 'Mongo server hostname',
      format: String,
      default: 'mongodb://127.0.0.1:27017',
      env: 'MONGO_CONNECT',
      arg: 'mongo-connect',
    },
    database: {
      doc: 'Mongo database',
      format: String,
      default: 'preggies',
      env: 'MONGO_DB',
      arg: 'mongo-db',
    },
    user: {
      doc: 'Mongo client username',
      format: String,
      default: 'user',
      env: 'MONGO_USER',
      arg: 'mongo-user',
    },
    pass: {
      doc: 'Mongo client password',
      format: String,
      default: 'password',
      env: 'MONGO_PASS',
      arg: 'mongo-pass',
    },
  },
};

export const conf = {
  env: {
    doc: 'The application environment',
    format: ['development', 'test', 'production'],
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    hostname: {
      doc: 'Application hostname',
      format: String,
      default: '127.0.0.1',
      env: 'SERVER_HOSTNAME',
      arg: 'server-hostname',
    },
    port: {
      doc: 'Application port',
      format: 'port',
      default: 4015,
      env: 'SERVER_PORT',
      arg: 'server-port',
    },
    tlsCert: {
      doc: 'Security certificate',
      format: String,
      default: '',
      env: 'TLS_CERT',
      arg: 'tls-cert',
    },
    tlsKey: {
      doc: 'Security certificate key',
      format: String,
      default: '',
      env: 'TLS_KEY',
      arg: 'tls-key',
    },
    tlsCa: {
      doc: 'Security certificate authority',
      format: String,
      default: '',
      env: 'TLS_CA',
      arg: 'tls-ca',
    },
  },
  jwt: {
    secret: {
      doc: 'JWT secret key',
      format: String,
      default: '',
      env: 'JWT_SECRET',
      arg: 'jwt-secret',
    },
    expires: {
      doc: 'JWT expiry in seconds',
      format: Number,
      default: 86400, // one day
      env: 'JWT_EXPIRES',
      arg: 'jwt-expires',
    },
  },
  ...mongoConfig,
};

const loader = ({ appConfig = null, base = null, configFiles = null, options = {} }): Config<object> => {
  const config = convict({ ...(appConfig || {}), ...(base || {}) }).load(options);
  return configFiles ? config.loadFile(configFiles) : config;
};

const loadConfig = (appConfig = {}, configFiles, options = {}): Config<object> =>
  loader({
    appConfig,
    configFiles,
    base: conf,
    options,
  });

export const dbConfig = loader({ base: mongoConfig });

export default loadConfig;
