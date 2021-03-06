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
  swagger: {
    title: {
      doc: "Application's swagger title",
      format: String,
      default: 'Microservice Boilerplate',
      env: 'SWAGGER_TITLE',
      arg: 'swagger-title',
    },
    description: {
      doc: "Application's swagger description",
      format: String,
      default: 'Boilerplate microservice scaffold',
      env: 'SWAGGER_DESCRIPTION',
      arg: 'swagger-description',
    },
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
    secure: {
      doc: 'Apply tls security layer. Disable if http is preferred',
      format: Boolean,
      default: true,
      env: 'TLS',
      arg: 'tls',
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

const loader = ({ base = null, configFiles = null, options = {} }): Config<object> => {
  const config = convict({ ...(base || {}) }).load(options);
  return configFiles ? config.loadFile(configFiles) : config;
};

const loadConfig = (configFiles, options = {}): Config<object> =>
  loader({
    configFiles,
    base: conf,
    options,
  });

export const dbConfig = loader({ base: mongoConfig });

export default loadConfig;
