import express from 'express';

import { registerController, loginController, userController, productController } from '../controllers/index.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/me', auth, userController.me)
router.post('/logout', loginController.logout)

router.post('/products',[auth, admin], productController.store)
router.put('/products/:id',[auth, admin], productController.update)

export default router;