# NyayaSankalan – Backend System Documentation

## 1. Overview
**NyayaSankalan** is an **internal Police–Court Case Management & Workflow System**.
It digitizes post-FIR police workflows, police-to-court handover, and court-side tracking without interfering in judicial decision-making.

* **Status:** Internal Tool (Not public-facing/Not a citizen portal).
* **Core Design Philosophy:** Legally safe, Role-based, Audit-friendly, Scalable.

---

## 2. System Scope & Boundaries

### ✅ What NyayaSankalan DOES
* Digitizes FIR-based case records.
* Manages investigation documents & evidence.
* Tracks police-to-court submission.
* Records court acknowledgements & actions.
* Maintains audit trails & timelines.

### ❌ What NyayaSankalan DOES NOT
* Register FIRs for citizens (Public facing).
* Decide bail, guilt, or judgment.
* Replace courts or legal authority.
* Automate judicial reasoning.

---

## 3. User Roles & Access Control

| Role Code | Role Name | Description |
| :--- | :--- | :--- |
| **POLICE** | Police Officer | Registers FIR, investigates case, uploads evidence. |
| **SHO** | Senior Officer / SHO | Assigns officers, approves cases, oversees station. |
| **COURT_CLERK** | Court Clerk | Receives submissions, generates acknowledgements. |
| **JUDGE** | Judge | Read-only access to track cases and documents. |

---

## 4. High-Level Backend Architecture

* **Backend:** Node.js (NestJS recommended for strict structure)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT + Passport
* **Authorization:** RBAC (Role-Based Access Control)
* **File Storage:** AWS S3 / MinIO (Object Storage)
* **API Style:** RESTful JSON

---

## 5. End-to-End Workflow (Logical)

1.  **FIR Registration:** Police Officer enters FIR details.
2.  **Case Creation:** System auto-creates a Case ID linked to FIR.
3.  **Assignment:** SHO assigns a specific Police Officer to the case.
4.  **Investigation:** Officer uploads evidence, statements, and reports.
5.  **Validation:** System checks Document Checklist (prevents submission if incomplete).
6.  **Outcome:** Officer selects Charge Sheet OR Closure Report.
7.  **Submission:** Case is digitally submitted to the Court.
8.  **Acknowledgement:** Court Clerk validates receipt; System generates Ack ID.
9.  **Court Action:** Updates on Cognizance, Charges, or Judgment (Read-only tracking).
10. **Disposal:** Case marked as disposed/archived.

---

## 6. Database Schema (Source of Truth)

### A. Users & Authentication
**`users`**
* `id` (PK, UUID)
* `name`, `email`, `phone`
* `role` (ENUM: POLICE, SHO, COURT_CLERK, JUDGE)
* `police_station_id` (FK, Nullable)
* `court_id` (FK, Nullable)
* `is_active` (Boolean)
* `password_hash`

**`auth_tokens`**
* `id`, `user_id` (FK), `token`, `expires_at`

### B. Organizational Structure
**`police_stations`**
* `id` (PK)
* `name`, `district`, `state`

**`courts`**
* `id` (PK)
* `name`, `district`, `state`
* `court_type` (ENUM: MAGISTRATE, SESSIONS, HIGH_COURT)

### C. FIR & Case Core
**`firs`**
* `id` (PK)
* `fir_number` (Unique)
* `registered_by` (FK -> users.id)
* `police_station_id` (FK)
* `date_of_incident`, `sections_applied`
* `fir_document_url`

**`cases`**
* `id` (PK)
* `fir_id` (FK - One-to-One)
* `current_status` (ENUM: INVESTIGATION, SUBMITTED, IN_COURT, CLOSED)
* `assigned_officer_id` (FK -> users.id)
* `priority` (LOW, MEDIUM, HIGH)

### D. Case Assignment
**`case_assignments`**
* `id` (PK)
* `case_id` (FK)
* `assigned_by` (FK -> SHO), `assigned_to` (FK -> Officer)
* `assigned_at`

### E. Investigation & Evidence
**`evidence`**
* `id` (PK)
* `case_id` (FK)
* `type` (ENUM: PHOTO, REPORT, FORENSIC, STATEMENT)
* `file_url`, `uploaded_by` (FK), `uploaded_at`

**`witnesses`**
* `id` (PK)
* `case_id` (FK)
* `name`, `statement_file_url`

### F. Legal Document Templates
**`documents`**
* `id` (PK)
* `case_id` (FK)
* `document_type` (ENUM: CHARGE_SHEET, CLOSURE_REPORT)
* `content_json`, `status` (DRAFT, FINAL)

### G. Validation & Outcomes
**`document_checklists`**
* `id` (PK)
* `case_id` (FK)
* `required_document`, `is_uploaded` (Boolean)

**`case_outcomes`**
* `id` (PK)
* `case_id` (FK)
* `outcome` (CHARGE_SHEET | CLOSURE)
* `finalized_by` (FK), `finalized_at`

### H. Court Interaction
**`court_submissions`**
* `id` (PK)
* `case_id` (FK)
* `submitted_by` (FK), `submitted_to_court_id` (FK)
* `status` (SUBMITTED, ACCEPTED)
* `submitted_at`

**`acknowledgements`**
* `id` (PK)
* `submission_id` (FK)
* `ack_number`, `ack_time`

**`court_actions`**
* `id` (PK)
* `case_id` (FK)
* `action_type` (COGNIZANCE, VERDICT)
* `order_file_url`, `action_date`

### I. Logs
**`audit_logs`**
* `id`, `user_id`, `action`, `entity_id`, `timestamp`

---

## 7. Role-Based Permissions Matrix

| Action | POLICE | SHO | CLERK | JUDGE |
| :--- | :---: | :---: | :---: | :---: |
| **Register FIR** | ✅ | ❌ | ❌ | ❌ |
| **Assign Case** | ❌ | ✅ | ❌ | ❌ |
| **Upload Evidence** | ✅ | ❌ | ❌ | ❌ |
| **Submit to Court** | ✅ | ✅ | ❌ | ❌ |
| **Acknowledge** | ❌ | ❌ | ✅ | ❌ |
| **View Case** | Assigned Only | Station Only | Incoming | Read-only |

---

## 8. API & Integration Notes

* **Architecture:** REST APIs returning strict JSON.
* **State Management:** IDs (`case_id`) are immutable and used for all lookups.
* **Validation:** Backend handles all logic; Frontend is for display and data entry only.

**Example Endpoints:**
* `POST /api/firs` (Create FIR)
* `GET /api/cases?assignedTo=me` (Police Dashboard)
* `POST /api/cases/:id/submit` (Handover to Court)
* `GET /api/court/incoming` (Clerk Dashboard)