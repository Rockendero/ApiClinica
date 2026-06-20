import { conmysql } from '../db.js'
import md5 from 'md5'

export const getDoctores = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            select u.id, u.nombre, u.correo, u.telefono,
                   d.especialidad_id, e.nombre as especialidad,
                   d.sueldo, d.horario, d.consultorio
            from usuarios u
            inner join doctores d on u.id = d.usuario_id
            inner join especialidades e on d.especialidad_id = e.id
            where u.rol = 'doctor'
        `)
        res.json(result)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener doctores' })
    }
}

export const postDoctor = async (req, res) => {
    try {
        const { usuario, nombre, correo, telefono, especialidad_id, sueldo, horario, consultorio } = req.body
        const clave = md5('doctor123')

        const [result] = await conmysql.query(
            'insert into usuarios (usuario, clave, nombre, correo, telefono, rol) values (?,?,?,?,?,?)',
            [usuario, clave, nombre, correo, telefono, 'doctor']
        )
        const usuarioId = result.insertId

        await conmysql.query(
            'insert into doctores (usuario_id, especialidad_id, sueldo, horario, consultorio) values (?,?,?,?,?)',
            [usuarioId, especialidad_id, sueldo, horario, consultorio]
        )
        res.json({ mensaje: 'Doctor creado', id: usuarioId, clave_inicial: 'doctor123' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear doctor' })
    }
}

export const putDoctor = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, correo, telefono, especialidad_id, sueldo, horario, consultorio } = req.body
        await conmysql.query(
            'update usuarios set nombre=?, correo=?, telefono=? where id=?',
            [nombre, correo, telefono, id]
        )
        await conmysql.query(
            'update doctores set especialidad_id=?, sueldo=?, horario=?, consultorio=? where usuario_id=?',
            [especialidad_id, sueldo, horario, consultorio, id]
        )
        res.json({ mensaje: 'Doctor actualizado' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar doctor' })
    }
}

export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params
        await conmysql.query('delete from doctores where usuario_id=?', [id])
        await conmysql.query('delete from usuarios where id=?', [id])
        res.json({ mensaje: 'Doctor eliminado' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar doctor' })
    }
}
