# Postman Test Collection - Contest API

## Environment Setup
Create a new environment in Postman with these variables:
- `baseUrl`: `http://localhost:3000/api`
- `token`: (will be set automatically from login)
- `contestId`: (will be set automatically from contest creation)
- `userId`: (will be set automatically)

## 1. Authentication Setup

### 1.1 Register User #1 (Contest Creator)
**Method:** POST  
**URL:** `{{baseUrl}}/users/register`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@example.com",
  "password": "securepass123"
}
```

### 1.2 Register User #2 (Participant)
**Method:** POST  
**URL:** `{{baseUrl}}/users/register`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "first_name": "Bob",
  "last_name": "Smith",
  "email": "bob.smith@example.com",
  "password": "mypassword456"
}
```

### 1.3 Login User #1
**Method:** POST  
**URL:** `{{baseUrl}}/users/login`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "email": "alice.johnson@example.com",
  "password": "securepass123"
}
```
**Tests Script:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    console.log("Token set:", response.data.token);
}
```

## 2. Contest Creation (Without Images)

### 2.1 Create Contest #1 - Web Development Challenge
**Method:** POST  
**URL:** `{{baseUrl}}/contests`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "Web Development Championship 2025",
  "starts_at": "2025-12-01T09:00:00Z",
  "ends_at": "2025-12-31T18:00:00Z",
  "is_public": true
}
```
**Tests Script:**
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("contestId", response.data.contest_id);
    console.log("Contest ID set:", response.data.contest_id);
}
```

### 2.2 Create Contest #2 - Private Hackathon
**Method:** POST  
**URL:** `{{baseUrl}}/contests`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "Internal Team Hackathon",
  "starts_at": "2026-01-15T10:00:00Z",
  "ends_at": "2026-01-17T22:00:00Z",
  "is_public": false
}
```

### 2.3 Create Contest #3 - JavaScript Challenge
**Method:** POST  
**URL:** `{{baseUrl}}/contests`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "JavaScript Mastery Challenge",
  "starts_at": "2026-02-01T08:00:00Z",
  "ends_at": "2026-02-28T20:00:00Z",
  "is_public": true
}
```

## 3. Contest Retrieval

### 3.1 Get All Contests
**Method:** GET  
**URL:** `{{baseUrl}}/contests`

### 3.2 Get Contests with Pagination
**Method:** GET  
**URL:** `{{baseUrl}}/contests?page=1&limit=2`

### 3.3 Get Public Contests Only
**Method:** GET  
**URL:** `{{baseUrl}}/contests?is_public=true`

### 3.4 Get Contest by ID
**Method:** GET  
**URL:** `{{baseUrl}}/contests/{{contestId}}`

### 3.5 Get Contest by Slug
**Method:** GET  
**URL:** `{{baseUrl}}/contests/slug/web-development-championship-2025`

### 3.6 Get My Contests
**Method:** GET  
**URL:** `{{baseUrl}}/contests/my/contests`  
**Headers:** `Authorization: Bearer {{token}}`

## 4. Contest Updates

### 4.1 Update Contest Details
**Method:** PUT  
**URL:** `{{baseUrl}}/contests/{{contestId}}`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "Advanced Web Development Championship 2025",
  "ends_at": "2026-01-15T18:00:00Z",
  "is_public": false
}
```

### 4.2 Make Contest Public Again
**Method:** PUT  
**URL:** `{{baseUrl}}/contests/{{contestId}}`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "is_public": true
}
```

## 5. Participant Management

### 5.1 Join Contest as Participant
**Method:** POST  
**URL:** `{{baseUrl}}/contests/{{contestId}}/join`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "role_in_contest": "participant"
}
```

### 5.2 Get Contest Participants
**Method:** GET  
**URL:** `{{baseUrl}}/contests/{{contestId}}/participants`

### 5.3 Login as Second User (for role testing)
**Method:** POST  
**URL:** `{{baseUrl}}/users/login`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "email": "bob.smith@example.com",
  "password": "mypassword456"
}
```
**Tests Script:**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token2", response.data.token);
    console.log("Second token set:", response.data.token);
}
```

### 5.4 Join Contest as Second User
**Method:** POST  
**URL:** `{{baseUrl}}/contests/{{contestId}}/join`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token2}}`

