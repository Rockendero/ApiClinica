import { Router } from 'express'
import { getEspecialidades, postEspecialidad, putEspecialidad, deleteEspecialidad } from '../controladores/especialidadesCtrl.js'
import { verificarJWT } from '../middlewares/verificarJWT.js'

const router = Router()

router.get('/especialidades', verificarJWT, getEspecialidades)
router.post('/especialidades', verificarJWT, postEspecialidad)
router.put('/especialidades/:id', verificarJWT, putEspecialidad)
router.delete('/especialidades/:id', verificarJWT, deleteEspecialidad)

export default router
