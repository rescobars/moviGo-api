import { Router } from 'express';
import { RoutesController } from '../controllers/routes.controller';
import { RouteService } from '../services/route.service';
import { RouteRepository } from '../../../database/src/repositories/route.repository';
import { RouteOrderRepository } from '../../../database/src/repositories/route-order.repository';

const router: Router = Router();

// Initialize dependencies once
const routeRepository = new RouteRepository(null as any); // Will be injected per request
const routeOrderRepository = new RouteOrderRepository(null as any); // Will be injected per request
const routeService = new RouteService(routeRepository, routeOrderRepository);
const routesController = new RoutesController(routeService);

// Route endpoints - only create
router.post('/', async (req, res) => {
  // Inject knex instance into repositories
  (routeRepository as any).knex = (req as any).knex;
  (routeOrderRepository as any).knex = (req as any).knex;
  
  await routesController.createRoute(req, res);
});

export default router;
