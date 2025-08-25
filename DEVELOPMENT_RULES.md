# 🚀 moviGo API - Development Rules

## 📋 **Reglas de Desarrollo para IA**

### 🗄️ **Creación de Tablas (Migrations)**

#### 1. **Campos de Auditoría**
- **TODAS** las tablas deben incluir:
  ```sql
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  ```

#### 2. **Enums PostgreSQL**
- Usar enums nativos de PostgreSQL cuando sea necesario
- **NOMBRES EN MAYÚSCULAS** para todos los enums
- Ejemplo:
  ```sql
  CREATE TYPE USER_STATUS AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
  ```

#### 3. **Identificadores**
- **TODAS** las tablas deben tener:
  - `id` (UUID PRIMARY KEY)
  - `uuid` (UUID UNIQUE, para referencias externas)
  ```sql
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uuid UUID UNIQUE DEFAULT gen_random_uuid()
  ```

#### 4. **Validación con Zod**
- **TODAS** las tablas deben tener sus tipos definidos con Zod
- Los tipos deben estar en `packages/types/src/schemas/`
- Ejemplo:
  ```typescript
  // packages/types/src/schemas/user.ts
  export const UserSchema = z.object({
    id: z.string().uuid(),
    uuid: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
    created_at: z.date(),
    updated_at: z.date()
  });
  ```

### 🔐 **Autenticación y Autorización**

#### 1. **Middleware de Autenticación**
- **TODOS** los endpoints que requieran autenticación deben usar:
  ```typescript
  import { authMiddleware } from '@movigo/auth';
  router.get('/', authMiddleware, controller.method);
  ```

#### 2. **Validación de Tipos**
- Usar los schemas de Zod para validar requests
- Ejemplo:
  ```typescript
  const validatedData = UserSchema.parse(req.body);
  ```

### 🏗️ **Arquitectura de Código**

#### 1. **Estructura de Archivos**
```
packages/
├── api/
│   └── src/
│       ├── routes/
│       │   └── users.ts
│       ├── controllers/
│       │   └── users.controller.ts
│       └── middleware/
│           └── validation.ts
├── database/
│   └── src/
│       ├── repositories/
│       │   └── user.repository.ts
│       └── migrations/
└── types/
    └── src/
        ├── schemas/
        │   └── user.ts
        └── index.ts
```

#### 2. **Patrón Route → Controller → Repository**

**Route** (`packages/api/src/routes/users.ts`):
```typescript
import { Router } from 'express';
import { authMiddleware } from '@movigo/auth';
import { UserController } from '../controllers/users.controller';

const router: Router = Router();

router.get('/', authMiddleware, UserController.getAll);
router.get('/:id', authMiddleware, UserController.getById);
router.post('/', authMiddleware, UserController.create);
router.put('/:id', authMiddleware, UserController.update);
router.delete('/:id', authMiddleware, UserController.delete);

export default router;
```

**Controller** (`packages/api/src/controllers/users.controller.ts`):
```typescript
import { Request, Response } from 'express';
import { UserRepository } from '@movigo/database';
import { UserSchema, CreateUserSchema } from '@movigo/types';

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserRepository.findAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const user = await UserRepository.create(validatedData);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
```

**Repository** (`packages/database/src/repositories/user.repository.ts`):
```typescript
import { Knex } from 'knex';
import { User, CreateUser } from '@movigo/types';

export class UserRepository {
  constructor(private db: Knex) {}

  static async findAll(): Promise<User[]> {
    return db('users')
      .select('*')
      .where('is_active', true);
  }

  static async create(userData: CreateUser): Promise<User> {
    const [user] = await db('users')
      .insert(userData)
      .returning('*');
    return user;
  }
}
```

#### 3. **NO Queries Regadas**
- **PROHIBIDO** escribir queries SQL directamente en controllers
- **PROHIBIDO** escribir queries SQL directamente en routes
- **TODAS** las queries deben estar en repositories
- **TODA** la lógica de negocio debe estar en controllers

### 📝 **Convenciones de Nomenclatura**

#### 1. **Archivos**
- `users.controller.ts` (kebab-case)
- `user.repository.ts` (kebab-case)
- `user.schema.ts` (kebab-case)

#### 2. **Clases**
- `UserController` (PascalCase)
- `UserRepository` (PascalCase)
- `UserSchema` (PascalCase)

#### 3. **Métodos**
- `getAll()` (camelCase)
- `create()` (camelCase)
- `updateById()` (camelCase)

### 🔄 **Flujo de Desarrollo**

1. **Crear Migration** con estructura de tabla
2. **Crear Schema Zod** para validación
3. **Crear Repository** con métodos CRUD
4. **Crear Controller** con lógica de negocio
5. **Crear Routes** con endpoints
6. **Agregar Middleware** de autenticación donde sea necesario

### ✅ **Checklist de Validación**

Antes de crear cualquier endpoint, verificar:
- [ ] Tabla tiene `id`, `uuid`, `created_at`, `updated_at`
- [ ] Enums están en inglés
- [ ] Schema Zod está creado
- [ ] Repository tiene métodos necesarios
- [ ] Controller usa Repository
- [ ] Route usa Controller
- [ ] Middleware de autenticación aplicado
- [ ] NO hay queries SQL fuera de repositories

---

**⚠️ IMPORTANTE**: La IA debe seguir estas reglas estrictamente al generar cualquier código nuevo.
