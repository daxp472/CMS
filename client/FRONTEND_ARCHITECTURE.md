# NyayaSankalan Frontend Architecture

## Tech Stack
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Design Principles
- Frontend is API-driven (no business logic)
- No localStorage except JWT token
- All permissions enforced by backend
- Frontend only hides/shows UI (not security)

## State Management
- React Context (Auth, User)
- No Redux (overkill)
- Server is source of truth

## Routing Rules
- Protected routes only
- Role-based route guards
- Unauthorized → 403 page

## Error Handling
- Global API error handler
- Toast notifications
- Graceful empty states

## File Upload Rules
- multipart/form-data
- Only allowed types (PDF/JPG/PNG)
- Upload progress indicator
