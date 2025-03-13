const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie API',
      version: '0.0.1',
      description: 'My simple movie API doc',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'dev server',
      },
    ],
  },
  apis: ['./src/controllers/*.js'],
};

module.exports = swaggerJsdoc(options);
