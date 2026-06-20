import express from 'express'
import cors from 'cors'
import usuariosRoutes from './routes/usuarios.routes.js'
import especialidadesRoutes from './routes/especialidades.routes.js'
import pacientesRoutes from './routes/pacientes.routes.js'
import doctoresRoutes from './routes/doctores.routes.js'
import citasRoutes from './routes/citas.routes.js'

const app = express()

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api', usuariosRoutes)
app.use('/api', especialidadesRoutes)
app.use('/api', pacientesRoutes)
app.use('/api', doctoresRoutes)
app.use('/api', citasRoutes)

app.use((req, res, next) => {
    res.status(400).json({ message: 'Endpoint not found' })
})

export default app