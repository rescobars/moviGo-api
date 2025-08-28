import { Router } from 'express';
import { RoutesController } from '../controllers/routes.controller';

const router = Router();

// Inicializar controller
const routesController = new RoutesController();

// POST /routes - Crear una nueva ruta completa
router.post('/', (req, res) => routesController.createRoute(req, res));

// DELETE /routes/:uuid - Eliminar una ruta por UUID
router.delete('/:uuid', (req, res) => routesController.deleteRoute(req, res));

export default router;
