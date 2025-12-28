# NyayaSankalan – Access Control & Schema Usage

This document defines:
- Role-wise access permissions
- Which role uses which tables
- Why each table exists in the system

====================================================================
1. ROLE DEFINITIONS
====================================================================

POLICE OFFICER
- Digitizes FIR
- Conducts investigation
- Uploads evidence
- Creates legal documents
- Submits case to court

SHO / SENIOR OFFICER
- Assigns & reassigns cases
- Sets priority
- Reviews investigation progress
- Approves court submission

COURT CLERK
- Receives submitted cases
- Reviews documents
- Generates acknowledgement
- Updates court intake status

JUDGE
- Read-only access
- Views case timeline
- Uploads court orders

====================================================================
2. ROLE → TABLE ACCESS MATRIX
====================================================================

USERS
- All roles: READ

FIRS
- Police: CREATE, READ
- SHO: READ
- Court/Judge: READ

CASES
- Police: READ (assigned)
- SHO: READ (all)
- Court/Judge: READ (submitted)

CASE_STATES / HISTORY
- System-controlled writes
- All roles: READ
- Judge: READ ONLY

CASE_ASSIGNMENTS
- SHO: CREATE / UPDATE
- Police: READ

INVESTIGATION_EVENTS
- Police: CREATE
- SHO: READ
- Court/Judge: READ

EVIDENCE / WITNESSES
- Police: CREATE, READ
- Others: READ ONLY

DOCUMENTS
- Police: CREATE / UPDATE (until LOCKED)
- Others: READ ONLY

DOCUMENT_CHECKLISTS
- System-managed only
- Read-only for all roles

BAIL_RECORDS
- Police: CREATE / UPDATE
- Court/Judge: READ

COURT_SUBMISSIONS
- Police/SHO: CREATE
- Court Clerk: UPDATE STATUS
- Judge: READ

ACKNOWLEDGEMENTS
- Court Clerk: CREATE
- Police/SHO: READ

COURT_ACTIONS
- Court Clerk/Judge: CREATE
- Others: READ

AUDIT_LOGS / ACCESS_LOGS
- System only
- No manual edits allowed

====================================================================
3. WHY THIS SCHEMA IS SAFE & FINAL
====================================================================

- Matches real criminal case lifecycle
- Supports reassignment, resubmission, delays
- Preserves legal integrity
- Prevents backend refactor disasters
- Frontend maps 1:1 with APIs
- Fully audit-ready

====================================================================
FINAL NOTE
====================================================================

NyayaSankalan is an INTERNAL GOVERNANCE SYSTEM.
This schema prioritizes:
- Accountability
- Immutability
- Legal boundaries
- Long-term scalability

No shortcuts.
No temporary design.
No unsafe assumptions.
