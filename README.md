# 🇮🇳 Indian Address API

A REST API providing complete address data for 600,000+ villages across all Indian states.

## Live API
https://address-api-kappa.vercel.app

## Endpoints
- GET /api/states
- GET /api/districts?stateId=1
- GET /api/subdistricts?districtId=1
- GET /api/villages?search=Delhi
- POST /api/auth/register
- POST /api/auth/login

## Tech Stack
- Node.js + Express.js
- PostgreSQL (NeonDB)
- Prisma ORM
- JWT Authentication
- Deployed on Vercel