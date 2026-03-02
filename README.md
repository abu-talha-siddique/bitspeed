# Bitespeed Identity Reconciliation Service

A web service that identifies and keeps track of customer identity across multiple purchases by reconciling different email addresses and phone numbers to the same person.

## Features

- Identity reconciliation based on email and phone number
- Automatic linking of contacts with shared information
- Primary and secondary contact management
- RESTful API endpoint

## Tech Stack

- Node.js with JavaScript
- Express.js
- PostgreSQL
- Deployed on: [To be added]

## Setup

1. *Clone the repository*

2. *Install dependencies:*
bash
npm install


3. *Setup PostgreSQL Database:*
   - Use local PostgreSQL or free cloud service (Railway/Neon/Supabase)
   - Copy .env.example to .env
   - Update DATABASE_URL with your database credentials

4. *Run database migrations:*
bash
npm run migrate


5. *Start the server:*
bash
# Development (with auto-reload)
npm run dev

# Production
npm start


Server will run on http://localhost:3000

For detailed setup guide in Hindi, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## API Endpoint

### POST /identify

Identifies and consolidates customer contact information.

*Request Body:*
json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}


*Response:*
json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}


## Deployment

*Option 1: Render.com (Recommended)*
1. Push code to GitHub
2. Create new Web Service on Render
3. Add PostgreSQL database
4. Set DATABASE_URL environment variable
5. Deploy automatically

*Option 2: Railway.app*
1. Push code to GitHub
2. Create new project on Railway
3. Add PostgreSQL plugin
4. Deploy

The service is deployed at: [Add your deployed URL here]

## Testing

Use the [test-requests.http](test-requests.http) file with REST Client extension in VS Code, or use Postman/Thunder Client to test the API.

## Database Schema

*Contact Table:*
- id - Primary key
- phoneNumber - Customer phone number (optional)
- email - Customer email (optional)
- linkedId - ID of linked primary contact (optional)
- linkPrecedence - "primary" or "secondary"
- createdAt - Timestamp
- updatedAt - Timestamp
- deletedAt - Soft delete timestamp (optional)
