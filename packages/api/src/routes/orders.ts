import { Router } from 'express';
import { authMiddleware } from '../../../auth/src/auth';
import { OrdersController } from '../controllers/orders.controller';

const router: Router = Router();

// Obtener todos los pedidos de una organización
router.get('/organization/:organization_uuid', authMiddleware, OrdersController.getAll);

// Obtener pedidos pendientes de una organización
router.get('/organization/:organization_uuid/pending', authMiddleware, OrdersController.getPending);

// Obtener un pedido por UUID
router.get('/:uuid', authMiddleware, OrdersController.getByUuid);

// Crear un nuevo pedido
router.post('/', authMiddleware, OrdersController.create);

// Crear múltiples pedidos
router.post('/bulk', authMiddleware, OrdersController.bulkCreate);

// Actualizar un pedido
router.put('/:uuid', authMiddleware, OrdersController.update);

// Eliminar un pedido
router.delete('/:uuid', authMiddleware, OrdersController.delete);

export default router;
