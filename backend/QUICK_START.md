# 🚀 QUICK START GUIDE

## Get Up and Running in 5 Minutes

### 1. Verify Database Connection ✅
The database "NyayaSankalan" is already created and migrated with 22 tables.

### 2. Server is Already Running ✅
```
✅ Server running on: http://localhost:5000
```

### 3. Test the API

#### Health Check
Open in browser or run:
```bash
curl http://localhost:5000/health
```

#### Login as SHO (Police)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"sho.central@police.gov\",\"password\":\"password123\"}"
```

**Copy the `token` from the response!**

#### Get Your User Info
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Create a FIR
```bash
curl -X POST http://localhost:5000/api/firs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{
    \"complainantName\": \"John Doe\",
    \"complainantContact\": \"9876543210\",
    \"incidentDate\": \"2024-01-15T10:00:00Z\",
    \"incidentLocation\": \"Main Street, City\",
    \"incidentDescription\": \"Theft incident\",
    \"category\": \"CRIMINAL\"
  }"
```

### 4. Available Test Accounts

| Role | Email | Password | Use Case |
|------|-------|----------|----------|
| SHO | `sho.central@police.gov` | `password123` | Assign cases, submit to court |
| Police Officer | `officer1@police.gov` | `password123` | Create FIR, investigation |
| Court Clerk | `clerk@court.gov` | `password123` | Intake cases |
| Judge | `judge@court.gov` | `password123` | Court actions, judgments |

### 5. Key Endpoints to Try

```bash
# Get all police stations
GET /api/police-stations

# Get all courts
GET /api/courts

# Get my cases (as police)
GET /api/cases/my

# Get all cases (as SHO/Court)
GET /api/cases/all

# Get case details
GET /api/cases/:caseId

# View case timeline
GET /api/cases/:caseId/timeline
```

### 6. Typical Workflow

1. **Login** → Get JWT token
2. **Create FIR** → Auto-creates case
3. **Add Investigation Events** → Track progress
4. **Add Evidence** → Document findings
5. **Add Witnesses** → Record statements
6. **Add Accused** → Register accused persons
7. **Create Documents** → Chargesheet, reports
8. **Submit to Court** → SHO submits case
9. **Court Intake** → Clerk acknowledges
10. **Court Actions** → Judge creates orders
11. **View Timeline** → Complete case history

### 7. Pro Tips

- All endpoints require `Authorization: Bearer <token>` header except `/health` and `/api/auth/login`
- Role-based access is enforced - make sure you're using the right user role
- Documents are locked after court submission
- Audit logs are automatically created for sensitive operations
- Case timeline shows all events chronologically

### 8. Documentation

- **Complete API Docs:** `backend/API_DOCUMENTATION.md`
- **Project README:** `backend/README.md`
- **Implementation Details:** `backend/IMPLEMENTATION_SUMMARY.md`

### 9. Useful Commands

```bash
# Restart server (if needed)
cd backend
npm run dev

# View database in GUI
npm run db:studio

# Reset and reseed database
npm run db:migrate
npm run db:seed
```

### 10. Common Issues

**Can't connect?**
- Check if server is running on port 5000
- Check database connection in `.env`

**Authentication failed?**
- Verify email and password (all passwords are `password123`)
- Check token is included in Authorization header

**404 Not Found?**
- Verify endpoint URL (should start with `/api/`)
- Check HTTP method (GET, POST, etc.)

---

## 🎯 You're All Set!

The backend is fully operational with:
- ✅ 36 REST APIs
- ✅ 6 test users
- ✅ 4 organizations
- ✅ JWT authentication
- ✅ Role-based access
- ✅ Complete audit trail

**Start testing the APIs now!** 🚀
