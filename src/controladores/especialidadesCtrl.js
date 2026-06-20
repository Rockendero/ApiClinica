import { conmysql } from '../db.js'

export const getEspecialidades = async (req, res) => {
    try {
        const [result] = await conmysql.query('select * from especialidades')
        res.json(result)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener especialidades' })
    }
}

export const postEspecialidad = async (req, res) => {
    try {
        const { nombre } = req.body
        const [result] = await conmysql.query(
            'insert into especialidades (nombre) values (?)', [nombre]
        )
        res.json({ id: result.insertId })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear especialidad' })
    }
}

export const putEspecialidad = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre } = req.body
        await conmysql.query('update especialidades set nombre=? where id=?', [nombre, id])
        res.json({ mensaje: 'Especialidad actualizada' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar especialidad' })
    }
}

export const deleteEspecialidad = async (req, res) => {
    try {
        const { id } = req.params
        await conmysql.query('delete from especialidades where id=?', [id])
        res.json({ mensaje: 'Especialidad eliminada' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar especialidad' })
    }
}