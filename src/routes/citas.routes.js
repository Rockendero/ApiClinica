import { Router } from 'express'
import { getCitas, postCita, putCita, deleteCita, postAtencion } from '../controladores/citasCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'

const router = Router()

router.get('/citas', verificarJWT, getCitas)
router.post('/citas', verificarJWT, postCita)
router.put('/citas/:id', verificarJWT, putCita)
router.delete('/citas/:id', verificarJWT, deleteCita)
router.post('/atencion', verificarJWT, postAtencion)

export default router
