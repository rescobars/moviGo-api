import { Router } from 'express';
import { RouteDriverController } from '../controllers/route-driver.controller';
import { RouteDriverRepository } from '../../../database/src/repositories/route-driver.repository';
import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { RouteDriverService } from '../services/route-driver.service';

const router: Router = Router();

// Initialize dependencies
const routeDriverRepository = new RouteDriverRepository((global as any).knex);
const routeRepository = new RouteRepository((global as any).knex);
const routeDriverService = new RouteDriverService(routeDriverRepository, routeRepository);
const routeDriverController = new RouteDriverController(routeDriverService);

// Route driver assignment routes
router.post('/assign/:routeUuid/:driverUuid', (req, res) => routeDriverController.assignDriverToRoute(req, res));

export default router;