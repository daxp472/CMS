# NyayaSankalan – Backend APIs & Access Control (FINAL)

This document defines ALL backend APIs required to implement the
complete NyayaSankalan system, mapped 1:1 with:
- Final Database Schema
- Case State Machine
- Role-Based Access Control
- Frontend (Bolt) workflows

====================================================================
ROLES
====================================================================
POLICE
SHO
COURT_CLERK
JUDGE

====================================================================
AUTH & USER CONTEXT
====================================================================

1. POST /api/auth/login
- Login user, issue JWT
Tables: users
Access: ALL

2. GET /api/auth/me
- Get logged-in user context
Tables: users
Access: ALL

====================================================================
ORGANIZATION DATA
====================================================================

3. GET /api/police-stations
Tables: police_stations
Access: POLICE, SHO

4. GET /api/courts
Tables: courts
Access: POLICE, SHO, COURT_CLERK

====================================================================
FIR & CASE CREATION
====================================================================

5. POST /api/firs
- Digitize FIR
- Auto-create Case
- Init state = FIR_REGISTERED
Tables:
- firs
- cases
- case_states
- case_state_history
- audit_logs
Access: POLICE

6. GET /api/firs/:firId
Tables: firs
Access: ALL (read-only)

====================================================================
CASE DISCOVERY
====================================================================

7. GET /api/cases/my
- Assigned cases for Police
Tables: cases, case_assignments, case_states
Access: POLICE

8. GET /api/cases/all
- All cases (role-filtered)
Tables: cases, case_states
Access: SHO, COURT_CLERK, JUDGE

9. GET /api/cases/:caseId
- Case summary
Tables: cases, case_states
Access: Role-based

====================================================================
CASE ASSIGNMENT
====================================================================

10. POST /api/cases/:caseId/assign
- Assign / reassign officer
Tables: case_assignments, audit_logs
Access: SHO

11. GET /api/cases/:caseId/assignments
Tables: case_assignments
Access: SHO, assigned POLICE

====================================================================
CASE STATE MANAGEMENT (CONTROLLED)
====================================================================

12. POST /api/cases/:caseId/state-transition
- Move case through allowed states
Tables:
- case_states
- case_state_history
- audit_logs
Access: SYSTEM (triggered by POLICE/SHO/COURT_CLERK)

====================================================================
INVESTIGATION ACTIVITY
====================================================================

13. POST /api/cases/:caseId/investigation-event
Tables: investigation_events, audit_logs
Access: POLICE

14. GET /api/cases/:caseId/investigation-events
Tables: investigation_events
Access: ALL (read-only)

====================================================================
ACCUSED MANAGEMENT
====================================================================

15. POST /api/cases/:caseId/accused
Tables: accused
Access: POLICE

16. GET /api/cases/:caseId/accused
Tables: accused
Access: ALL

====================================================================
EVIDENCE MANAGEMENT
====================================================================

17. POST /api/cases/:caseId/evidence
Tables: evidence, audit_logs
Access: POLICE

18. GET /api/cases/:caseId/evidence
Tables: evidence
Access: ALL (read-only)

====================================================================
WITNESS MANAGEMENT
====================================================================

19. POST /api/cases/:caseId/witness
Tables: witnesses
Access: POLICE

20. GET /api/cases/:caseId/witnesses
Tables: witnesses
Access: ALL

====================================================================
LEGAL DOCUMENTS (VERSIONED)
====================================================================

21. POST /api/cases/:caseId/documents
- Create/update draft
Tables: documents, audit_logs
Access: POLICE

22. GET /api/cases/:caseId/documents
Tables: documents
Access: ALL

23. POST /api/documents/:documentId/finalize
Tables: documents, audit_logs
Access: POLICE

24. POST /api/documents/:documentId/lock
- System lock after submission
Tables: documents, audit_logs
Access: SYSTEM

====================================================================
DOCUMENT CHECKLIST
====================================================================

25. GET /api/cases/:caseId/checklist
Tables: document_checklists
Access: POLICE, SHO

====================================================================
BAIL TRACKING
====================================================================

26. POST /api/cases/:caseId/bail
Tables: bail_records
Access: POLICE

27. GET /api/cases/:caseId/bail
Tables: bail_records
Access: ALL

====================================================================
POLICE → COURT SUBMISSION
====================================================================

28. POST /api/cases/:caseId/submit-to-court
- Lock case
- Increment submission_version
Tables:
- court_submissions
- case_states
- case_state_history
- documents
- audit_logs
Access: POLICE, SHO

====================================================================
COURT INTAKE
====================================================================

29. GET /api/court/incoming-cases
Tables: court_submissions, cases, case_states
Access: COURT_CLERK

30. POST /api/court/submissions/:submissionId/status
Tables:
- court_submissions
- acknowledgements
- audit_logs
Access: COURT_CLERK

====================================================================
COURT ACTIONS
====================================================================

31. POST /api/cases/:caseId/court-action
Tables:
- court_actions
- case_states
- case_state_history
Access: COURT_CLERK, JUDGE

32. GET /api/cases/:caseId/court-actions
Tables: court_actions
Access: ALL

====================================================================
CASE TIMELINE & HISTORY
====================================================================

33. GET /api/cases/:caseId/timeline
Tables:
- case_state_history
- investigation_events
- court_actions
Access: ALL

====================================================================
AUDIT & SECURITY
====================================================================

34. GET /api/audit/logs
Tables: audit_logs
Access: SHO, COURT_CLERK, JUDGE

35. GET /api/access/logs
Tables: access_logs
Access: SYSTEM / ADMIN

====================================================================
CASE ARCHIVAL
====================================================================

36. POST /api/cases/:caseId/archive
Tables:
- cases
- case_states
- case_state_history
Access: SYSTEM

====================================================================
FINAL NOTES
====================================================================
- Every table in schema is used
- Every frontend action has an API
- No hidden assumptions
- No future-breaking gaps
- Ready for backend implementation
