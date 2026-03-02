# Quick Start - 5 Minutes Mein Setup! ⚡

## 1️⃣ Install Karo (1 min)
```bash
cd "c:\Users\Kirtan\Desktop\BiteSpeed project"
npm install
```

## 2️⃣ Database Setup (2 min)

### Free Cloud Database (Easiest):
1. [Neon.tech](https://neon.tech) par jao → Sign up (GitHub se)
2. New Project banao → Copy Connection String
3. `.env` file banao:
```
PORT=8080
NODE_ENV=development
DATABASE_URL=your_connection_string_here
```

### Ya Local PostgreSQL (Advanced):
```bash
# PostgreSQL install hai toh:
# 1. pgAdmin open karo
# 2. Database "bitespeed" banao
# 3. .env mein add karo:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/bitespeed
```

## 3️⃣ Database Table Banao (30 sec)
```bash
npm run migrate
```

Output: `Database migrations completed successfully!` ✅

## 4️⃣ Server Start Karo (30 sec)
```bash
npm run dev
```

Output: 
```
Server is running on port 8080
Identify endpoint: http://localhost:8080/identify
```

## 5️⃣ Test Karo! (1 min)

### Postman/Thunder Client use karo:

**POST** `http://localhost:8080/identify`

Body (JSON):
```json
{
  "email": "test@example.com",
  "phoneNumber": "123456"
}
```

Response milega! 🎉

---

## Errors?

**"Cannot find module 'express'"** → `npm install` run karo

**"Connection refused"** → Database URL check karo `.env` mein

**"Port 3000 already in use"** → `.env` mein `PORT=8081` karo

---

## Ab Deploy Karo (Optional - 10 min)

1. GitHub par repo banao aur code push karo:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your_repo_url
git push -u origin main
```

2. [Render.com](https://render.com) → New Web Service → Connect GitHub
3. Add PostgreSQL → Copy DATABASE_URL
4. Environment Variable add karo
5. Deploy! 🚀

Done! Endpoint share karna README mein. ✅
