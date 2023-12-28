import express from 'express';
import { test } from '../controllers/transcriptions.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);

export default router;