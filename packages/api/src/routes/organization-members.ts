import { Router } from 'express';
import { authMiddleware } from '../../../auth/src/auth';
import { OrganizationMembersController } from '../controllers/organization-members.controller';

const router: Router = Router();

/**
 * @swagger
 * /api/organization-members:
 *   post:
 *     summary: Crear miembro de organización
 *     description: Crea un nuevo miembro en una organización con roles específicos
 *     tags: [Organization Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organization_id
 *               - user_id
 *               - roles
 *             properties:
 *               organization_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la organización
 *               user_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID del usuario
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role_name:
 *                       type: string
 *                       enum: [PLATFORM_ADMIN, OWNER, DRIVER, VIEWER]
 *                       example: "DRIVER"
 *                     description:
 *                       type: string
 *                       example: "Conductor de la organización"
 *     responses:
 *       201:
 *         description: Miembro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Organization member created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     member:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         uuid:
 *                           type: string
 *                           format: uuid
 *                           example: "550e8400-e29b-41d4-a716-446655440000"
 *                         organization_id:
 *                           type: integer
 *                           example: 1
 *                         user_id:
 *                           type: integer
 *                           example: 2
 *                         member_since:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-25T17:10:43.265Z"
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           uuid:
 *                             type: string
 *                             format: uuid
 *                             example: "550e8400-e29b-41d4-a716-446655440001"
 *                           role_name:
 *                             type: string
 *                             example: "DRIVER"
 *                           description:
 *                             type: string
 *                             example: "Conductor de la organización"
 *       400:
 *         description: Datos inválidos o usuario ya es miembro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, OrganizationMembersController.createMember);

/**
 * @swagger
 * /api/organization-members/invite:
 *   post:
 *     summary: Invitar miembro por email
 *     description: Invita a un usuario por email a unirse a una organización
 *     tags: [Organization Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organization_id
 *               - email
 *               - name
 *               - roles
 *             properties:
 *               organization_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la organización
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nuevo@ejemplo.com"
 *                 description: Email del usuario a invitar
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *                 description: Nombre del usuario
 *               roles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role_name:
 *                       type: string
 *                       enum: [PLATFORM_ADMIN, OWNER, DRIVER, VIEWER]
 *                       example: "DRIVER"
 *                     description:
 *                       type: string
 *                       example: "Conductor de la organización"
 *     responses:
 *       201:
 *         description: Invitación enviada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Invitation sent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     member:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         uuid:
 *                           type: string
 *                           format: uuid
 *                           example: "550e8400-e29b-41d4-a716-446655440000"
 *                         organization_id:
 *                           type: integer
 *                           example: 1
 *                         user_id:
 *                           type: integer
 *                           example: 2
 *                         member_since:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-25T17:10:43.265Z"
 *                     invitation_url:
 *                       type: string
 *                       format: uri
 *                       example: "http://localhost:3000/organizations/join?memberId=550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: Datos inválidos o email ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// router.post('/invite', authMiddleware, OrganizationMembersController.inviteMember);

/**
 * @swagger
 * /api/organization-members/public-create-with-verification:
 *   post:
 *     summary: Crear miembro público con verificación de email
 *     description: Crea un nuevo miembro DRIVER en una organización y envía código de verificación por email (endpoint público)
 *     tags: [Organization Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organization_uuid
 *               - email
 *               - name
 *             properties:
 *               organization_uuid:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *                 description: UUID de la organización
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nuevo@ejemplo.com"
 *                 description: Email del usuario
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *                 description: Nombre del usuario

 *               title:
 *                 type: string
 *                 example: "Conductor"
 *                 description: Título o cargo del usuario (opcional - solo se asigna rol DRIVER)
 *     responses:
 *       201:
 *         description: Miembro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         status:
 *                           type: string
 *                     member:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         uuid:
 *                           type: string
 *                           format: uuid
 *                         organization_id:
 *                           type: integer
 *                         user_id:
 *                           type: integer
 *                         status:
 *                           type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           role_name:
 *                             type: string
 *                           description:
 *                             type: string
 *                     emailSent:
 *                       type: boolean
 *                 message:
 *                   type: string
 *                   example: "Member created successfully. Please check your email for verification code."
 *       400:
 *         description: Datos inválidos o usuario ya existe
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
 */
router.post('/public-create-with-verification', OrganizationMembersController.publicCreateWithVerification);

export default router;
