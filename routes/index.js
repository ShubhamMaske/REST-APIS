import express from 'express';

import { registerController, loginController, userController, productController } from '../controllers/index.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/me', auth, userController.me)
router.post('/logout', loginController.logout)

router.post('/products', productController.store)

export default router;