import express from 'express'
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.put('/update-profile', authMiddleware, updateProfile)

router.get('/check', authMiddleware, checkAuth)

export default router;