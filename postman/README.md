# FastM8 API Postman Collection

This directory contains the Postman collection for the FastM8 API.

## Collection Structure

The collection is organized into three main folders:

1. **Authentication**

   - Create User
   - Login

2. **Fasting Logs**

   - Create Log
   - Get Open Logs
   - Edit Logs
   - Delete Logs

3. **Status**
   - Check Status

## Setup Instructions

1. Import the collection:

   - Open Postman
   - Click "Import" button
   - Select `fastm8-api.postman_collection.json`

2. Set up environment variables:

   - Create a new environment in Postman
   - Add the following variables:
     - `base_url`: Your API base URL (default: `http://localhost:3001`)
     - `token`: Your JWT token (will be set after login)

3. Using the collection:
   1. First, create a user using the "Create User" request
   2. Then, login using the "Login" request
   3. Copy the token from the login response
   4. Set the `token` environment variable with the copied token
   5. Now you can use all other endpoints

## Example Workflow

1. Create a user:

   ```json
   POST /api/users
   {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
   }
   ```

2. Login to get token:

   ```json
   POST /api/login
   {
       "email": "test@example.com",
       "password": "password123"
   }
   ```

3. Use the token for authenticated requests:
   ```
   Authorization: Bearer <your_token>
   ```

## Date Formats

The API accepts two date formats:

1. Full ISO format: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., "2024-04-11T10:00:00.000Z")
2. Date-only format: `YYYY-MM-DD` (e.g., "2024-04-11")

## Notes

- All endpoints except `/status` and `/api/users` require JWT authentication
- The token expires after 1 hour
- Date range parameters in `/api/open-logs` are optional
- The collection uses environment variables for the base URL and token
