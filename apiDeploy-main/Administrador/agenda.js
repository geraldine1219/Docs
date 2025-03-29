/**
 * @swagger
 * tags:
 *   name: Agenda
 *   description: API para la gestión de la agenda de citas médicas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agenda:
 *       type: object
 *       required:
 *         - fecha
 *         - hora_inicio
 *         - hora_fin
 *         - medico
 *         - descripcion
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la entrada en la agenda
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la entrada en la agenda
 *         hora_inicio:
 *           type: string
 *           description: Hora de inicio de la cita
 *         hora_fin:
 *           type: string
 *           description: Hora de fin de la cita
 *         medico:
 *           type: string
 *           description: ID del médico asociado a la entrada en la agenda
 *         descripcion:
 *           type: string
 *           description: Descripción de la entrada en la agenda
 *       example:
 *         fecha: "2024-03-25"
 *         hora_inicio: "10:00"
 *         hora_fin: "11:00"
 *         medico: "123456789"
 *         descripcion: "Consulta de rutina"
 */

module.exports = function (app, conexion) {
    

    /**
     * @swagger
     * /agenda:
     *   get:
     *     summary: Retorna la lista de todas las entradas de la agenda
     *     tags: [Agenda]
     *     responses:
     *       200:
     *         description: La lista de entradas de la agenda
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Agenda'
     */
    app.get('/agenda', (req, res) => {
        const query = `SELECT * FROM agenda;`
        conexion.query(query, (error, resultado) => {
            if(error) return console.error(error.message)

            if(resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay agenda`)
            }
        })
    })



    /**
     * @swagger
     * /agenda/{id}:
     *   get:
     *     summary: Obtiene la entrada de la agenda por su ID
     *     tags: [Agenda]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la entrada de la agenda
     *     responses:
     *       200:
     *         description: Información de la entrada de la agenda por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AgendaEntry'
     *       404:
     *         description: Entrada de la agenda no encontrada
     */
    app.get('/agenda/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM agenda WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if(error) return console.error(error.message)

            if(resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay agenda`)
            }
        })
    })


    /**
     * @swagger
     * /agenda/agregar:
     *   post:
     *     summary: Crea una nueva entrada en la agenda
     *     tags: [Agenda]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AgendaEntry'
     *     responses:
     *       200:
     *         description: La entrada de la agenda se agregó correctamente
     *       500:
     *         description: Error interno del servidor al agregar la entrada de la agenda
     */
    app.post('/agenda/agregar', (req, res) => {
        const agenda = {
            fecha: req.body.fecha,
            hora_inicio: req.body.hora_inicio,
            hora_fin: req.body.hora_fin,
            medico: req.body.medico, 
            descripcion: req.body.descripcion,
        };
    
        const query = `INSERT INTO agenda (fecha, hora_inicio, hora_fin, medico, descripcion) VALUES ('${agenda.fecha}', '${agenda.hora_inicio}', '${agenda.hora_fin}', '${agenda.medico}', '${agenda.descripcion}')`;
    
        conexion.query(query, (error) => {
        if (error) {
            console.error(error.message);
            return res.status(500).json({ error: 'Error al agregar la agenda' });
        }
    
        res.json(`Se agregó correctamente la agenda`);
        });
    });



    /**
     * @swagger
     * /agenda/actualizar/{id}:
     *   put:
     *     summary: Actualiza una entrada existente en la agenda
     *     tags: [Agenda]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID de la entrada de la agenda a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AgendaEntry'
     *     responses:
     *       200:
     *         description: La entrada de la agenda se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar la entrada de la agenda
     */
    app.put('/agenda/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { fecha, hora_inicio, hora_fin, descripcion } = req.body;

        const query = `
            UPDATE agenda SET fecha='${fecha}', hora_inicio='${hora_inicio}', hora_fin='${hora_fin}', descripcion='${descripcion}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
            console.error(error.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente la agenda`);
        });
    });

    


    /**
 * @swagger
 * /agenda/borrar/{id}:
 *   delete:
 *     summary: Elimina una entrada de la agenda existente
 *     tags: [Agenda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la entrada de la agenda a eliminar
 *     responses:
 *       200:
 *         description: La entrada de la agenda se eliminó correctamente
 *       500:
 *         description: Error interno del servidor al eliminar la entrada de la agenda
 */
    app.delete('/agenda/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM agenda WHERE id=${id};`
        conexion.query(query, (error) => {
            if(error) console.error(error.message)

            res.json(`Se eliminó correctamente la agenda`)
        })
    })

    // Agrega esta nueva ruta en tu archivo del servidor

    
}