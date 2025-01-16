import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js";


const router = Router();

router.post('/regUser', UserController.regUser);
router.post('/logUser', UserController.logUser);
router.get('/home', verifyToken, UserController.profile);


router.get('/', verifyAdmin, verifyToken, UserController.findAll)


export default router;