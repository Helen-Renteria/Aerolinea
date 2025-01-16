import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token = req.headers.authorization

    if(!token) {
        return res.status(401).json({message: 'Token not provided.'})
    }
    // Eliminamos la palabra "Bearer" y dejamos solo el token
    token = token.split(' ')[1]

    try {//payload del token
        const { email, role } = jwt.verify(token, process.env.JWT_SECRET)
        req.email = email
        req.role = role

        next()// Continuamos con el siguiente middleware o la ruta

    } catch (error) {
        console.log(error)
        return res.status(400).json({
                                error: 'Error verifying token.'})
    }
}

export const verifyAdmin = (req, res, next) => {
    if (req.role === 'Superadmin' || req.role === 'usu2') {
        return next()
    }
    return res.status(403).json({error: 'Only admin login!'})
}
