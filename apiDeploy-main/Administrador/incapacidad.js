/**
 * @swagger
 * tags:
 *   name: Incapacidad
 *   description: API para la gestión de incapacidades médicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Incapacidad:
 *       type: object
 *       required:
 *         - paciente
 *         - medico
 *         - fecha
 *         - tipo
 *         - detalles
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la incapacidad
 *         paciente:
 *           type: string
 *           description: ID del paciente asociado a la incapacidad
 *         medico:
 *           type: string
 *           description: ID del médico que emitió la incapacidad
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de emisión de la incapacidad
 *         tipo:
 *           type: string
 *           description: Tipo de incapacidad (temporal/permanente)
 *         detalles:
 *           type: string
 *           description: Detalles adicionales sobre la incapacidad
 *       example:
 *         paciente: "1126447331"
 *         medico: "123456789"
 *         fecha: "2024-03-25"
 *         tipo: "temporal"
 *         detalles: "Reposo por una semana debido a gripe"
 */


module.exports = function (app, conexion) {



    /**
     * @swagger
     * /incapacidad:
     *   get:
     *     summary: Retorna la lista de todas las incapacidades médicas
     *     tags: [Incapacidad]
     *     responses:
     *       200:
     *         description: La lista de incapacidades médicas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Incapacidad'
     *       404:
     *         description: No se encontraron incapacidades médicas
     */

    app.get('/incapacidad', (req, res) => {
        const query = `SELECT * FROM incapacidad;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de incapacidad`)
            }
        })
    })



    /**
     * @swagger
     * /incapacidad/{id}:
     *   get:
     *     summary: Obtiene la incapacidad médica por su ID
     *     tags: [Incapacidad]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la incapacidad médica
     *     responses:
     *       200:
     *         description: Información de la incapacidad médica por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Incapacidad'
     *       404:
     *         description: Incapacidad médica no encontrada
     */
    app.get('/incapacidad/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM incapacidad WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay incapacidad con ese ID`)
            }
        })
    })



    /**
     * @swagger
     * /incapacidad/agregar:
     *   post:
     *     summary: Crea una nueva incapacidad médica
     *     tags: [Incapacidad]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Incapacidad'
     *     responses:
     *       200:
     *         description: La incapacidad médica se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar la incapacidad médica
     */
    app.post('/incapacidad/agregar', (req, res) => {
        const incapacida = {
            paciente: req.body.paciente,
            medico: req.body.medico,

            fecha: req.body.fecha,
            tipo: req.body.tipo,
            detalles: req.body.detalles
        };

        const query = `INSERT INTO incapacidad ( paciente, medico, fecha, tipo, detalles) VALUES ('${incapacida.paciente}', '${incapacida.medico}', '${incapacida.fecha}', '${incapacida.tipo}', '${incapacida.detalles}')`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al registrar la incapacidad' });
            }

            res.json('Se registró correctamente la incapacidad');
        });
    });



    /**
     * @swagger
     * /incapacidad/actualizar/{id}:
     *   put:
     *     summary: Actualiza una incapacidad médica existente
     *     tags: [Incapacidad]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la incapacidad médica a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Incapacidad'
     *     responses:
     *       200:
     *         description: La incapacidad médica se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la incapacidad médica
     */
    app.put('/incapacidad/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { paciente, medico, fecha, tipo, detalles } = req.body;

        const query = `
            UPDATE incapacidad SET paciente='${paciente}', medico='${medico}', fecha='${fecha}', tipo='${tipo}', detalles='${detalles}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la incapacidad`);
        });
    });



    /**
     * @swagger
     * /incapacidad/borrar/{id}:
     *   delete:
     *     summary: Elimina una incapacidad médica existente
     *     tags: [Incapacidad]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la incapacidad médica a eliminar
     *     responses:
     *       200:
     *         description: La incapacidad médica se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la incapacidad médica
     */
    app.delete('/incapacidad/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM incapacidad WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente la incapacidad`)
        })
    })
}
