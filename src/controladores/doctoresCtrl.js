import { conmysql } from '../db.js'
import md5 from 'md5'

export const getDoctores = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            select u.id as usuario_id, d.id as doctor_id, u.usuario, u.nombre, u.correo, u.telefono, u.cedula,
                   d.especialidad_id, e.nombre as especialidad,
                   d.sueldo, d.horario, d.consultorio, d.foto
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
        const foto = req.file ? req.file.path : null

        const [existeUsuario] = await conmysql.query(
            'select id from usuarios where usuario=?', [usuario]
        )
        if (existeUsuario.length > 0)
            return res.status(400).json({ mensaje: 'El usuario ya existe' })

        const clave = md5('doctor123')
        const [result] = await conmysql.query(
            'insert into usuarios (usuario, clave, nombre, correo, telefono, rol) values (?,?,?,?,?,?)',
            [usuario, clave, nombre, correo, telefono, 'doctor']
        )
        const usuarioId = result.insertId

        await conmysql.query(
            'insert into doctores (usuario_id, especialidad_id, sueldo, horario, consultorio, foto) values (?,?,?,?,?,?)',
            [usuarioId, especialidad_id, sueldo, horario, consultorio, foto]
        )
        res.json({ mensaje: 'Doctor creado', id: usuarioId, clave_inicial: 'doctor123' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear doctor' })
    }
}

export const putDoctor = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, correo, telefono, cedula, especialidad_id, sueldo, horario, consultorio } = req.body
    const foto = req.file ? req.file.path : req.body.foto
      if (cedula) {
        const [existeCedula] = await conmysql.query( 'select id from usuarios where cedula=? and id!=?', [cedula, id])
      if (existeCedula.length > 0)
         return res.status(400).json({ mensaje: 'La cédula ya está registrada' })
      }
        await conmysql.query('update usuarios set nombre=?, correo=?, telefono=?, cedula=? where id=?', [nombre, correo, telefono, cedula, id])
        await conmysql.query('update doctores set especialidad_id=?, sueldo=?, horario=?, consultorio=?, foto=? where usuario_id=?', [especialidad_id, sueldo, horario, consultorio, foto, id])
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
