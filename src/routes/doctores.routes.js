import { Router } from 'express'
import { getDoctores, postDoctor, putDoctor, deleteDoctor } from '../controladores/doctoresCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'

const router = Router()

router.get('/doctores', verificarJWT, getDoctores)
router.post('/doctores', verificarJWT, postDoctor)
router.put('/doctores/:id', verificarJWT, putDoctor)
router.delete('/doctores/:id', verificarJWT, deleteDoctor)

export default router
