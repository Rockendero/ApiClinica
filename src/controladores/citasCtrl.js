import { conmysql } from '../db.js'

export const getCitas = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            select c.*, 
                   u1.nombre as paciente_nombre,
                   u2.nombre as doctor_nombre,
                   e.nombre as especialidad
            from citas c
            inner join pacientes p on c.paciente_id = p.id
            inner join usuarios u1 on p.usuario_id = u1.id
            inner join doctores d on c.doctor_id = d.id
            inner join usuarios u2 on d.usuario_id = u2.id
            inner join especialidades e on d.especialidad_id = e.id
            order by c.fecha, c.hora
        `)
        res.json(result)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener citas' })
    }
}

export const postCita = async (req, res) => {
    try {
        const { paciente_id, doctor_id, fecha, hora, motivo } = req.body
        const [existe] = await conmysql.query(`select id from citas where doctor_id=? and fecha=? and hora=? and estado in ('pendiente','en_curso')`, [doctor_id, fecha, hora])
        if (existe.length > 0)
            return res.status(400).json({ mensaje: 'El doctor ya tiene una cita en ese horario' })
        const [result] = await conmysql.query(
            'insert into citas (paciente_id, doctor_id, fecha, hora, motivo, estado) values (?,?,?,?,?,?)',
            [paciente_id, doctor_id, fecha, hora, motivo, 'pendiente']
        )
        res.json({ id: result.insertId })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear cita' })
    }
}

export const putCita = async (req, res) => {
    try {
      const { id } = req.params
      const campos = req.body
      const sets = []
      const valores = []
        if (campos.fecha !== undefined) { sets.push('fecha=?'); valores.push(campos.fecha) }
        if (campos.hora !== undefined) { sets.push('hora=?'); valores.push(campos.hora) }
        if (campos.motivo !== undefined) { sets.push('motivo=?'); valores.push(campos.motivo) }
        if (campos.estado !== undefined) { sets.push('estado=?'); valores.push(campos.estado) }
        if (campos.motivo_cancelacion !== undefined) { sets.push('motivo_cancelacion=?'); valores.push(campos.motivo_cancelacion) }
        if (campos.motivo_reagenda !== undefined) { sets.push('motivo_reagenda=?'); valores.push(campos.motivo_reagenda) }
        if (campos.cita_original_id !== undefined) { sets.push('cita_original_id=?'); valores.push(campos.cita_original_id) }
        if (sets.length === 0) return res.status(400).json({ mensaje: 'Nada que actualizar' })
          valores.push(id)
          await conmysql.query(`update citas set ${sets.join(', ')} where id=?`, valores)
        res.json({ mensaje: 'Cita actualizada' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar cita' })
    }
}

export const deleteCita = async (req, res) => {
    try {
        const { id } = req.params
        await conmysql.query('delete from citas where id=?', [id])
        res.json({ mensaje: 'Cita eliminada' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar cita' })
    }
}

export const postAtencion = async (req, res) => {
    try {
        const { cita_id, observaciones, receta } = req.body
        await conmysql.query(
            'insert into atencion (cita_id, observaciones, receta) values (?,?,?)',
            [cita_id, observaciones, receta]
        )
        await conmysql.query('update citas set estado=? where id=?', ['atendido', cita_id])
        res.json({ mensaje: 'Atención registrada' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar atención' })
    }
}

export const getAtencion = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            'select * from atencion where cita_id=?', [req.params.cita_id]
        )
        res.json(result.length > 0 ? result[0] : null)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener atención' })
    }
}

export const marcarNoLlego = async (req, res) => {
  try {
    await conmysql.query(`update citas set estado='no_llego' where estado in ('pendiente', 'reagendado') and DATE_ADD(CONCAT(fecha, ' ', hora), INTERVAL 30 MINUTE) < NOW()`)
      res.json({ mensaje: 'Citas actualizadas' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error' })
    }
}
