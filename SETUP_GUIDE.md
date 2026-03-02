# Setup Guide / सेटअप गाइड

## Step 1: Dependencies Install Karo

```bash
npm install
```

## Step 2: PostgreSQL Database Setup Karo

### Option A: Local PostgreSQL (Agar installed hai)
1. PostgreSQL start karo
2. Database banao:
```sql
CREATE DATABASE bitespeed;
```
3. `.env` file banao aur database URL add karo:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bitespeed
PORT=8080
NODE_ENV=development
```

### Option B: Free Cloud Database (Recommended)
1. [Railway.app](https://railway.app) par jao aur free PostgreSQL database banao
   - Ya [Neon](https://neon.tech) ya [Supabase](https://supabase.com) use karo
2. Connection string copy karo aur `.env` mein paste karo

## Step 3: Database Migration Run Karo

```bash
npm run migrate
```

Agar success message aaye, toh table ban gayi hai! ✅

## Step 4: Server Start Karo

```bash
npm run dev
```

Server chal jayega on `http://localhost:8080`

## Step 5: API Test Karo

### Postman ya Thunder Client use karo:

**Request 1** - New Contact
```
POST http://localhost:3000/identify
Content-Type: application/json

{
  "email": "test@example.com",
  "phoneNumber": "123456"
}
```

**Request 2** - Linked Contact
```
POST http://localhost:3000/identify
Content-Type: application/json

{
  "email": "test2@example.com",
  "phoneNumber": "123456"
}
```

## Deployment (Render.com par)

1. Code ko GitHub par push karo
2. [Render.com](https://render.com) par jao
3. New Web Service banao aur GitHub repo connect karo
4. PostgreSQL database add karo (free tier)
5. Environment variables set karo (`DATABASE_URL`)
6. Deploy! 🚀

## Important Files:

- `src/server.js` - Main entry point
- `src/routes/identify.js` - API routes
- `src/controllers/identifyController.js` - Request handling
- `src/services/identifyService.js` - Business logic (sab logic yahan hai)
- `src/database/migrate.js` - Database table creation

## Common Issues:

### Database connection error?
- Check `.env` file mein DATABASE_URL sahi hai
- PostgreSQL server chal raha hai ya nahi check karo

### Port already in use?
- `.env` mein PORT change karo (e.g., 3001)

### Migration fail?
- Database credentials check karo
- Database exist karta hai ya nahi check karo
