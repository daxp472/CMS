# Frontend → Backend API Mapping

## Auth
Login Page
- POST /api/auth/login
- GET /api/auth/me

## FIR
Create FIR Page
- POST /api/firs

## Cases
My Cases Page
- GET /api/cases/my

Case Details Page
- GET /api/cases/:caseId

Assign Case (SHO)
- POST /api/cases/:caseId/assign

## Investigation
Add Evidence
- POST /api/cases/:caseId/evidence

List Evidence
- GET /api/cases/:caseId/evidence

## Court
Submit to Court
- POST /api/cases/:caseId/submit-to-court

Court Intake
- POST /api/cases/:caseId/intake
