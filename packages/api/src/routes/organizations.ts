import { Router } from 'express';
import { authMiddleware } from '../../../auth/src/auth';
import { OrganizationsController } from '../controllers/organizations.controller';

const router: Router = Router();

/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Obtener todas las organizaciones
 *     description: Retorna una lista de todas las organizaciones (requiere permisos de administrador)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         description: Filtrar por estado de la organización
 *       - in: query
 *         name: plan_type
 *         schema:
 *           type: string
 *           enum: [FREE, BASIC, PRO, ENTERPRISE]
 *         description: Filtrar por tipo de plan
 *     responses:
 *       200:
 *         description: Lista de organizaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Organization'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Sin permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 */
router.get('/', authMiddleware, OrganizationsController.getAll);

/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Crear nueva organización
 *     description: Crea una nueva organización (requiere permisos de administrador)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nueva Empresa"
 *                 description: Nombre de la organización
 *               slug:
 *                 type: string
 *                 example: "nueva-empresa"
 *                 description: Slug único de la organización
 *               description:
 *                 type: string
 *                 example: "Descripción de la nueva empresa"
 *               domain:
 *                 type: string
 *                 example: "nuevaempresa.com"
 *               logo_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/logo.png"
 *               website_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://nuevaempresa.com"
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 example: "contacto@nuevaempresa.com"
 *               contact_phone:
 *                 type: string
 *                 example: "+502 5000-0000"
 *               address:
 *                 type: string
 *                 example: "Dirección de la empresa"
 *               plan_type:
 *                 type: string
 *                 enum: [FREE, BASIC, PRO, ENTERPRISE]
 *                 example: "BASIC"
 *               subscription_expires_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T00:00:00.000Z"
 *                 description: Fecha de expiración de la suscripción
 *     responses:
 *       201:
 *         description: Organización creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Sin permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 */
router.post('/', authMiddleware, OrganizationsController.create);

/**
 * @swagger
 * /api/organizations/{uuid}:
 *   get:
 *     summary: Obtener organización por UUID
 *     description: Retorna los detalles de una organización específica
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "c8d82f56-4876-4146-9739-232c3d30f785"
 *         description: UUID de la organización
 *     responses:
 *       200:
 *         description: Detalles de la organización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 */
router.get('/:uuid', authMiddleware, OrganizationsController.getByUuid);

/**
 * @swagger
 * /api/organizations/{uuid}:
 *   put:
 *     summary: Actualizar organización
 *     description: Actualiza los datos de una organización existente
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "c8d82f56-4876-4146-9739-232c3d30f785"
 *         description: UUID de la organización
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Empresa Actualizada"
 *               description:
 *                 type: string
 *                 example: "Nueva descripción"
 *               domain:
 *                 type: string
 *                 example: "empresaactualizada.com"
 *               logo_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/new-logo.png"
 *               website_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://empresaactualizada.com"
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 example: "nuevo@empresaactualizada.com"
 *               contact_phone:
 *                 type: string
 *                 example: "+502 5000-0001"
 *               address:
 *                 type: string
 *                 example: "Nueva dirección"
 *               plan_type:
 *                 type: string
 *                 enum: [FREE, BASIC, PRO, ENTERPRISE]
 *                 example: "PRO"
 *     responses:
 *       200:
 *         description: Organización actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Organización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Sin permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 */
router.put('/:uuid', authMiddleware, OrganizationsController.update);

/**
 * @swagger
 * /api/organizations/{uuid}/status:
 *   patch:
 *     summary: Cambiar estado de la organización
 *     description: Activa, pausa o suspende una organización
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "c8d82f56-4876-4146-9739-232c3d30f785"
 *         description: UUID de la organización
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *                 example: "SUSPENDED"
 *                 description: Nuevo estado de la organización
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Organization'
 *       400:
 *         description: Estado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Organización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Sin permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 */
router.patch('/:uuid/status', authMiddleware, OrganizationsController.updateStatus);

/**
 * @swagger
 * /api/organizations/{uuid}:
 *   delete:
 *     summary: Eliminar organización
 *     description: Elimina permanentemente una organización y todos sus datos asociados
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "c8d82f56-4876-4146-9739-232c3d30f785"
 *         description: UUID de la organización
 *     responses:
 *       200:
 *         description: Organización eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Organización no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationError'
 *       403:
 *         description: Sin permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 */
router.delete('/:uuid', authMiddleware, OrganizationsController.delete);

export default router;
