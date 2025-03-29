module.exports = function (app, conexion) {
    
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
    
    
    app.put('/citas/actualizar/:id', (req, res) => {
        const { id } = req.params;
        const { fecha, hora, paciente, medico, facturacion, estado } = req.body;
    
        const query = `UPDATE citas SET fecha='${fecha}', hora='${hora}', paciente='${paciente}', medico='${medico}', facturacion='${facturacion}' , estado='${estado}' WHERE id='${id}';`;
    
        conexion.query(query, (error) => {
        if (error) return console.error(error.message);
    
        res.json(`Se actualizó correctamente la cita`);
        });
    });
    

    app.delete('/citas/borrar/:id', (req, res) => {
        const { id } = req.params

        const query = `DELETE FROM citas WHERE id=${id};`
        conexion.query(query, (error) => {
            if(error) console.error(error.message)

            res.json(`Se eliminó correctamente la cita`)
        })
    })
}