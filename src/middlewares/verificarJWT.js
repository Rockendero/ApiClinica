import jwt from 'jsonwebtoken';
const SECRET = 'clave123';

export const verificarJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Token requerido' });
    }
    try {
        const datos = jwt.verify(token, SECRET);
        req.usuario = datos;
        next();
    } catch {
        res.status(403).json({ mensaje: 'Token inválido' });
    }
};
