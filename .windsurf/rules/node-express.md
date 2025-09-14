---
trigger: always_on
description: use this when a nodejs backend is detected
---

# Node.js + Express + TypeScript Rules

- Use **TypeScript strict mode**. Avoid `any`; use `unknown` if uncertain.  
- Use **interfaces** for objects, **types** for unions, **constants** instead of magic strings.  
- Organize code as a **modular monolith** with **feature-driven architecture**:  
  - Each feature has its own `routes`, `controllers`, `services`, `models`.  
  - Place cross-cutting concerns (logging, db, auth, errors) in `core/` or `shared/`.  
- Keep modules **self-contained**. Interact only through exports/interfaces.  
- Always validate and sanitize input. Use `zod`/`joi` for schema validation.  
- Use **async/await** with `try/catch`. Centralize error handling in middleware.  
- Return **standardized JSON** responses with `data`, `message`, and `error`.  
- Use **dotenv** for environment variables. Never commit secrets.  
- Write **unit tests** for services, **integration tests** for routes. Use `supertest`.  
