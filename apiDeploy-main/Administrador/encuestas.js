/**
 * @swagger
 * tags:
 *   name: Encuestas
 *   description: API para la gestión de Encuestas Del Aplicativo
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Encuesta:
 *       type: object
 *       required:
 *         - documento
 *         - email
 *         - rol
 *         - calificacion
 *         - facilidad
 *         - seguridad
 *         - velocidad
 *         - opinion
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la encuesta
 *         documento:
 *           type: string
 *           description: Documento de identificación del encuestado
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del encuestado
 *         rol:
 *           type: string
 *           description: Rol del encuestado (por ejemplo, paciente, médico, personal administrativo)
 *         calificacion:
 *           type: integer
 *           description: Calificación otorgada en la encuesta
 *         facilidad:
 *           type: integer
 *           description: Calificación de facilidad otorgada en la encuesta
 *         seguridad:
 *           type: integer
 *           description: Calificación de seguridad otorgada en la encuesta
 *         velocidad:
 *           type: integer
 *           description: Calificación de velocidad otorgada en la encuesta
 *         opinion:
 *           type: string
 *           description: Opinión o comentario del encuestado
 *       example:
 *         documento: "1122334455"
 *         email: "example@example.com"
 *         rol: "paciente"
 *         calificacion: 4
 *         facilidad: 5
 *         seguridad: 3
 *         velocidad: 4
 *         opinion: "Buena atención, pero la espera fue un poco larga."
 */

module.exports = function (app, conexion) {



    /**
     * @swagger
     * /encuestas:
     *   get:
     *     summary: Retorna la lista de todas las encuestas
     *     tags: [Encuestas]
     *     responses:
     *       200:
     *         description: La lista de encuestas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Encuesta'
     *       404:
     *         description: No se encontraron encuestas
     */
    app.get('/encuestas', (req, res) => {
        const query = `SELECT * FROM encuestas;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de encuestas`)
            }
        })
    })


    /**
     * @swagger
     * /encuestas/{id}:
     *   get:
     *     summary: Obtiene la encuesta por su ID
     *     tags: [Encuestas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la encuesta
     *     responses:
     *       200:
     *         description: Información de la encuesta por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     *       404:
     *         description: Encuesta no encontrada
     */
    app.get('/encuestas/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM encuestas WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay encuestas con ese ID`)
            }
        })
    })

    

    /**
     * @swagger
     * /encuestas/agregar:
     *   post:
     *     summary: Crea una nueva encuesta
     *     tags: [Encuestas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Encuesta'
     *     responses:
     *       200:
     *         description: La encuesta se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar la encuesta
     */
    app.post('/encuestas/agregar', (req, res) => {
        const encuesta = {
            documento: req.body.documento,
            email: req.body.email,
            rol: req.body.rol,
            calificacion: req.body.calificacion,
            facilidad: req.body.facilidad,
            seguridad: req.body.seguridad,
            velocidad: req.body.velocidad,
            opinion: req.body.opinion
        };

        // Verificar si ya existe una encuesta para el documento o el email proporcionado
        const queryExistencia = `SELECT * FROM encuestas WHERE documento='${encuesta.documento}' OR email='${encuesta.email}'`;
        conexion.query(queryExistencia, (error, resultado) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (resultado.length > 0) {
                return res.status(500).json({ error: 'Ya existe una encuesta registrada para este usuario' });
            }

            // Si no hay encuesta registrada, se procede a agregarla
            const query = `INSERT INTO encuestas (documento, email, rol, calificacion, facilidad, seguridad, velocidad, opinion) VALUES ('${encuesta.documento}', '${encuesta.email}', '${encuesta.rol}', '${encuesta.calificacion}' , '${encuesta.facilidad}' , '${encuesta.seguridad}' , '${encuesta.velocidad}', '${encuesta.opinion}')`;

            conexion.query(query, (error) => {
                if (error) {
                    console.error(error.message);
                    return res.status(500).json({ error: 'Error al registrar la encuesta' });
                }

                res.json('Se registró correctamente la encuesta');
            });
        });
    });



    /**
     * @swagger
     * /encuestas/actualizar/{id}:
     *   put:
     *     summary: Actualiza una encuesta existente
     *     tags: [Encuestas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la encuesta a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Encuesta'
     *     responses:
     *       200:
     *         description: La encuesta se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la encuesta
     */
    app.put('/encuestas/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { documento, email, rol, calificacion, facilidad, seguridad, velocidad, opinion } = req.body;

        const query = `
            UPDATE encuestas SET documento='${documento}', email='${email}', rol='${rol}', calificacion='${calificacion}', facilidad='${facilidad}', seguridad='${seguridad}', velocidad='${velocidad}', opinion='${opinion}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la encuesta`);
        });
    });



    /**
     * @swagger
     * /encuestas/borrar/{id}:
     *   delete:
     *     summary: Elimina una encuesta existente
     *     tags: [Encuestas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la encuesta a eliminar
     *     responses:
     *       200:
     *         description: La encuesta se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la encuesta
     */
    app.delete('/encuestas/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM encuestas WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente la encuesta`)
        })
    })
}
