import { Router } from 'express'
import { getCitas, postCita, putCita, deleteCita, postAtencion } from '../controladores/citasCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'
import { getAtencion } from '../controladores/citasCtrl.js' 
import { marcarNoLlego } from '../controladores/citasCtrl.js'

const router = Router()

router.post('/citas/no-llego', verificarJWT, marcarNoLlego)
router.get('/citas', verificarJWT, getCitas)
router.post('/citas', verificarJWT, postCita)
router.put('/citas/:id', verificarJWT, putCita)
router.delete('/citas/:id', verificarJWT, deleteCita)
router.post('/atencion', verificarJWT, postAtencion)
router.get('/atencion/:cita_id', verificarJWT, getAtencion)

export default router
