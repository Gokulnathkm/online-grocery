# Database Setup Guide

This guide explains how to set up and use the database for storing products and user data in the Online Grocery application.

## Prerequisites

1. **MongoDB Installation**: Make sure MongoDB is installed and running on your system
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

2. **Node.js Dependencies**: All required packages are already installed in the backend

## Database Configuration

### 1. Environment Variables

Create a `.env` file in the `/backend` directory with the following content:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/online-grocery

# JWT Secret (for authentication)
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=5050
```

### 2. MongoDB Connection

The application will automatically connect to MongoDB when the server starts. The connection string can be:
- **Local MongoDB**: `mongodb://localhost:27017/online-grocery`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/online-grocery`

## Setting Up the Database

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

### 2. Seed the Database with Initial Products

Run the seed script to populate the database with initial product data:

```bash
cd backend
npm run seed
```

This will:
- Connect to your MongoDB database
- Add 19 initial products (rice, flour, oil, etc.) with stock levels
- Skip seeding if products already exist

### 3. Verify Database Connection

Check if the database is working by visiting:
- **Health Check**: http://localhost:5050/api/health
- **Products API**: http://localhost:5050/api/products

## Database Schema

### Products Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  image: String (optional),
  stock: Number (required, min: 0),
  price: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (enum: ['customer', 'admin', 'delivery']),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Users
- `GET /api/users` - List all users (admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

## Frontend Integration

The frontend is already configured to use the database:

1. **Product Management**: Admin dashboard can create, edit, and delete products
2. **User Management**: Admin dashboard displays all users (excluding admins)
3. **Fallback System**: If database is unavailable, the app falls back to local data

## Troubleshooting

### Database Connection Issues

1. **Check MongoDB Status**:
   ```bash
   # On macOS/Linux
   brew services list | grep mongodb
   
   # On Windows
   net start MongoDB
   ```

2. **Check Connection String**: Verify the `MONGO_URI` in your `.env` file

3. **Check Server Logs**: Look for connection errors in the backend console

### Empty Product List

If products don't appear in the frontend:

1. **Run the seed script**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Check API directly**: Visit http://localhost:5050/api/products

3. **Check browser console**: Look for API errors in the frontend

### Re-seeding the Database

To clear and re-seed the database:

```bash
# Connect to MongoDB shell
mongo

# Switch to your database
use online-grocery

# Clear products collection
db.products.deleteMany({})

# Exit MongoDB shell
exit

# Run seed script
cd backend
npm run seed
```

## Production Deployment

For production deployment:

1. **Use MongoDB Atlas** for cloud database hosting
2. **Set strong JWT_SECRET** in environment variables
3. **Enable authentication** for all admin routes
4. **Set up proper CORS** configuration
5. **Use environment variables** for all sensitive data

## Support

If you encounter issues:

1. Check the backend server logs for error messages
2. Verify MongoDB is running and accessible
3. Ensure all environment variables are set correctly
4. Check the API health endpoint: http://localhost:5050/api/health
