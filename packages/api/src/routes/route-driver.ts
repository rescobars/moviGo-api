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
router.post('/assign', (req, res) => routeDriverController.assignDriverToRoute(req, res));
router.get('/:id', (req, res) => routeDriverController.getRouteDriverById(req, res));
router.put('/:id', (req, res) => routeDriverController.updateRouteDriver(req, res));
router.delete('/:id', (req, res) => routeDriverController.removeDriverFromRoute(req, res));

// Route-specific routes
router.get('/route/:routeId', (req, res) => routeDriverController.getDriversByRoute(req, res));

// Driver-specific routes
router.get('/driver/:driverId', (req, res) => routeDriverController.getRoutesByDriver(req, res));

// Route execution routes
router.post('/:id/start', (req, res) => routeDriverController.startRoute(req, res));
router.post('/:id/complete', (req, res) => routeDriverController.completeRoute(req, res));
router.put('/:id/progress', (req, res) => routeDriverController.updateRouteProgress(req, res));

export default router;
