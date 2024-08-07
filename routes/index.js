import express from 'express';

import { registerController, loginController } from '../controllers/index.js';

const router = express.Router();

router.post('/register', registerController.register) // providing the register() method reference [NOTE: not calling the method]
router.post('/login', loginController.login)



export default router;