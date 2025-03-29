/**
 * @swagger
 * tags:
 *   name: Sedes
 *   description: API para la gestión de sedes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sede:
 *       type: object
 *       required:
 *         - nombreSede
 *         - direccion
 *         - telefonoSede
 *         - tipoServicio
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la sede
 *         nombreSede:
 *           type: string
 *           description: Nombre de la sede
 *         direccion:
 *           type: string
 *           description: Dirección de la sede
 *         telefonoSede:
 *           type: string
 *           description: Teléfono de la sede
 *         tipoServicio:
 *           type: string
 *           description: Tipo de servicio ofrecido en la sede
 *       example:
 *         nombreSede: "Sede Principal"
 *         direccion: "Calle 123"
 *         telefonoSede: "123456789"
 *         tipoServicio: "Consulta General"
 */


module.exports = function (app, conexion) {

    
    
    /**
     * @swagger
     * /sedes:
     *   get:
     *     summary: Retorna la lista de todas las sedes
     *     tags: [Sedes]
     *     responses:
     *       200:
     *         description: La lista de sedes
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Sede'
     *       404:
     *         description: No se encontraron sedes
     */
    app.get('/sedes', (req, res) => {
        const query = `SELECT * FROM sedes;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de sedes`)
            }
        })
    })

    
    
    /**
     * @swagger
     * /sedes/{id}:
     *   get:
     *     summary: Obtiene una sede por su ID
     *     tags: [Sedes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la sede
     *     responses:
     *       200:
     *         description: Información de la sede por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Sede'
     *       404:
     *         description: Sede no encontrada
     */
    app.get('/sedes/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM sedes WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay sedes con ese ID`)
            }
        })
    })

    
    

    /**
     * @swagger
     * /sedes/agregar:
     *   post:
     *     summary: Crea una nueva sede
     *     tags: [Sedes]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Sede'
     *     responses:
     *       200:
     *         description: La sede se registró correctamente
     *       500:
     *         description: Error interno del servidor al agregar la sede
     */
    app.post('/sedes/agregar', (req, res) => {
        const sede = {
            nombreSede: req.body.nombreSede,
            direccion: req.body.direccion,
            telefonoSede: req.body.telefonoSede,
            tipoServicio: req.body.tipoServicio
        };

        const query = `INSERT INTO sedes (nombreSede, direccion, telefonoSede, tipoServicio) VALUES ('${sede.nombreSede}', '${sede.direccion}', '${sede.telefonoSede}', '${sede.tipoServicio}')`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al registrar la sede' });
            }

            res.json('Se registró correctamente la sede');
        });
    });

    
    
    /**
     * @swagger
     * /sedes/actualizar/{id}:
     *   put:
     *     summary: Actualiza una sede existente
     *     tags: [Sedes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la sede a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Sede'
     *     responses:
     *       200:
     *         description: La sede se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la sede
     */
    app.put('/sedes/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { nombreSede, direccion, telefonoSede, tipoServicio } = req.body;

        const query = `
            UPDATE sedes SET nombreSede='${nombreSede}', direccion='${direccion}', telefonoSede='${telefonoSede}', tipoServicio='${tipoServicio}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la sede`);
        });
    });

    
    

    /**
     * @swagger
     * /sedes/borrar/{id}:
     *   delete:
     *     summary: Elimina una sede existente
     *     tags: [Sedes]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la sede a eliminar
     *     responses:
     *       200:
     *         description: La sede se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la sede
     */
    app.delete('/sedes/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM sedes WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente la sede`)
        })
    })
}
