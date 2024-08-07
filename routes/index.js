import express from 'express';

import { registerController } from '../controllers/index.js';

const router = express.Router();

router.post('/register', registerController.register) // providing the register() method reference [NOTE: not calling the method]




export default router;