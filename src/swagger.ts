import { Config } from 'convict';

export default (config: Config<object>): object => ({
  openapi: '3.0.1',
  info: {
    version: '0.0.1',
    title: config.get('swagger.title'),
    description: config.get('swagger.description'),
    termsOfService: '',
    contact: {
      name: 'Bolatan Ibrahim',
      email: 'team@preggies.co',
      url: 'https://preggies.co',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: `${config.get('server.secure') ? 'https' : 'http'}://${config.get(
        'server.hostname'
      )}:${config.get('server.port')}`,
      description: 'The production API server',
    },
  ],
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
});
