import { Router } from 'express'
import { login, registro, getUsuarios } from '../controladores/usuariosCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'
import md5 from 'md5'
import { conmysql } from '../db.js'

const router = Router()

router.post('/login', login)
router.post('/registro', registro)
router.get('/usuarios', verificarJWT, getUsuarios)


router.put('/cambiar-clave/:id', verificarJWT, async (req, res) => {
    try {
        const { id } = req.params
        const { clave_actual, clave_nueva } = req.body
        const [result] = await conmysql.query('select * from usuarios where id=?', [id])
        if (result.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' })
        if (result[0].clave !== md5(clave_actual))
            return res.status(401).json({ mensaje: 'Clave actual incorrecta' })
        await conmysql.query('update usuarios set clave=? where id=?', [md5(clave_nueva), id])
        res.json({ mensaje: 'Contraseña actualizada' })
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cambiar contraseña' })
    }
})

export default router