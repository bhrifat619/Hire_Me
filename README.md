# HireMe – Job Posting Platform (Backend)

Backend implementation of **HireMe**, a job posting platform where:

- **Admins** manage users, jobs and applications  
- **Recruiters** (employees) post/manage jobs and handle applicants  
- **Job Seekers** browse jobs and apply with a CV + payment

Built with **Node.js, Express, MongoDB (Mongoose), JWT, Multer**.



---

## Features

- JWT‑based **authentication** with access & refresh tokens
- **Role‑based authorization**:
  - `admin`
  - `recruiter` (employee)
  - `job_seeker`
- **Fixed super admin email**: `bhuiyanrifat619@gmail.com`
  - First registered with this email is automatically `admin`
  - Only this super‑admin can create other admins
- **Users**:
  - Register, login, refresh token, logout
  - View own profile
  - Admin can list/update/delete users, create other admins
- **Jobs**:
  - Public job listing
  - Recruiter/Admin can create, update, delete jobs
  - Recruiter/Admin can view their own jobs
- **Applications**:
  - Job seekers apply once per job (CV upload + payment)
  - Recruiter/Admin can view applications for a job
  - Recruiter/Admin can accept/reject applications
  - Job seekers can view their own application history
  - Admin can list all applications (with filters)
- **File upload** using Multer (`uploads/cv`) with type & size validation
- **Mock payment** system with invoice info stored in application
- **Logout**: clears refresh token in DB
- **Global error handling** and 404 handler

---

## Tech Stack

- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (access + refresh tokens)
- **File Upload:** Multer
- **Validation:** Basic checks in services (can be extended with Joi/Zod)
- **Environment Management:** `dotenv`

