import { Router } from 'express';
import { driverLastPositionController } from '../controllers/driver-last-position.controller';

const router: Router = Router();

// Obtener última posición de un driver específico
router.get('/drivers/:driverId/last-position', driverLastPositionController.getDriverLastPosition);

// Obtener últimas posiciones de múltiples drivers
router.post('/drivers/last-positions', driverLastPositionController.getMultipleDriverLastPositions);

// Obtener últimas posiciones de todos los drivers de una organización
router.get('/organizations/:organizationId/drivers/last-positions', driverLastPositionController.getOrganizationDriverLastPositions);


// Verificar estado de Redis
router.get('/redis/status', driverLastPositionController.getRedisStatus);

export default router;
