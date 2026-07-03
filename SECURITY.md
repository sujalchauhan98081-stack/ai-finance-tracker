# Security Best Practices

## Backend Security

✅ **Authentication**
- JWT tokens with 30-day expiry
- Password hashing with bcryptjs
- Protected routes with middleware

✅ **Input Validation**
- express-validator for all inputs
- Mongoose schema validation
- Sanitized database queries

✅ **Rate Limiting**
- General API: 100 requests/15 minutes
- Auth routes: 5 requests/15 minutes
- Export routes: 10 requests/hour

✅ **Security Headers**
- helmet.js for HTTP security headers
- CORS configured for specific origins
- Content Security Policy enabled

✅ **Database Security**
- MongoDB Atlas with IP whitelist
- Indexed queries for performance
- Lean queries for read-only data

## Frontend Security

✅ **Data Protection**
- JWT stored in localStorage
- XSS protection via React
- CSRF tokens on forms

✅ **Production Build**
- Minified and optimized
- Source maps disabled
- No hardcoded secrets

## Environment Variables

Never commit `.env` files. Use `.env.example` for documentation.

Required variables:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Long random string (32+ chars)
- `GROQ_API_KEY` - AI API key
- `NODE_ENV` - Set to "production" on servers