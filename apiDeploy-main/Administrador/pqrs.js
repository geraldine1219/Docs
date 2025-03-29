/**
 * @swagger
 * tags:
 *   name: PQRS
 *   description: API para la gestión de PQRS (Peticiones, Quejas, Reclamos y Sugerencias)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PQRS:
 *       type: object
 *       required:
 *         - tipo
 *         - descripcion
 *         - email
 *         - telefono
 *         - documento
 *         - estado
 *       properties:
 *         id_pqrs:
 *           type: integer
 *           description: ID único de la PQRS
 *         tipo:
 *           type: string
 *           description: Tipo de la PQRS (Peticion, Queja, Reclamo, Sugerencia, etc.)
 *         descripcion:
 *           type: string
 *           description: Descripción detallada de la PQRS
 *         email:
 *           type: string
 *           description: Correo electrónico del remitente de la PQRS
 *         telefono:
 *           type: string
 *           description: Número de teléfono del remitente de la PQRS
 *         documento:
 *           type: string
 *           description: Documento de identidad del remitente de la PQRS
 *         estado:
 *           type: string
 *           description: Estado actual de la PQRS (Pendiente, En proceso, Resuelta, etc.)
 *       example:
 *         tipo: "Queja"
 *         descripcion: "El servicio de atención al cliente fue deficiente."
 *         email: "usuario@example.com"
 *         telefono: "1234567890"
 *         documento: "1122334455"
 *         estado: "Pendiente"
 */

module.exports = function (app, conexion) {
    


    /**
     * @swagger
     * /pqrs:
     *   get:
     *     summary: Retorna la lista de todas las PQRS
     *     tags: [PQRS]
     *     responses:
     *       200:
     *         description: La lista de PQRS
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/PQRS'
     *       404:
     *         description: No se encontraron PQRS
     */
    app.get('/pqrs', (req, res) => {
        const query = `SELECT * FROM pqrs;`
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
     * /pqrs/{id}:
     *   get:
     *     summary: Obtiene la PQRS por su ID
     *     tags: [PQRS]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la PQRS
     *     responses:
     *       200:
     *         description: Información de la PQRS por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PQRS'
     *       404:
     *         description: PQRS no encontrada
     */
    app.get('/pqrs/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM pqrs WHERE id_pqrs=${id};`
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
     * /pqrs/agregar:
     *   post:
     *     summary: Crea una nueva PQRS
     *     tags: [PQRS]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PQRS'
     *     responses:
     *       200:
     *         description: La PQRS se registró correctamente
     *       500:
     *         description: Error interno del servidor al agregar la PQRS
     */

    app.post('/pqrs/agregar', (req, res) => {
        const pqrs = {
            tipo: req.body.tipo,
            descripcion: req.body.descripcion,
            email: req.body.email,
            telefono: req.body.telefono,
            documento: req.body.documento,
            estado: req.body.estado,            
        };

        const query = `INSERT INTO pqrs (tipo, descripcion, email, telefono, documento, estado) VALUES ('${pqrs.tipo}', '${pqrs.descripcion}', '${pqrs.email}', '${pqrs.telefono}', '${pqrs.documento}', 'Pendiente')`;

        conexion.query(query, (error) => {
        if (error) {
            console.error(error.message);
            return res.status(500).json({ error: 'Error al agregar la PQRS' });
        }
    
        res.json(`Se agregó correctamente la PQRS`);
        });
    });



    /**
     * @swagger
     * /pqrs/actualizar/{id}:
     *   put:
     *     summary: Actualiza una PQRS existente
     *     tags: [PQRS]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la PQRS a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/PQRS'
     *     responses:
     *       200:
     *         description: La PQRS se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la PQRS
     */
    app.put('/pqrs/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { tipo, descripcion, email, telefono, documento, estado } = req.body;
    
        const query = `UPDATE pqrs SET tipo='${tipo}', descripcion='${descripcion}', email='${email}', telefono='${telefono}', documento='${documento}' , estado='${estado}' WHERE id_pqrs='${id}';`;
    
        conexion.query(query, (error) => {
        if (error) return console.error(error.message);
    
        res.json(`Se actualizó correctamente el PQRS`);
        });
    });
    


    /**
     * @swagger
     * /pqrs/borrar/{id}:
     *   delete:
     *     summary: Elimina una PQRS existente
     *     tags: [PQRS]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la PQRS a eliminar
     *     responses:
     *       200:
     *         description: La PQRS se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar la PQRS
     */
    app.delete('/pqrs/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM pqrs WHERE id_pqrs=${id};`
        conexion.query(query, (error) => {
            if(error) console.error(error.message)

            res.json(`Se eliminó correctamente el PQRS`)
        })
    })
}