**Body (raw JSON):**
```json
{
  "role_in_contest": "participant"
}
```

### 5.5 Update Participant Role (use first user's token)
**Method:** PUT  
**URL:** `{{baseUrl}}/contests/{{contestId}}/participants/2/role`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "role_in_contest": "mentor"
}
```

### 5.6 Leave Contest (as second user)
**Method:** DELETE  
**URL:** `{{baseUrl}}/contests/{{contestId}}/leave`  
**Headers:** `Authorization: Bearer {{token2}}`

## 6. Error Testing

### 6.1 Create Contest Without Authentication
**Method:** POST  
**URL:** `{{baseUrl}}/contests`  
**Headers:** `Content-Type: application/json`  
**Body (raw JSON):**
```json
{
  "title": "Unauthorized Contest",
  "is_public": true
}
```
**Expected:** 401 Unauthorized

### 6.2 Create Contest with Invalid Data
**Method:** POST  
**URL:** `{{baseUrl}}/contests`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "title": "",
  "starts_at": "invalid-date",
  "ends_at": "2025-01-01T00:00:00Z"
}
```
**Expected:** 400 Bad Request

### 6.3 Get Non-Existent Contest
**Method:** GET  
**URL:** `{{baseUrl}}/contests/99999`  
**Expected:** 404 Not Found

### 6.4 Join Contest Twice
**Method:** POST  
**URL:** `{{baseUrl}}/contests/{{contestId}}/join`  
**Headers:** 
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

**Body (raw JSON):**
```json
{
  "role_in_contest": "participant"
}
```
**Expected:** 400 Bad Request (already a participant)

## 7. Advanced Test Cases

### 7.1 Filter Contests by Creator
**Method:** GET  
**URL:** `{{baseUrl}}/contests?created_by=1`

### 7.2 Complex Filter Query
**Method:** GET  
**URL:** `{{baseUrl}}/contests?is_public=true&page=1&limit=5`

### 7.3 Search by Invalid Slug
**Method:** GET  
**URL:** `{{baseUrl}}/contests/slug/non-existent-contest`  
**Expected:** 404 Not Found

## 8. Contest Deletion

### 8.1 Delete Contest (Creator Only)
**Method:** DELETE  
**URL:** `{{baseUrl}}/contests/{{contestId}}`  
**Headers:** `Authorization: Bearer {{token}}`  
**Expected:** 204 No Content

### 8.2 Try to Delete Already Deleted Contest
**Method:** DELETE  
**URL:** `{{baseUrl}}/contests/{{contestId}}`  
**Headers:** `Authorization: Bearer {{token}}`  
**Expected:** 404 Not Found

## 9. Testing with Images (Optional - requires Cloudinary setup)

### 9.1 Create Contest with Profile Image
**Method:** POST  
**URL:** `{{baseUrl}}/contests`  
**Headers:** `Authorization: Bearer {{token}}`  
**Body Type:** form-data  
**Form Data:**
- `title`: "React Development Contest 2025"
- `starts_at`: "2026-03-01T09:00:00Z"
- `ends_at`: "2026-03-30T18:00:00Z"
- `is_public`: "true"
- `profile_img`: [Select image file - JPG/PNG under 5MB]

## Notes:
1. **Server Setup**: Make sure your server is running with `npm run dev`
2. **Database**: Ensure your database is set up and the schema is applied
3. **Environment Variables**: The tests will work without Cloudinary configuration
4. **Token Management**: Use the test scripts provided to automatically set environment variables
5. **Error Handling**: Test both success and error scenarios
6. **Permissions**: Some operations require specific user roles (creator, organizer)

## Quick Test Sequence:
1. Register two users
2. Login as first user
3. Create a few contests
4. Test retrieval operations
5. Login as second user
6. Test participation features
7. Test error scenarios
8. Clean up by deleting contests