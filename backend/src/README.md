# Backend Folder Structure

This directory follows Express.js best practices for organizing a scalable application.

## Folder Structure

```
src/
├── config/          # Configuration files
│   └── config.ts    # App configuration (database, server settings)
├── controllers/      # Request handlers (business logic orchestration)
│   └── health.controller.ts
├── database/        # Database connection and queries
│   └── connection.ts
├── middleware/      # Custom Express middleware
│   ├── error.middleware.ts
│   └── notFound.middleware.ts
├── routes/          # Route definitions
│   └── health.routes.ts
├── services/        # Business logic (data processing, API calls, etc.)
│   └── health.service.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── response.util.ts
├── app.ts           # Express app setup and middleware
└── index.ts         # Application entry point
```

## Architecture Pattern

This structure follows a **layered architecture** pattern:

1. **Routes** (`routes/`) - Define URL paths and HTTP methods
   - Import controllers
   - Handle route-specific middleware

2. **Controllers** (`controllers/`) - Handle HTTP requests/responses
   - Validate input
   - Call services
   - Format responses
   - Handle errors

3. **Services** (`services/`) - Business logic layer
   - Database operations
   - External API calls
   - Data transformations
   - Complex business rules

4. **Models/Database** (`database/`) - Data access layer
   - Database queries
   - Connection management

## Database Migrations

- Run pending migrations with `npm run migrate:up`
- Revert the last batch with `npm run migrate:down`
- Scaffold a new migration with `npm run migrate:create -- name_of_change`

## Adding New Features

### Example: Creating a "Users" feature

1. **Create a route** (`routes/users.routes.ts`):
```typescript
import { Router } from 'express'
import { usersController } from '../controllers/users.controller.js'

const router = Router()

router.get('/', usersController.getAll)
router.get('/:id', usersController.getById)
router.post('/', usersController.create)

export default router
```

2. **Create a controller** (`controllers/users.controller.ts`):
```typescript
import { Request, Response } from 'express'
import { usersService } from '../services/users.service.js'

export const usersController = {
  getAll: async (req: Request, res: Response) => {
    const users = await usersService.getAll()
    res.json(users)
  },
  // ... other methods
}
```

3. **Create a service** (`services/users.service.ts`):
```typescript
import { query } from '../database/connection.js'

export const usersService = {
  getAll: async () => {
    const result = await query('SELECT * FROM users')
    return result.rows
  },
  // ... other methods
}
```

4. **Register the route** in `app.ts`:
```typescript
import usersRoutes from './routes/users.routes.js'

app.use('/api/users', usersRoutes)
```

## Best Practices

- ✅ Keep controllers thin - they should only orchestrate, not contain business logic
- ✅ Put business logic in services
- ✅ Use services for reusable database operations
- ✅ Keep routes simple - just define paths
- ✅ Handle errors in middleware
- ✅ Use TypeScript types for better code safety

