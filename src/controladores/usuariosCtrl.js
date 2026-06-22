import { conmysql } from '../db.js'
import md5 from 'md5'
import jwt from 'jsonwebtoken'

const SECRET = 'clave123'

export const login = async (req, res) => {
    try {
        const { usuario, clave } = req.body
        const [result] = await conmysql.query(
            'select * from usuarios where usuario = ?', [usuario]
        )
        if (result.length <= 0)
            return res.status(401).json({ mensaje: 'Usuario no existe' })

        const usuarioBD = result[0]
        if (usuarioBD.clave !== md5(clave))
            return res.status(401).json({ mensaje: 'Clave incorrecta' })

        const token = jwt.sign(
            { id: usuarioBD.id, nombre: usuarioBD.nombre, rol: usuarioBD.rol },
            SECRET,
            { expiresIn: '8h' }
        )
        
        // Después de crear el token, antes del res.json:
        let paciente_id = null;
        if (usuarioBD.rol === 'paciente') {
        const [pacResult] = await conmysql.query(
            'select id from pacientes where usuario_id=?', [usuarioBD.id]
        )
        if (pacResult.length > 0) paciente_id = pacResult[0].id
        }

        res.json({ token, nombre: usuarioBD.nombre, rol: usuarioBD.rol, id: usuarioBD.id, paciente_id })
            } catch (error) {
                res.status(500).json({ mensaje: 'Error en login' })
            }
        }

export const registro = async (req, res) => {
    try {
        const { usuario, clave, nombre, correo, telefono, cedula, fecha_nacimiento, tipo_sangre } = req.body
        
        // Verificar usuario duplicado
        const [existeUsuario] = await conmysql.query(
            'select id from usuarios where usuario=?', [usuario]
        )
        if (existeUsuario.length > 0)
            return res.status(400).json({ mensaje: 'El usuario ya existe' })

        // Verificar cédula duplicada
        const [existeCedula] = await conmysql.query(
            'select id from pacientes where cedula=?', [cedula]
        )
        if (existeCedula.length > 0)
            return res.status(400).json({ mensaje: 'La cédula ya está registrada' })

        const claveEncriptada = md5(clave)
        const [result] = await conmysql.query(
            'insert into usuarios (usuario, clave, nombre, correo, telefono, rol) values (?,?,?,?,?,?)',
            [usuario, claveEncriptada, nombre, correo, telefono, 'paciente']
        )
        const usuarioId = result.insertId

        await conmysql.query(
            'insert into pacientes (usuario_id, cedula, fecha_nacimiento, tipo_sangre) values (?,?,?,?)',
            [usuarioId, cedula, fecha_nacimiento, tipo_sangre]
        )
        res.json({ mensaje: 'Paciente registrado', id: usuarioId })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en registro' })
    }
}

export const getUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('select id, usuario, nombre, correo, telefono, rol from usuarios')
        res.json(result)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' })
    }
}
