import { Router } from 'express'
import { getPacientes, putPaciente, deletePaciente } from '../controladores/pacientesCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'

const router = Router()

router.get('/pacientes', verificarJWT, getPacientes)
router.put('/pacientes/:id', verificarJWT, putPaciente)
router.delete('/pacientes/:id', verificarJWT, deletePaciente)

export default router
