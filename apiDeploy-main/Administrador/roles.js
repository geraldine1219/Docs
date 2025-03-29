/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API para la gestión de roles de usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       required:
 *         - nombreRol
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del rol
 *         nombreRol:
 *           type: string
 *           description: Nombre del rol
 *       example:
 *         nombreRol: "Administrador"
 */

module.exports = function (app, conexion) {



    /**
     * @swagger
     * /roles:
     *   get:
     *     summary: Retorna la lista de todos los roles
     *     tags: [Roles]
     *     responses:
     *       200:
     *         description: La lista de roles
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Rol'
     *       404:
     *         description: No se encontraron roles
     */
    app.get('/roles', (req, res) => {
        const query = `SELECT * FROM roles;`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay registros de roles`)
            }
        })
    })



    /**
     * @swagger
     * /roles/{id}:
     *   get:
     *     summary: Obtiene el rol por su ID
     *     tags: [Roles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del rol
     *     responses:
     *       200:
     *         description: Información del rol por ID
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Rol'
     *       404:
     *         description: Rol no encontrado
     */
    app.get('/roles/:id', (req, res) => {
        const { id } = req.params

        const query = `SELECT * FROM roles WHERE id=${id};`
        conexion.query(query, (error, resultado) => {
            if (error) return console.error(error.message)

            if (resultado.length > 0) {
                res.json(resultado)
            } else {
                res.json(`No hay roles con ese ID`)
            }
        })
    })



    /**
     * @swagger
     * /roles/agregar:
     *   post:
     *     summary: Crea un nuevo rol
     *     tags: [Roles]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Rol'
     *     responses:
     *       200:
     *         description: El rol se registró correctamente
     *       500:
     *         description: Error interno del servidor al agregar el rol
     */

    app.post('/roles/agregar', (req, res) => {
        const roles = {
            nombreRol: req.body.nombreRol,
        };

        const query = `INSERT INTO roles (nombreRol) VALUES ('${roles.nombreRol}')`;

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
     * /roles/actualizar/{id}:
     *   put:
     *     summary: Actualiza un rol existente
     *     tags: [Roles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del rol a actualizar
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Rol'
     *     responses:
     *       200:
     *         description: El rol se actualizó correctamente
     *       500:
     *         description: Error interno del servidor al actualizar el rol
     */
    app.put('/roles/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { nombreRol } = req.body;

        const query = `
            UPDATE roles SET nombreRol='${nombreRol}' WHERE id='${id}';`;

        conexion.query(query, (error) => {
            if (error) {
                console.error(error.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            res.json(`Se actualizó correctamente el rol`);
        });
    });



    /**
     * @swagger
     * /roles/borrar/{id}:
     *   delete:
     *     summary: Elimina un rol existente
     *     tags: [Roles]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID del rol a eliminar
     *     responses:
     *       200:
     *         description: El rol se eliminó correctamente
     *       500:
     *         description: Error interno del servidor al eliminar el rol
     */
    app.delete('/roles/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM roles WHERE id=${id};`
        conexion.query(query, (error) => {
            if (error) console.error(error.message)

            res.json(`Se eliminó correctamente el rol`)
        })
    })
}
