import express from 'express'
import cors from 'cors'

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());

// rutas se agregarán aquí

app.use((req, res, next) => {
    res.status(400).json({
        message: 'Endpoint not found'
    })
})

export default app;
