/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: API para la gestión de especialidades médicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Especialidad:
 *       type: object
 *       required:
 *         - nombre
 *         - salario
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la especialidad
 *         nombre:
 *           type: string
 *           description: Nombre de la especialidad médica
 *         salario:
 *           type: number
 *           description: Salario base asociado a la especialidad
 *       example:
 *         nombre: "Cardiología"
 *         salario: 1500.00
 */

module.exports = function (app, conexion) {



    /**
     * @swagger
     * /especialidades:
     *   get:
     *     summary: Retorna la lista de todas las especialidades médicas
     *     tags: [Especialidades]
     *     responses:
     *       200:
     *         description: La lista de especialidades médicas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Especialidad'
     *       404:
     *         description: No se encontraron especialidades médicas
     */
    app.get('/especialidades', (req, res) => {
        const query = `SELECT * FROM especialidades;`;

        conexion.query(query, (error, resultado) => {
            if (error) {
                return console.error(error.message);
            }

            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.json(`No hay registros de especialidades`);
            }
        });
    });


    /**
     * @swagger
     * /especialidades/{id}:
     *   get:
     *     summary: Obtiene la especialidad médica por su ID
     *     tags: [Especialidades]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la especialidad médica
     *     responses:
     *       200:
     *         description: Información de la especialidad médica por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Especialidad'
     *       404:
     *         description: Especialidad médica no encontrada
     */
    app.get('/especialidades/:id', (req, res) => {
        const { id } = req.params;

        const query = `SELECT * FROM especialidades WHERE id=${id};`;

        conexion.query(query, (error, resultado) => {
            if (error) {
                return console.error(error.message);
            }

            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.json(`No hay especialidades con ese ID`);
            }
        });
    });




    /**
     * @swagger
     * /especialidades/agregar:
     *   post:
     *     summary: Agrega una nueva especialidad médica
     *     tags: [Especialidades]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Especialidad'
     *     responses:
     *       200:
     *         description: La especialidad médica se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar la especialidad médica
     */
    app.post('/especialidades/agregar', (req, res) => {
        const especialidades = {
            nombre: req.body.nombre,
            salario: req.body.salario,
        };

        const query = `INSERT INTO especialidades (nombre, salario) VALUES ('${especialidades.nombre}', '${especialidades.salario}')`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al registrar EL ROL' });
            }

            res.json('Se registró correctamente el ROL');
        });
    });



    /**
     * @swagger
     * /especialidades/actualizar/{id}:
     *   put:
     *     summary: Actualiza una especialidad médica existente
     *     tags: [Especialidades]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la especialidad médica a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Especialidad'
     *     responses:
     *       200:
     *         description: La especialidad médica se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la especialidad médica
     */
    app.put('/especialidades/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { nombre } = req.body;
        const { salario } = req.body;

        const query = `
            UPDATE especialidades SET nombre='${nombre}', salario='${salario}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la especialidad`);
        });
    });


    /**
     * @swagger
     * /especialidades/borrar/{id}:
     *   delete:
     *     summary: Elimina una especialidad médica existente
     *     tags: [Especialidades]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la especialidad médica a eliminar
     *     responses:
     *       200:
     *         description: La especialidad médica se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la especialidad médica
     */
    app.delete('/especialidades/borrar/:id', (req, res) => {
        const { id } = req.params;

        const query = `DELETE FROM especialidades WHERE id=${id};`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
            }

            res.json(`Se eliminó correctamente la especialidad`);
        });
    });
};
