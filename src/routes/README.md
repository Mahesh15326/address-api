# 🇮🇳 Indian Address API

A RESTful API providing complete Indian address data including States, Districts, Sub-Districts, and Villages (600K+).

## 🌐 Live URLs
- **API:** https://address-api-kappa.vercel.app
- **Dashboard:** https://frontend-fr9c1de6d-mahesh15326s-projects.vercel.app

## 🚀 Getting Started

### Step 1 — Register
POST https://address-api-kappa.vercel.app/api/auth/register
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}

### Step 2 — Login
POST https://address-api-kappa.vercel.app/api/auth/login
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "yourpassword"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

### Step 3 — Generate API Key
POST https://address-api-kappa.vercel.app/api/apikeys/generate
Authorization: Bearer <your_jwt_token>

Response:
{
  "success": true,
  "data": {
    "key": "ak_live_xxxxxxxxxxxxx"
  }
}

## 📡 API Endpoints

All endpoints require x-api-key header.

### Get All States
GET https://address-api-kappa.vercel.app/api/states
x-api-key: ak_live_xxxxx

Response:
{
  "success": true,
  "count": 36,
  "data": [
    { "id": 1, "name": "ANDHRA PRADESH", "code": "28" },
    ...
  ]
}

### Get Districts by State
GET https://address-api-kappa.vercel.app/api/districts?stateId=1
x-api-key: ak_live_xxxxx

### Get Sub-Districts by District
GET https://address-api-kappa.vercel.app/api/subdistricts?districtId=1
x-api-key: ak_live_xxxxx

### Get Villages by Sub-District
GET https://address-api-kappa.vercel.app/api/villages?subDistrictId=1
x-api-key: ak_live_xxxxx

### Search Villages by Name
GET https://address-api-kappa.vercel.app/api/villages?search=Delhi
x-api-key: ak_live_xxxxx

Response:
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "DELHI",
      "code": "12345",
      "subDistrict": {
        "name": "KASAULI",
        "district": {
          "name": "SOLAN",
          "state": { "name": "HIMACHAL PRADESH" }
        }
      }
    }
  ]
}

## 📊 Data Coverage

| Level         | Count    |
|---------------|----------|
| States        | 36       |
| Districts     | 700+     |
| Sub-Districts | 6,000+   |
| Villages      | 600,000+ |

## 🔒 Authentication Flow

1. Register → Login → Get JWT Token
2. Use JWT Token → Generate API Key
3. Use API Key → Access Address Endpoints

## 🛠 Tech Stack

| Component    | Technology          |
|--------------|---------------------|
| Backend      | Node.js + Express   |
| Database     | NeonDB (PostgreSQL) |
| ORM          | Prisma              |
| Frontend     | React.js + Vite     |
| Auth         | JWT + bcrypt        |
| Rate Limit   | express-rate-limit  |
| Hosting      | Vercel              |

## 📁 Project Structure

address-api/
├── src/
│   ├── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── states.js
│   │   ├── districts.js
│   │   ├── subdistricts.js
│   │   ├── villages.js
│   │   └── apikeys.js
│   └── middleware/
│       ├── rateLimit.js
│       └── apiKeyAuth.js
├── frontend/
│   └── src/
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           └── Dashboard.jsx
├── prisma/
│   └── schema.prisma
├── .env
└── README.md

## 👨‍💻 Developer

**Mahesh Sai**
Capstone Project — April 2026