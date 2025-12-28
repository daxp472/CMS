# NyayaSankalan – Final Database Schema (LOCKED)

This document is the SINGLE SOURCE OF TRUTH.
All Prisma schemas, migrations, and backend APIs
MUST match this file exactly.

====================================================
CORE PRINCIPLES
====================================================
- FIR already exists legally
- One FIR → One Case (immutable)
- Case is a STATE MACHINE
- No destructive updates
- Police authority ends at court submission
- Court actions are tracked, not automated
- Full auditability is mandatory

====================================================
ENUM DEFINITIONS
====================================================

UserRole:
- POLICE
- SHO
- COURT_CLERK
- JUDGE

OrganizationType:
- POLICE_STATION
- COURT

CourtType:
- MAGISTRATE
- SESSIONS
- HIGH_COURT

FirSource:
- POLICE
- COURT_ORDER

CaseState:
- FIR_REGISTERED
- CASE_ASSIGNED
- UNDER_INVESTIGATION
- INVESTIGATION_PAUSED
- INVESTIGATION_COMPLETED
- CHARGE_SHEET_PREPARED
- CLOSURE_REPORT_PREPARED
- SUBMITTED_TO_COURT
- RETURNED_FOR_DEFECTS
- RESUBMITTED_TO_COURT
- COURT_ACCEPTED
- TRIAL_ONGOING
- JUDGMENT_RESERVED
- DISPOSED
- APPEALED
- ARCHIVED

AccusedStatus:
- ARRESTED
- ON_BAIL
- ABSCONDING

EvidenceCategory:
- PHOTO
- REPORT
- FORENSIC
- STATEMENT

DocumentType:
- CHARGE_SHEET
- EVIDENCE_LIST
- WITNESS_LIST
- CLOSURE_REPORT
- REMAND_APPLICATION

DocumentStatus:
- DRAFT
- FINAL
- LOCKED

BailType:
- POLICE
- ANTICIPATORY
- COURT

BailStatus:
- APPLIED
- GRANTED
- REJECTED

CourtSubmissionStatus:
- SUBMITTED
- UNDER_REVIEW
- ACCEPTED
- RETURNED

CourtActionType:
- COGNIZANCE
- CHARGES_FRAMED
- JUDGMENT

InvestigationEventType:
- SEARCH
- SEIZURE
- STATEMENT
- TRANSFER
- OTHER

====================================================
TABLE DEFINITIONS
====================================================

TABLE: users
- id (UUID, PK)
- name
- email (UNIQUE)
- phone
- role (UserRole)
- organizationType (OrganizationType)
- organizationId
- isActive
- createdAt

TABLE: police_stations
- id (UUID, PK)
- name
- district
- state

TABLE: courts
- id (UUID, PK)
- name
- courtType (CourtType)
- district
- state

TABLE: firs
- id (UUID, PK)
- firNumber
- firSource (FirSource)
- registeredBy (FK → users.id)
- policeStationId (FK → police_stations.id)
- incidentDate
- sectionsApplied
- firDocumentUrl
- createdAt

TABLE: cases
- id (UUID, PK)
- firId (UNIQUE, FK → firs.id)
- createdAt
- isArchived

TABLE: case_states
- caseId (PK, FK → cases.id)
- currentState (CaseState)
- updatedAt

TABLE: case_state_history
- id (UUID, PK)
- caseId (FK → cases.id)
- fromState (CaseState)
- toState (CaseState)
- changedBy (FK → users.id)
- changeReason
- changedAt

TABLE: case_assignments
- id (UUID, PK)
- caseId (FK → cases.id)
- assignedTo (FK → users.id)
- assignedBy (FK → users.id)
- assignmentReason
- assignedAt
- unassignedAt (nullable)

TABLE: accused
- id (UUID, PK)
- caseId (FK → cases.id)
- name
- status (AccusedStatus)

TABLE: investigation_events
- id (UUID, PK)
- caseId (FK → cases.id)
- eventType (InvestigationEventType)
- description
- performedBy (FK → users.id)
- eventDate

TABLE: evidence
- id (UUID, PK)
- caseId (FK → cases.id)
- category (EvidenceCategory)
- fileUrl
- uploadedBy (FK → users.id)
- uploadedAt

TABLE: witnesses
- id (UUID, PK)
- caseId (FK → cases.id)
- name
- statementFileUrl

TABLE: documents
- id (UUID, PK)
- caseId (FK → cases.id)
- documentType (DocumentType)
- version (INT)
- status (DocumentStatus)
- contentJson (JSON)
- createdBy (FK → users.id)
- createdAt

TABLE: document_checklists
- id (UUID, PK)
- caseId (FK → cases.id)
- requiredDocument
- isUploaded

TABLE: bail_records
- id (UUID, PK)
- caseId (FK → cases.id)
- accusedId (FK → accused.id)
- bailType (BailType)
- status (BailStatus)
- orderDocumentUrl
- createdAt

TABLE: court_submissions
- id (UUID, PK)
- caseId (FK → cases.id)
- submissionVersion (INT)
- submittedBy (FK → users.id)
- courtId (FK → courts.id)
- submittedAt
- status (CourtSubmissionStatus)

TABLE: acknowledgements
- id (UUID, PK)
- submissionId (FK → court_submissions.id)
- ackNumber
- ackTime

TABLE: court_actions
- id (UUID, PK)
- caseId (FK → cases.id)
- actionType (CourtActionType)
- orderFileUrl
- actionDate

TABLE: audit_logs
- id (UUID, PK)
- userId (FK → users.id)
- action
- entity
- entityId
- timestamp

TABLE: access_logs
- id (UUID, PK)
- userId (FK → users.id)
- resourceAccessed
- timestamp
