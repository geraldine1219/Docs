const express = require('express');
const bodyParser = require('body-parser');
const conexion = require('./conexion');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require("dotenv").config()
const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

const PUERTO = 3307;

// Definir las opciones de Swagger
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation Healine',
      version: '1.0.0',
      description: 'Documentación de la API',
    },
    servers: [
      {
        url: `http://localhost:${PUERTO}`,
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./Adminstrador/*.js', './Medico/*.js'], // Rutas a los archivos que contienen las definiciones de los endpoints
};

// Configurar swagger-jsdoc
const specs = swaggerJsdoc(options);

// Configurar swagger-ui-express
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Definir los endpoints
require('./Administrador/roles')(app, conexion);
require('./Administrador/pqrs')(app, conexion);
require('./Administrador/registro-login')(app, conexion);
require('./Administrador/agenda')(app, conexion);
require('./Administrador/sedes')(app, conexion);
require('./Administrador/especialidades')(app, conexion);
require('./Administrador/citas')(app, conexion);
require('./Administrador/formulas')(app, conexion);
require('./Administrador/ordenes')(app, conexion);
require('./Administrador/examenes')(app, conexion);
require('./Administrador/incapacidad')(app, conexion);
require('./Administrador/users')(app, conexion);
require('./Administrador/encuestas')(app, conexion);



// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});

app.get('/', (req, res) => {
    res.send('API');
});
