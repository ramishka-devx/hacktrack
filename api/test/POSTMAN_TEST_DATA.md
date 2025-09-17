# Contest API Test Data for Postman

## Base Configuration
- **Base URL**: `http://localhost:3000/api`
- **Environment Variables** (set in Postman):
  - `baseUrl`: `http://localhost:3000/api`
  - `token`: `your-jwt-token-here` (get from login response)
  - `contestId`: `1` (update after creating a contest)
  - `userId`: `2` (update with actual user ID)

## 1. User Registration & Authentication

### Register Test User
**POST** `{{baseUrl}}/users/register`
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Register Second User (for testing participant features)
**POST** `{{baseUrl}}/users/register`
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "password": "password456"
}
```

### Login User
**POST** `{{baseUrl}}/users/login`
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
> **Note**: Copy the `token` from the response and set it as environment variable

## 2. Contest CRUD Operations

### Create Contest #1 (Public)
**POST** `{{baseUrl}}/contests`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "title": "Web Development Championship 2025",
  "starts_at": "2025-01-15T09:00:00Z",
  "ends_at": "2025-01-30T18:00:00Z",
  "is_public": true
}
```

### Create Contest #2 (Private)
**POST** `{{baseUrl}}/contests`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "title": "Internal Team Hackathon",
  "starts_at": "2025-02-01T10:00:00Z",
  "ends_at": "2025-02-03T20:00:00Z",
  "is_public": false
}
```

### Create Contest #3 (JavaScript Focus)
**POST** `{{baseUrl}}/contests`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "title": "JavaScript Mastery Challenge",
  "starts_at": "2025-03-01T08:00:00Z",
  "ends_at": "2025-03-15T23:59:59Z",
  "is_public": true
}
```

### Create Contest with Profile Image (Form Data)
**POST** `{{baseUrl}}/contests`
**Headers**: `Authorization: Bearer {{token}}`
**Body Type**: `form-data`
```
title: React Development Contest 2025
starts_at: 2025-04-01T09:00:00Z
ends_at: 2025-04-30T18:00:00Z
is_public: true
profile_img: [SELECT IMAGE FILE]
```

## 3. Contest Retrieval Operations

### Get All Contests
**GET** `{{baseUrl}}/contests`

### Get Only Public Contests
**GET** `{{baseUrl}}/contests/public`

### Get Public Contests with Pagination
**GET** `{{baseUrl}}/contests/public?page=1&limit=2`

### Get Public Contests by Creator
**GET** `{{baseUrl}}/contests/public?created_by=1`

### Get Contests with Pagination
**GET** `{{baseUrl}}/contests?page=1&limit=2`

### Get Only Public Contests
**GET** `{{baseUrl}}/contests?is_public=true`

### Get Contests by Creator
**GET** `{{baseUrl}}/contests?created_by=1`

### Get Contest by ID
**GET** `{{baseUrl}}/contests/{{contestId}}`

### Get Contest by Slug
**GET** `{{baseUrl}}/contests/slug/web-development-championship-2025`

### Get My Contests (Created Only)
**GET** `{{baseUrl}}/contests/my/contests`
**Headers**: `Authorization: Bearer {{token}}`

### Get All My Contests (Created + Enrolled)
**GET** `{{baseUrl}}/contests/my`
**Headers**: `Authorization: Bearer {{token}}`

### Get My Contests with Pagination
**GET** `{{baseUrl}}/contests/my?page=1&limit=5`
**Headers**: `Authorization: Bearer {{token}}`

## 4. Contest Update Operations

### Update Contest Details
**PUT** `{{baseUrl}}/contests/{{contestId}}`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "title": "Updated Web Development Championship 2025",
  "ends_at": "2025-02-15T18:00:00Z",
  "is_public": false
}
```

### Update Contest with New Profile Image (Form Data)
**PUT** `{{baseUrl}}/contests/{{contestId}}`
**Headers**: `Authorization: Bearer {{token}}`
**Body Type**: `form-data`
```
title: Advanced Web Development Championship
profile_img: [SELECT NEW IMAGE FILE]
```

## 5. Participant Management

### Join Contest as Participant
**POST** `{{baseUrl}}/contests/{{contestId}}/join`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "participant"
}
```

