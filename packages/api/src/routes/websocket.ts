import { Router } from 'express';
import { webSocketController } from '../controllers/websocket.controller';

const router: Router = Router();

// WebSocket status
router.get('/status', webSocketController.getStatus);

// Test driver transmission
router.post('/test/driver-transmission', webSocketController.sendTestDriverTransmission);

// Message sending routes
router.post('/send/user', webSocketController.sendToUser);
router.post('/send/route', webSocketController.sendToRoute);
router.post('/send/organization', webSocketController.sendToOrganization);

export default router;