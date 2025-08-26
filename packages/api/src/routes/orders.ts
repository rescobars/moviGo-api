import { Router } from 'express';
import { authMiddleware } from '@movigo/auth';
import { OrdersController } from '../controllers/orders.controller';

const router: Router = Router();

// Obtener todos los pedidos de una organización
router.get('/organization/:organization_id', authMiddleware, OrdersController.getAll);

// Obtener pedidos pendientes de una organización
router.get('/organization/:organization_id/pending', authMiddleware, OrdersController.getPending);

// Obtener un pedido por ID
router.get('/:id', authMiddleware, OrdersController.getById);

// Crear un nuevo pedido
router.post('/', authMiddleware, OrdersController.create);

// Crear múltiples pedidos
router.post('/bulk', authMiddleware, OrdersController.bulkCreate);

// Actualizar un pedido
router.put('/:id', authMiddleware, OrdersController.update);

// Eliminar un pedido
router.delete('/:id', authMiddleware, OrdersController.delete);

export default router;