### Join Contest as Mentor
**POST** `{{baseUrl}}/contests/{{contestId}}/join`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "mentor"
}
```

### Join Contest as Organizer
**POST** `{{baseUrl}}/contests/{{contestId}}/join`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "organizer"
}
```

### Get Contest Participants
**GET** `{{baseUrl}}/contests/{{contestId}}/participants`

### Update Participant Role
**PUT** `{{baseUrl}}/contests/{{contestId}}/participants/{{userId}}/role`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "organizer"
}
```

### Leave Contest
**DELETE** `{{baseUrl}}/contests/{{contestId}}/leave`
**Headers**: `Authorization: Bearer {{token}}`

## 6. Contest Deletion

### Delete Contest
**DELETE** `{{baseUrl}}/contests/{{contestId}}`
**Headers**: `Authorization: Bearer {{token}}`

## 7. Error Testing Scenarios

### Invalid Contest Creation (Missing Title)
**POST** `{{baseUrl}}/contests`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "starts_at": "2025-01-15T09:00:00Z",
  "ends_at": "2025-01-30T18:00:00Z"
}
```

### Invalid Dates (End before Start)
**POST** `{{baseUrl}}/contests`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "title": "Invalid Date Contest",
  "starts_at": "2025-01-30T09:00:00Z",
  "ends_at": "2025-01-15T18:00:00Z",
  "is_public": true
}
```

### Unauthorized Access (No Token)
**POST** `{{baseUrl}}/contests`
```json
{
  "title": "Unauthorized Contest",
  "is_public": true
}
```

### Non-existent Contest
**GET** `{{baseUrl}}/contests/99999`

### Join Contest Twice (Should Fail)
**POST** `{{baseUrl}}/contests/{{contestId}}/join`
**Headers**: `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "participant"
}
```

## 8. Advanced Test Scenarios

### Filter Contests by Multiple Criteria
**GET** `{{baseUrl}}/contests?is_public=true&page=1&limit=5`

### Search Contest with Invalid Slug
**GET** `{{baseUrl}}/contests/slug/non-existent-contest`

### Update Contest Without Permission (Use different token)
**PUT** `{{baseUrl}}/contests/{{contestId}}`
**Headers**: `Authorization: Bearer {{differentUserToken}}`
```json
{
  "title": "Unauthorized Update Attempt"
}
```

## 9. Sample Test Data Collections

### Contest Titles for Testing
```
- "AI/ML Innovation Challenge 2025"
- "Mobile App Development Contest"
- "Cybersecurity CTF Championship"
- "Full-Stack Developer Showdown"
- "Data Science Analytics Challenge"
- "Blockchain Development Contest"
- "Game Development Jam"
- "UI/UX Design Competition"
```

### Sample Date Ranges
```
Current: 2025-01-01T00:00:00Z to 2025-01-31T23:59:59Z
Future:  2025-06-01T09:00:00Z to 2025-06-30T18:00:00Z
Past:    2024-12-01T00:00:00Z to 2024-12-31T23:59:59Z
```

## 10. Environment Setup

### Postman Environment Variables
```
baseUrl: http://localhost:3000/api
token: [Set after login]
contestId: [Set after creating contest]
userId: [Set with actual user ID]
```

### Pre-request Script (for dynamic tokens)
```javascript
// Add this to collection pre-request script
if (!pm.environment.get("token")) {
    console.log("Token not set. Please login first.");
}
```

### Test Script (for automatic variable setting)
```javascript
// Add this to POST /contests request
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.data && response.data.contest_id) {
        pm.environment.set("contestId", response.data.contest_id);
    }
}
```

## Notes:
1. Start your API server with `npm run dev`
2. Set up Cloudinary credentials in your `.env` file for image uploads
3. Use actual image files for profile_img uploads (JPG, PNG, etc.)
4. Replace `{{variables}}` with actual values or set them in Postman environment
5. Test both success and error scenarios
6. Check response status codes and data structure