/**
 * @swagger
 * tags:
 *   name: Ordenes
 *   description: API para la gestión de órdenes médicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Orden:
 *       type: object
 *       required:
 *         - paciente
 *         - formula
 *         - diagnostico
 *         - tratamiento
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la orden médica
 *         paciente:
 *           type: string
 *           description: ID del paciente asociado a la orden
 *         formula:
 *           type: string
 *           description: ID de la fórmula médica asociada a la orden
 *         diagnostico:
 *           type: string
 *           description: Diagnóstico asociado a la orden médica
 *         tratamiento:
 *           type: string
 *           description: Tratamiento prescrito en la orden médica
 *       example:
 *         paciente: "1126447331"
 *         formula: "1"
 *         diagnostico: "Gripe"
 *         tratamiento: "Reposo y medicación"
 */


module.exports = function (app, conexion) {



    /**
     * @swagger
     * /ordenes:
     *   get:
     *     summary: Retorna la lista de todas las órdenes médicas
     *     tags: [Ordenes]
     *     responses:
     *       200:
     *         description: La lista de órdenes médicas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Orden'
     *       404:
     *         description: No se encontraron órdenes médicas
     */
    app.get('/ordenes', (req, res) => {
        const query = `SELECT * FROM ordenes;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de ordenes`)
            }
        })
    })



    /**
     * @swagger
     * /ordenes/{id}:
     *   get:
     *     summary: Obtiene la orden médica por su ID
     *     tags: [Ordenes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la orden médica
     *     responses:
     *       200:
     *         description: Información de la orden médica por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Orden'
     *       404:
     *         description: Orden médica no encontrada
     */
    app.get('/ordenes/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM ordenes WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay ordenes con ese ID`)
            }
        })
    })



    /**
     * @swagger
     * /ordenes/agregar:
     *   post:
     *     summary: Crea una nueva orden médica
     *     tags: [Ordenes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Orden'
     *     responses:
     *       200:
     *         description: La orden médica se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar la orden médica
     */
    app.post('/ordenes/agregar', (req, res) => {
        const orden = {
            paciente: req.body.paciente,
            formula: req.body.formula,
            diagnostico: req.body.diagnostico,
            tratamiento: req.body.tratamiento
        };

        const query = `INSERT INTO ordenes (paciente, formula, diagnostico, tratamiento) VALUES ('${orden.paciente}', '${orden.formula}', '${orden.diagnostico}', '${orden.tratamiento}')`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al registrar la orden' });
            }

            res.json('Se registró correctamente la orden');
        });
    });



    /**
     * @swagger
     * /ordenes/actualizar/{id}:
     *   put:
     *     summary: Actualiza una orden médica existente
     *     tags: [Ordenes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la orden médica a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Orden'
     *     responses:
     *       200:
     *         description: La orden médica se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la orden médica
     */
    app.put('/ordenes/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { paciente, formula, diagnostico, tratamiento } = req.body;

        const query = `
            UPDATE ordenes SET paciente='${paciente}', formula='${formula}', diagnostico='${diagnostico}', tratamiento='${tratamiento}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la orden`);
        });
    });



    /**
     * @swagger
     * /ordenes/borrar/{id}:
     *   delete:
     *     summary: Elimina una orden médica existente
     *     tags: [Ordenes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la orden médica a eliminar
     *     responses:
     *       200:
     *         description: La orden médica se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la orden médica
     */
    app.delete('/ordenes/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM ordenes WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente la orden`)
        })
    })
}
