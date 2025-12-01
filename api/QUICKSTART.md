# Quick Start Guide - User Preferences API

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd api
npm install
```

### Step 2: Start the Server
```bash
npm start
```

The API will be running at `http://localhost:3000`

### Step 3: Test the API

Open your browser and visit:
```
http://localhost:3000
```

You should see the API documentation.

## 📝 Quick Examples

### Using cURL

#### Create User Preferences
```bash
curl -X POST http://localhost:3000/api/preferences \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "notifications": true,
    "language": "en"
  }'
```

#### Get User Preferences
```bash
curl http://localhost:3000/api/preferences/YOUR_USER_ID
```

#### Update Theme
```bash
curl -X PATCH http://localhost:3000/api/preferences/YOUR_USER_ID \
  -H "Content-Type: application/json" \
  -d '{"theme": "light"}'
```

### Using JavaScript (Frontend)

```javascript
// Create preferences
const response = await fetch('http://localhost:3000/api/preferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    theme: 'dark',
    notifications: true,
    language: 'en'
  })
});
const data = await response.json();
console.log(data);
```

## 🧪 Run Tests

```bash
npm test
```

## 📚 Next Steps

1. Read the full [README.md](./README.md) for detailed API documentation
2. Check out [client-integration.js](./examples/client-integration.js) for integration examples
3. Modify the code to fit your needs
4. Add database integration (MongoDB, PostgreSQL, etc.)
5. Add authentication

## 🛠️ Development Mode

For auto-reload during development:

```bash
npm run dev
```

## ❓ Common Issues

### Port Already in Use
Change the port in your `.env` file:
```
PORT=3001
```

### CORS Issues
The API has CORS enabled by default. If you need to restrict origins:

```javascript
// In server.js
app.use(cors({
  origin: 'http://your-frontend-domain.com'
}));
```

## 📞 Need Help?

Check the [README.md](./README.md) for comprehensive documentation.