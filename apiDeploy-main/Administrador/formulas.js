/**
 * @swagger
 * tags:
 *   name: Formulas
 *   description: API para la gestión de fórmulas médicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Formula:
 *       type: object
 *       required:
 *         - nombreMedicamento
 *         - tratamiento
 *         - diagnostico
 *         - instrucciones
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la fórmula
 *         nombreMedicamento:
 *           type: string
 *           description: Nombre del medicamento
 *         tratamiento:
 *           type: string
 *           description: Tratamiento asociado a la fórmula
 *         diagnostico:
 *           type: string
 *           description: Diagnóstico relacionado con la fórmula
 *         instrucciones:
 *           type: string
 *           description: Instrucciones para el paciente sobre el medicamento
 *       example:
 *         nombreMedicamento: "Paracetamol"
 *         tratamiento: "Fiebre"
 *         diagnostico: "Resfriado común"
 *         instrucciones: "Tomar una pastilla cada 8 horas con alimentos"
 */

module.exports = function (app, conexion) {



    /**
     * @swagger
     * /formulas:
     *   get:
     *     summary: Retorna la lista de todas las fórmulas médicas
     *     tags: [Formulas]
     *     responses:
     *       200:
     *         description: La lista de fórmulas médicas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Formula'
     *       404:
     *         description: No se encontraron fórmulas médicas
     */
    app.get('/formulas', (req, res) => {
        const query = `SELECT * FROM formulas;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de formulas`)
            }
        })
    })



    /**
     * @swagger
     * /formulas/{id}:
     *   get:
     *     summary: Obtiene la fórmula médica por su ID
     *     tags: [Formulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la fórmula médica
     *     responses:
     *       200:
     *         description: Información de la fórmula médica por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Formula'
     *       404:
     *         description: Fórmula médica no encontrada
     */
    app.get('/formulas/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM formulas WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay formula con ese ID`)
            }
        })
    })



    /**
     * @swagger
     * /formulas/agregar:
     *   post:
     *     summary: Crea una nueva fórmula médica
     *     tags: [Formulas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Formula'
     *     responses:
     *       200:
     *         description: La fórmula médica se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar la fórmula médica
     */
    app.post('/formulas/agregar', (req, res) => {
        const formula = {
            nombreMedicamento: req.body.nombreMedicamento,
            tratamiento: req.body.tratamiento,
            diagnostico: req.body.diagnostico,
            instrucciones: req.body.instrucciones
        };

        const query = `INSERT INTO formulas (nombreMedicamento, tratamiento, diagnostico, instrucciones) VALUES ('${formula.nombreMedicamento}', '${formula.tratamiento}', '${formula.diagnostico}', '${formula.instrucciones}')`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al registrar la formula' });
            }

            res.json('Se registró correctamente la formula');
        });
    });



    /**
     * @swagger
     * /formulas/actualizar/{id}:
     *   put:
     *     summary: Actualiza una fórmula médica existente
     *     tags: [Formulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la fórmula médica a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Formula'
     *     responses:
     *       200:
     *         description: La fórmula médica se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la fórmula médica
     */
    app.put('/formulas/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { nombreMedicamento, tratamiento, diagnostico, instrucciones } = req.body;

        const query = `
            UPDATE formulas SET nombreMedicamento='${nombreMedicamento}', tratamiento='${tratamiento}', diagnostico='${diagnostico}', instrucciones='${instrucciones}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la formula`);
        });
    });



    /**
     * @swagger
     * /formulas/borrar/{id}:
     *   delete:
     *     summary: Elimina una fórmula médica existente
     *     tags: [Formulas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la fórmula médica a eliminar
     *     responses:
     *       200:
     *         description: La fórmula médica se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la fórmula médica
     */
    app.delete('/formulas/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM formulas WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente la formula`)
        })
    })
}
