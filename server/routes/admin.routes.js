import express from 'express';
import { login, addAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

// Routes handler for Admin - login,Signup
router.post('/login', login);
router.post('/addAdmin', addAdmin);

export default router;
