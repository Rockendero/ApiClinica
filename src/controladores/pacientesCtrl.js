import { conmysql } from '../db.js'

export const getPacientes = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            select u.id, u.nombre, u.correo, u.telefono, 
                   p.cedula, p.fecha_nacimiento, p.tipo_sangre
            from usuarios u 
            inner join pacientes p on u.id = p.usuario_id
            where u.rol = 'paciente'
        `)
        res.json(result)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener pacientes' })
    }
}

export const putPaciente = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, correo, telefono, cedula, fecha_nacimiento, tipo_sangre } = req.body
        await conmysql.query(
            'update usuarios set nombre=?, correo=?, telefono=? where id=?',
            [nombre, correo, telefono, id]
        )
        await conmysql.query(
            'update pacientes set cedula=?, fecha_nacimiento=?, tipo_sangre=? where usuario_id=?',
            [cedula, fecha_nacimiento, tipo_sangre, id]
        )
        res.json({ mensaje: 'Paciente actualizado' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar paciente' })
    }
}

export const deletePaciente = async (req, res) => {
    try {
        const { id } = req.params
        await conmysql.query('delete from pacientes where usuario_id=?', [id])
        await conmysql.query('delete from usuarios where id=?', [id])
        res.json({ mensaje: 'Paciente eliminado' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar paciente' })
    }
}
