/**
 * @swagger
 * tags:
 *   name: Examenes
 *   description: API para la gestión de exámenes médicos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Examen:
 *       type: object
 *       required:
 *         - cita
 *         - paciente
 *         - nombre
 *         - resultado
 *         - fecha
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del examen
 *         cita:
 *           type: string
 *           description: ID de la cita asociada al examen
 *         paciente:
 *           type: string
 *           description: ID del paciente
 *         nombre:
 *           type: string
 *           description: Nombre del examen
 *         resultado:
 *           type: string
 *           description: Resultado del examen
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del examen
 *       example:
 *         cita: "123456"
 *         paciente: "1126447331"
 *         nombre: "Hemograma completo"
 *         resultado: "Normal"
 *         fecha: "2024-03-25"
 */

module.exports = function (app, conexion) {



    /**
     * @swagger
     * /examenes:
     *   get:
     *     summary: Retorna la lista de todos los exámenes médicos
     *     tags: [Examenes]
     *     responses:
     *       200:
     *         description: La lista de exámenes médicos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Examen'
     *       404:
     *         description: No se encontraron exámenes médicos
     */
    app.get('/examenes', (req, res) => {
        const query = `SELECT * FROM examenes;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de examenes`)
            }
        })
    })



    /**
     * @swagger
     * /examenes/{id}:
     *   get:
     *     summary: Obtiene el examen médico por su ID
     *     tags: [Examenes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del examen médico
     *     responses:
     *       200:
     *         description: Información del examen médico por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Examen'
     *       404:
     *         description: Examen médico no encontrado
     */
    app.get('/examenes/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM examenes WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay examenes con ese ID`)
            }
        })
    })



    /**
     * @swagger
     * /examenes/agregar:
     *   post:
     *     summary: Crea un nuevo examen médico
     *     tags: [Examenes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Examen'
     *     responses:
     *       200:
     *         description: El examen médico se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar el examen médico
     */
    app.post('/examenes/agregar', (req, res) => {
        const examen = {
            cita: req.body.cita,
            paciente: req.body.paciente,
            nombre: req.body.nombre,
            resultado: req.body.resultado,
            fecha: req.body.fecha,
            estado: req.body.estado
        };

        const query = `INSERT INTO examenes (cita, paciente, nombre, resultado, fecha, estado) VALUES ('${examen.cita}', '${examen.paciente}', '${examen.nombre}', '${examen.resultado}', '${examen.fecha}', 'Pendiente')`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al registrar el examen' });
            }

            res.json('Se registró correctamente el examen');
        });
    });


    /**
     * @swagger
     * /examenes/actualizar/{id}:
     *   put:
     *     summary: Actualiza un examen médico existente
     *     tags: [Examenes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del examen médico a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Examen'
     *     responses:
     *       200:
     *         description: El examen médico se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar el examen médico
     */
    app.put('/examenes/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { cita, paciente, nombre, resultado, fecha, estado } = req.body;

        const query = `
            UPDATE examenes SET cita='${cita}', paciente='${paciente}', nombre='${nombre}', resultado='${resultado}', fecha='${fecha}', estado='${estado}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente el examen`);
        });
    });



    /**
     * @swagger
     * /examenes/borrar/{id}:
     *   delete:
     *     summary: Elimina un examen médico existente
     *     tags: [Examenes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del examen médico a eliminar
     *     responses:
     *       200:
     *         description: El examen médico se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar el examen médico
     */
    app.delete('/examenes/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM examenes WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente el examen`)
        })
    })
}
