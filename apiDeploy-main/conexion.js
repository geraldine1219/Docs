// conexion.js
const mysql = require('mysql');
require("dotenv").config()



const conexion = mysql.createConnection({
    host: "localhost",
    user: "rood",
    password: "",
    database: "centro_salud",
    port: 3307,
});



conexion.connect(error => {
    if (error) throw error;
    console.log('Conexión exitosa a la base de datos');
});

module.exports = conexion;
