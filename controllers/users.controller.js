import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

// ruta /api/v1/users/regUser
const regUser = async (req, res) => {
    try {
        const { email, password , role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ 
                                ok: false,
                                message: 'Faltan campos!' });
        }
        const user = await UserModel.findOneByEmail(email);
        if (user) {
            return res.status(400).json({ 
                                    ok: true,
                                    message: 'El usuario ya existe' });
        }
        //Password encryption
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = await UserModel.createUser({ email, password: hashedPassword, role });

        const token = jwt.sign({ email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        return res.status(201).json({ 
                                ok: true,
                                message: {
                                token, 
                                role: newUser.role
                                }
                            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ 
                ok: false,
                message: 'Error server' 
            });
        }
}
// ruta /api/v1/users/logUser
const logUser = async (req, res) => {
    console.log('entro al login')
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields!!'});
        }

        const user = await UserModel.findOneByEmail(email)
        if(!user) {
            return res.status(400).json({ 
                error: 'User not found!!' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials!!' });
        }

        const token = jwt.sign({ email: user.email, role: user.role },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        return res.json({ ok: true,
                            message: {
                                token,
                                email: user.email,
                                role: user.role
                            }
                        });

    }catch (error){
        console.log(error)
        return res.status(500).json({ 
            ok: false,
            message: 'Error server' });
    }
}

const profile = async (req, res) => {
    try {
        const user = await UserModel.findOneByEmail(req.email)
        return res.json({
                ok: true,
                message: user
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
                                ok: false,
                                message: 'Error server' 
        });
    }
}

const findAll = async (req, res) => {
    try {
        const users = await UserModel.showUser()
        return res.json({ok: true,
                    message: users
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ 
                                ok: false,
                                message: 'Error server' 
        });
    }
}

export const UserController = {
    regUser,
    logUser,
    findAll,
    profile
}