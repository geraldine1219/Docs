/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - documento
 *         - tipoDoc
 *         - primerNombre
 *         - primerApellido
 *         - email
 *         - numero
 *         - status
 *         - rol
 *         - especialidad
 *         - sede
 *       properties:
 *         documento:
 *           type: string
 *           description: Documento de identidad del usuario
 *         tipoDoc:
 *           type: string
 *           description: Tipo de documento de identidad del usuario
 *         primerNombre:
 *           type: string
 *           description: Primer nombre del usuario
 *         segundoNombre:
 *           type: string
 *           description: Segundo nombre del usuario
 *         primerApellido:
 *           type: string
 *           description: Primer apellido del usuario
 *         segundoApellido:
 *           type: string
 *           description: Segundo apellido del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         numero:
 *           type: string
 *           description: Número telefónico del usuario
 *         status:
 *           type: string
 *           description: Estado del usuario (activo/inactivo)
 *         rol:
 *           type: string
 *           description: Rol del usuario (medico/secretaria/paciente)
 *         especialidad:
 *           type: string
 *           description: Especialidad del usuario (solo para médicos)
 *         sede:
 *           type: string
 *           description: Sede asociada al usuario
 *       example:
 *         documento: "1126447331"
 *         tipoDoc: "CC"
 *         primerNombre: "Alejandro"
 *         segundoNombre: ""
 *         primerApellido: "Ardila"
 *         segundoApellido: "Llano"
 *         email: "aardila257@gmail.com"
 *         password: "$2b$10$J7kzo3.FSJrA5d9DMh3FM.RhDQVmVDxGfwlD.WwIWGG..."
 *         numero: "3125175148"
 *         status: "True"
 *         rol: "Paciente"
 *         especialidad: "Neurología"
 *         sede: "Hospital Universitario San Ignacio"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de usuarios
 */


//const bcrypt = require('bcrypt');

module.exports = function (app, conexion) {
    
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Retorna la lista de todos los usuarios
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: La lista de usuarios
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */
    app.get('/users', (req, res) => {
        const query = `SELECT * FROM users;`
        conexion.query(query, (error, resultado) => {
            if(error) return console.error(error.message)

            if(resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros`)
            }
        })
    })




    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Obtiene el usuario por su ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: ID del usuario
     *     responses:
     *       200:
     *         description: Información del usuario por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: Usuario no encontrado
     */

    app.get('/users/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM users WHERE documento=${id};`
        conexion.query(query, (error, resultado) => {
            if(error) return console.error(error.message)

            if(resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay usuarios`)
            }
        })
    })




    /**
 * @swagger
 * /users/agregar:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: El usuario se registró correctamente
 *       400:
 *         description: El documento o correo electrónico ya están registrados
 *       500:
 *         description: Error interno del servidor al registrar el usuario
 */
    
    app.post('/users/agregar', async (req, res) => {
        const users = {            
            documento: req.body.documento,
            tipoDoc: req.body.tipoDoc,
            primerNombre: req.body.primerNombre,
            segundoNombre: req.body.segundoNombre,
            primerApellido: req.body.primerApellido,
            segundoApellido: req.body.segundoApellido,
            email: req.body.email,
            password: req.body.password,
            numero: req.body.numero,
            status: req.body.status,
            rol: req.body.rol,
            especialidad: req.body.especialidad,
            sede: req.body.sede,
        };
    
        // Hash de la contraseña
        //const hashedPassword = await bcrypt.hash(users.password, 10);
        //users.password = hashedPassword;
    
        // Verificar si el documento ya está registrado
        const documentoQuery = `SELECT * FROM users WHERE documento='${users.documento}'`;
        conexion.query(documentoQuery, (documentoError, documentoResult) => {
            if (documentoError) {
                console.error(documentoError.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
    
            if (documentoResult.length > 0) {
                return res.status(400).json({ error: 'El documento ya está registrado' });
            }
    
            // Verificar si el correo electrónico ya está registrado
            const emailQuery = `SELECT * FROM users WHERE email='${users.email}'`;
            conexion.query(emailQuery, (emailError, emailResult) => {
                if (emailError) {
                    console.error(emailError.message);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
    
                if (emailResult.length > 0) {
                    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
                }
    
                // Si el documento y el correo electrónico no están registrados, insertar el usuario
                const insertQuery = `INSERT INTO users (documento, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido, email, password, numero, status, rol, especialidad, sede) VALUES ('${users.documento}', '${users.tipoDoc}', '${users.primerNombre}', '${users.segundoNombre}', '${users.primerApellido}', '${users.segundoApellido}', '${users.email}', '${users.password}', '${users.numero}', '${users.status}', '${users.rol}', '${users.especialidad}', '${users.sede}')`;
                conexion.query(insertQuery, (insertError) => {
                    if (insertError) {
                        console.error(insertError.message);
                        return res.status(500).json({ error: 'Error al registrar el usuario' });
                    }
    
                    res.json('Se registró correctamente el usuario');
                });
            });
        });
    });
    
    



    /**
 * @swagger
 * /users/actualizar/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: El usuario se actualizó correctamente
 *       500:
 *         description: Error interno del servidor al actualizar el usuario
 */
    app.put('/users/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { documento, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido, email, numero, status, rol, especialidad, sede } = req.body;

        const query = `
            UPDATE users SET documento='${documento}', tipoDoc='${tipoDoc}', primerNombre='${primerNombre}', segundoNombre='${segundoNombre}', primerApellido='${primerApellido}', segundoApellido='${segundoApellido}', email='${email}', numero='${numero}', status='${status}', rol='${rol}', especialidad='${especialidad}', sede='${sede}' WHERE documento='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente el usuario`);
        });
    });



    /**
 * @swagger
 * /users/inactivar/{id}:
 *   put:
 *     summary: Inactiva un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a inactivar
 *     responses:
 *       200:
 *         description: El usuario se inactivó correctamente
 *       500:
 *         description: Error interno del servidor al inactivar el usuario
 */
    app.put('/users/inactivar/:id', (req, res) => {
        const { id } = req.params;
    
        const query = `UPDATE users SET status = 'False' WHERE documento = ${id};`;
        conexion.query(query, (error) => {
            if(error) {
                console.error(error.message);
                res.status(500).json({ message: 'Error al inactivar el usuario' });
                return;
            }
    
            res.json({ message: 'Usuario inactivado correctamente' });
        });
    });
    
    
    app.post('/login', (req, res) => {
        const { correo, contrasena } = req.body;

        // Verificar las credenciales del usuario en la base de datos
        const query = `SELECT * FROM users WHERE email=? AND password=?`;
        conexion.query(query, [correo, contrasena], (error, resultado) => {
            if(error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if(resultado.length > 0) {
                // Usuario autenticado correctamente
                res.json({ mensaje: 'Inicio de sesión exitoso', usuario: resultado[0] });
            } else {
                // Credenciales incorrectas
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        });
    });
}
