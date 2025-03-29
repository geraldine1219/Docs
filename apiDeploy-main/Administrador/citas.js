/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: API para la gestión de citas médicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cita:
 *       type: object
 *       required:
 *         - fecha
 *         - hora
 *         - paciente
 *         - medico
 *         - especialidad
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la cita
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la cita
 *         hora:
 *           type: string
 *           description: Hora de la cita
 *         paciente:
 *           type: string
 *           description: ID del paciente
 *         medico:
 *           type: string
 *           description: ID del médico
 *         especialidad:
 *           type: string
 *           description: Especialidad de la cita
 *         facturacion:
 *           type: string
 *           description: Estado de la facturación de la cita
 *         estado:
 *           type: string
 *           description: Estado de la cita (pendiente/completada/cancelada)
 *       example:
 *         fecha: "2024-03-25"
 *         hora: "10:00"
 *         paciente: "1126447331"
 *         medico: "123456789"
 *         especialidad: "Neurología"
 *         facturacion: "pendiente"
 *         estado: "pendiente"
 */

module.exports = function (app, conexion) {
    

    /**
     * @swagger
     * /citas:
     *   get:
     *     summary: Retorna la lista de todas las citas
     *     tags: [Citas]
     *     responses:
     *       200:
     *         description: La lista de citas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Cita'
     */
    app.get('/citas', (req, res) => {
        const query = `SELECT * FROM citas;`
        conexion.query(query, (error, resultado) => {
            if(error) return console.error(error.message)

            if(resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay citas`)
            }
        })
    })



    /**
     * @swagger
     * /citas/{id}:
     *   get:
     *     summary: Obtiene la cita por su ID
     *     tags: [Citas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la cita
     *     responses:
     *       200:
     *         description: Información de la cita por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cita'
     *       404:
     *         description: Cita no encontrada
     */
    app.get('/citas/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM citas WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if(error) return console.error(error.message)

            if(resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay citas`)
            }
        })
    })


    /**
     * @swagger
     * /citas/agregar:
     *   post:
     *     summary: Crea una nueva cita
     *     tags: [Citas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Cita'
     *     responses:
     *       200:
     *         description: La cita se registró correctamente
     *       500:
     *         description: Error interno del servidor al registrar la cita
     */

    app.post('/citas/agregar', (req, res) => {
        const citas = {
            fecha: req.body.fecha,
            hora: req.body.hora,
            paciente: req.body.paciente,
            medico: req.body.medico,
            especialidad: req.body.especialidad
        };
    
        const query = `
            INSERT INTO citas (fecha, hora, paciente, medico, especialidad, facturacion, estado )
            VALUES (
                '${citas.fecha}',
                '${citas.hora}',
                '${citas.paciente}',
                '${citas.medico}',
                '${citas.especialidad}',
                'pendiente',
                'pendiente'
            );
        `;
    
        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error al agregar la cita' });
            }
    
            res.json(`Se agregó correctamente la cita`);
        });
    });
    
    

    /**
     * @swagger
     * /citas/actualizar/{id}:
     *   put:
     *     summary: Actualiza una cita existente
     *     tags: [Citas]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la cita a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Cita'
     *     responses:
     *       200:
     *         description: La cita se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la cita
     */
    app.put('/citas/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { fecha, hora, paciente, medico, especialidad, facturacion, estado } = req.body;
    
        const query = `UPDATE citas SET fecha='${fecha}', hora='${hora}', paciente='${paciente}', medico='${medico}', especialidad='${especialidad}', facturacion='${facturacion}' , estado='${estado}' WHERE id='${id}';`;
    
        conexion.query(query, (error) => {
        if (error) return console.error(error.message);
    
        res.json(`Se actualizó correctamente la cita`);
        });
    });
    


    /**
 * @swagger
 * /citas/borrar/{id}:
 *   delete:
 *     summary: Elimina una cita existente
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la cita a eliminar
 *     responses:
 *       200:
 *         description: La cita se eliminó correctamente
 *       500:
 *         description: Error interno del servidor al eliminar la cita
 */
    app.delete('/citas/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM citas WHERE id=${id};`
        conexion.query(query, (error) => {
            if(error) console.error(error.message)

            res.json(`Se eliminó correctamente la cita`)
        })
    })
}