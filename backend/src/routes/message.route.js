import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js'


const router = express.Router();

router.get('/users', authMiddleware, getUsersForSidebar)
router.get('/:id', authMiddleware, getMessages)

router.post('/send/:id', authMiddleware, sendMessage)

export default router;