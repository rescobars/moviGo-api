import { Router } from 'express';
import { webSocketController } from '../controllers/websocket.controller';

const router = Router();

// WebSocket status and management routes
router.get('/status', webSocketController.getStatus);

// Test routes
router.post('/test/send', webSocketController.sendTestMessage);

// Message sending routes
router.post('/send/user', webSocketController.sendToUser);
router.post('/send/organization', webSocketController.sendToOrganization);
router.post('/send/route', webSocketController.sendToRoute);
router.post('/broadcast', webSocketController.broadcast);

export default router;
