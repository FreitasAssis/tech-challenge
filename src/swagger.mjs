import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ['./routes/receiverRoutes'];

const doc = {
    info: {
        version: '1.0.0',
        title: 'Tech Challenge',
        description: 'Tech Challenge docs',
    },
    "host": "localhost:3000",
    "basePath": "/",
    "schemes": ["http"],
    consumes: ['application/json'],
    produces: ['application/json'],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
