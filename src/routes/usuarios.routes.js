import { Router } from 'express'
import { login, registro, getUsuarios } from '../controladores/usuariosCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'

const router = Router()

router.post('/login', login)
router.post('/registro', registro)
router.get('/usuarios', verificarJWT, getUsuarios)

export default router