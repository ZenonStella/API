import express from 'express';
import dotenv from 'dotenv';
import * as url from 'url';
import routes from './Routes/Routes.js';
import mongoose from 'mongoose';
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from 'swagger-jsdoc';
import cookieParser  from 'cookie-parser';

//const __filename = url.fileURLToPath(import.meta.url);
//const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config();
const MONGODB = process.env.MONGODB;
const PORT = process.env.PORT;
const URL_HOST = process.env.URL_HOST;

// const mongodb = require("mongodb");

// console.log(PORT);
// const connectionString =
//   'mongodb+srv://database_user:database_password@server";';

// mongodb.connect(
//   connectionString,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   function (err, client) {
//     module.exports = client.db();
//     const app = require("./app");
//     app.listen(3000);
//   }
// );

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Inventory API',
            version: '1.0.0'
        },
        basePath: "/api/v1",
        host: URL_HOST,
        securityDefinitions: {
            Bearer: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
                description: ">- Token avec le préfixe `Bearer` devant (ex: Bearer evXydfzu3dsfSQd...)"
            },
            CSRFHeader: {
                type: "apiKey",
                name: 'x-csrf-token',
                in: "header",
                description: ">- Renseignez le dernier csrfToken (stocké dans les cookies) envoyé lors d'un fetch depuis l'application web. Bug à résoudre : envoyer dans la requête le cookie csrfToken."
            }
        },
        security: [
            {
                Bearer: []
            },
            {
                CSRFHeader: []
            }
        ]
    },
    apis: ["./Routes/*.js"],
};

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', routes);

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose.connect(MONGODB);

const URL_API = `${URL_HOST}/api/v1/docs`;

app.listen(PORT, () => console.log(`\n \n API Swagger Docs : ${URL_API}`));