---
## ERD
The ERD is included in the repo under e.g.:
[ERD](https://github.com/bhrifat619/Hire_Me/tree/main/ERD)

## Git Clone
```
https://github.com/bhrifat619/Hire_Me.git
```

## Postman
**Recommended testing flows**
Super Admin
- `Register bhuiyanrifat619@gmail.com via POST /api/users/register`
- `Login via POST /api/users/login → get tokens`
- `Create other admins with POST /api/users/admin`
Recruiter:
- `Register as recruiter (role: "recruiter")`
- `Login → create jobs via POST /api/jobs`
- `View own jobs via GET /api/jobs/mine/list`
Job seeker:
- `Register as job seeker (role: "job_seeker")`
- `Login → view jobs via GET /api/jobs`
- `Apply with POST /api/applications (form-data: jobId, cv)`
- `View own applications via GET /api/applications/my`
- `View own jobs via GET /api/jobs/mine/list`
Admin:
- `Login as admin`
- `Use`
  - `/api/users to manage users`
  - `/api/applications to view applications`<br/>

**A Postman collection file can be stored at:**
[Postman Documentation](https://github.com/bhrifat619/Hire_Me/tree/main/Postman_Documentation)

---
## Project Structure

```text
project-root/
├─ src/
│  └─ app/
│     ├─ config/
│     │  └─ index.js
│     ├─ middleware/
│     │  ├─ auth.js
│     │  ├─ globalErrorHandler.js
│     │  ├─ notfound.js
│     │  └─ upload.js
│     ├─ modules/
│     │  ├─ user/
│     │  │  ├─ user.controller.js
│     │  │  ├─ user.model.js
│     │  │  ├─ user.route.js
│     │  │  └─ user.service.js
│     │  ├─ job/
│     │  │  ├─ job.controller.js
│     │  │  ├─ job.model.js
│     │  │  ├─ job.route.js
│     │  │  └─ job.service.js
│     │  └─ application/
│     │     ├─ application.controller.js
│     │     ├─ application.model.js
│     │     ├─ application.route.js
│     │     └─ application.service.js
│     ├─ routes/
│     │  └─ route.js
│     ├─ utils/
│     │  ├─ catchAsync.js
│     │  ├─ constants.js
│     │  ├─ paymentGateway.js
│     │  └─ tokenGenerator.js
│     ├─ app.js
│     └─ server.js
├─ uploads/
│  └─ cv/          # uploaded CVs (created automatically if missing)
├─ .env
├─ package.json
└─ README.md
```
Getting Started
Environment Variables <br/>
Create a .env file in the project root:
```
PORT=5000
DB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/job_portal

NODE_ENV=development

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10

APPLICATION_FEE=100
```
**DATABASE_URL:** MongoDB Atlas connection string (or local Mongo).<br/>

**JWT_SECRET / JWT_REFRESH_SECRET:** use strong random strings.<br/>

**APPLICATION_FEE:** amount in Taka (mock payment).
##Install & Run
```
# install dependencies
npm install

# run in dev mode (with nodemon, if configured)
npm run dev

# or run directly
npm start
```
## Check:
```
GET http://localhost:5000/health
# -> { "status": "ok" }
```
## Base API URL used below:
```
http://localhost:5000/api
```

## Authentication & Roles

### Roles

Defined in `src/app/utils/constants.js`:

- `admin`
- `recruiter`
- `job_seeker`

### Fixed Super Admin

- Email: **`bhuiyanrifat619@gmail.com`**
- When this email is registered, the user is always set as `admin`.
- On login, if this email is found and role is not `admin`, it is corrected to `admin`.
- Only this super‑admin can call `POST /api/users/admin` to create other admins.

### Tokens

#### Access token

- Short-lived (`JWT_EXPIRES_IN`, e.g. `15m`).
- Sent in header:

```
Authorization: Bearer <accessToken>
```
## Refresh token
- `Long-lived (JWT_REFRESH_EXPIRES_IN, e.g. 7d).`
- `Stored in User.refreshToken.`
- `Used to get new access token via POST /api/users/refresh-token.`
## Log Out
- `POST /api/users/logout clears refreshToken in DB for the current user.`
- `Client (frontend/Postman) should delete both accessToken and refreshToken from storage.`
## API Overview
"Replace /api if you mounted the routes under a different base path."
## Auth & Users
## Register (public)
```
POST /api/users/register
```
## Body (JSON):
```
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "job_seeker",
  "company": "ABC Company",
  "phone": "01700000000"
}
```
## Response:
```
{
  "success": true,
  "data": {
    "user": { /* user data without password */ },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```
## Login (public)
```
POST /api/users/login
```
## Body:
```
{
  "email": "user@example.com",
  "password": "password123"
}
```
Returns the same structure as register: user, accessToken, refreshToken.
## Logout (any logged-in user)
```
{
 POST /api/users/logout
 Authorization: Bearer <accessToken>
}
```
## Get own profile
```
{
GET /api/users/me
Authorization: Bearer <accessToken>
}
```
## Admin – User Management
Requires role: admin.
## Create admin (super-admin only)
```
{
POST /api/users/admin
Authorization: Bearer <SUPER_ADMIN_ACCESS_TOKEN>
Content-Type: application/json
}
```
## Body:
```
{
  "name": "New Admin",
  "email": "admin2@example.com",
  "password": "adminPassword123",
  "phone": "01712345678"
}
```
Only the fixed super admin email (admin@gmail.com) is allowed to call this.
## List all users
```
GET /api/users
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```
**Optional query params:**
- `role=admin|recruiter|job_seeker`
- `company=ABC%20Company`
## Update any user
```
PATCH /api/users/:id
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json
```
## Body example:
```
{
  "name": "Updated Name",
  "role": "recruiter",
  "company": "New Company"
}
```
## Delete any user
```
DELETE /api/users/:id
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```
## Jobs
## Public: list jobs
```
GET /api/jobs
```
**Optional query:**
- `company=ABC%20Company`
- `status=open|closed`
## Public: get single job
```
GET /api/jobs/:id
```
## Create job (recruiter/admin)
```
POST /api/jobs
Authorization: Bearer <RECRUITER_OR_ADMIN_ACCESS_TOKEN>
Content-Type: application/json
```
## Body:
```
{
  "title": "Backend Developer",
  "description": "Node.js/Express backend role",
  "company": "ABC Company",
  "location": "Dhaka",
  "salary": "50k-80k BDT",
  "employmentType": "full-time"
}
```
## List my jobs (recruiter/admin)
```
GET /api/jobs/mine/list
Authorization: Bearer <RECRUITER_OR_ADMIN_ACCESS_TOKEN>
```
## Update job (recruiter/admin)
```
PATCH /api/jobs/:id
Authorization: Bearer <RECRUITER_OR_ADMIN_ACCESS_TOKEN>
Content-Type: application/json
```
Body can contain any updatable fields (title, description, status, etc.).
## Delete job (recruiter/admin)
```
DELETE /api/jobs/:id
Authorization: Bearer <RECRUITER_OR_ADMIN_ACCESS_TOKEN>
```
## Applications
## Apply for job (job seeker)
```
POST /api/applications
Authorization: Bearer <JOB_SEEKER_ACCESS_TOKEN>
```
**Body → form-data:**
- `jobId (Text) – Job _id`
- `cv (File) – .pdf, .doc, .docx`

## My applications (job seeker)
```
GET /api/applications/my
Authorization: Bearer <JOB_SEEKER_ACCESS_TOKEN>
```

## All applications (admin)
```
GET /api/applications
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```
**Optional query:**
- `status=pending|accepted|rejected`
- `company=ABC%20Company (filters by job.company)`
## Applications for a job (recruiter/admin)
```
GET /api/applications/job/:jobId
Authorization: Bearer <RECRUITER_OR_ADMIN_ACCESS_TOKEN>
```
- `company=ABC%20Company (filters by job.company)`
## Accept / reject application (recruiter/admin)
```
PATCH /api/applications/:id/status
Authorization: Bearer <RECRUITER_OR_ADMIN_ACCESS_TOKEN>
Content-Type: application/json
```
## Body:
```
{ "status": "accepted" }
```
## File Upload (CV)
- `Implemented via multer with disk storage.`
- `Destination: uploads/cv/ (auto‑created if missing).`
- `Allowed types: pdf, .doc, .docx`
- `Max Size 5mb`
## Payment Flow (Mock)
**On POST /api/applications:**
- `Implemented via multer with disk storage.`
- `Uses APPLICATION_FEE from .env (e.g. 100 Taka).`
- `Always returns a successful mock payment.`
- `Application is stored with:`
   - `paymentStatus: "paid"`
   - `invoice: { transactionId, amount, currency, paidAt }.`
