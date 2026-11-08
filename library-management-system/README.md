# Library Management System

A library management API built with NestJS, Prisma ORM, and PostgreSQL.

## Project structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/prisma/prisma.service.ts
│   └── .env.example
└── README.md
```

## Database setup

1. Install the API dependencies, including `@prisma/client`, `prisma`, and `@nestjs/common`.
2. Create a PostgreSQL database for the project.
3. Copy `api/.env.example` to `api/.env` and replace the placeholder with your local database URL. Do not commit `api/.env`.
4. From the `api` directory, run:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx tsx prisma/seed.ts
   ```

The seed script creates four genres and fifteen books. It uses upserts, so it can be run again without duplicating ISBN records.

## Schema Decisions

The `Book` model stores a `genreId` foreign key and uses Prisma's `@relation` to reference the `Genre` model. This is appropriate because PostgreSQL is a relational database, where relationships between tables are represented using foreign keys.

Keeping each genre in one `Genre` row avoids repeating the same genre name and details in every book record. If a genre name changes, it can be updated once instead of updating many books. The foreign key also ensures that a book cannot refer to a genre that does not exist. One genre can be related to many books, which is a one-to-many relationship. This design reduces duplicated data and improves data consistency.

The `Role` enum limits user roles to `PATRON` and `LIBRARIAN`. Unique constraints on email, genre name, and ISBN help prevent duplicate records.

## Notes

- `api/.env.example` contains a placeholder only. Keep real environment files out of Git.
- The Prisma service connects when its NestJS module starts and disconnects when it shuts down.
