# Contest API - Postman Test Data

## Postman Environment Variables
Create these variables in your Postman environment:
```
baseUrl: http://localhost:3000/api
token: (will be set after login)
contestId: (will be set after creating contest)
userId: (will be set from user registration)
```

## 1. User Setup (Required First)

### Register User 1 (Contest Creator)
**POST** `{{baseUrl}}/users/register`
```json
{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@example.com",
  "password": "password123"
}
```

### Register User 2 (Contest Participant)
**POST** `{{baseUrl}}/users/register`
```json
{
  "first_name": "Bob",
  "last_name": "Smith",
  "email": "bob.smith@example.com",
  "password": "password456"
}
```

### Login User 1
**POST** `{{baseUrl}}/users/login`
```json
{
  "email": "alice.johnson@example.com",
  "password": "password123"
}
```
*Save the token from response to environment variable*

## 2. Create Contests

### Contest 1: Web Development Challenge
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Ultimate Web Development Challenge 2025",
  "starts_at": "2025-12-01T09:00:00Z",
  "ends_at": "2025-12-31T18:00:00Z",
  "is_public": true
}
```

### Contest 2: Mobile App Contest
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Mobile App Innovation Contest",
  "starts_at": "2026-01-15T10:00:00Z",
  "ends_at": "2026-02-15T20:00:00Z",
  "is_public": true
}
```

### Contest 3: Private Team Challenge
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Internal Team Building Hackathon",
  "starts_at": "2025-11-01T08:00:00Z",
  "ends_at": "2025-11-03T22:00:00Z",
  "is_public": false
}
```

### Contest 4: AI/ML Challenge
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Artificial Intelligence & Machine Learning Showdown",
  "starts_at": "2026-03-01T09:00:00Z",
  "ends_at": "2026-03-31T23:59:59Z",
  "is_public": true
}
```

### Contest 5: Cybersecurity CTF
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Cybersecurity Capture The Flag Championship",
  "starts_at": "2025-10-15T00:00:00Z",
  "ends_at": "2025-10-17T23:59:59Z",
  "is_public": true
}
```

## 3. Contest Retrieval Tests

### Get All Contests
**GET** `{{baseUrl}}/contests`

### Get Contests with Pagination
**GET** `{{baseUrl}}/contests?page=1&limit=3`

### Get Only Public Contests
**GET** `{{baseUrl}}/contests?is_public=true`

### Get Private Contests
**GET** `{{baseUrl}}/contests?is_public=false`

### Get Contests by Creator
**GET** `{{baseUrl}}/contests?created_by=1`

### Get Contest by ID
**GET** `{{baseUrl}}/contests/1`

### Get Contest by Slug
**GET** `{{baseUrl}}/contests/slug/ultimate-web-development-challenge-2025`

### Get My Contests
**GET** `{{baseUrl}}/contests/my/contests`
**Headers:** `Authorization: Bearer {{token}}`

## 4. Contest Updates

### Update Contest Title and Dates
**PUT** `{{baseUrl}}/contests/1`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "UPDATED: Ultimate Web Development Challenge 2025 - Extended Edition",
  "ends_at": "2026-01-15T18:00:00Z"
}
```

### Update Contest Visibility
**PUT** `{{baseUrl}}/contests/2`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "is_public": false
}
```

### Update Contest Dates Only
**PUT** `{{baseUrl}}/contests/3`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "starts_at": "2025-11-05T09:00:00Z",
  "ends_at": "2025-11-07T18:00:00Z"
}
```

## 5. Participant Management

### Join Contest as Participant
**POST** `{{baseUrl}}/contests/1/join`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "participant"
}
```

### Join Contest as Mentor
**POST** `{{baseUrl}}/contests/2/join`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "mentor"
}
```

### Join Contest as Organizer
**POST** `{{baseUrl}}/contests/3/join`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "organizer"
}
```

### Get Contest Participants
**GET** `{{baseUrl}}/contests/1/participants`

### Update Participant Role
**PUT** `{{baseUrl}}/contests/1/participants/2/role`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "mentor"
}
```

### Leave Contest
**DELETE** `{{baseUrl}}/contests/1/leave`
**Headers:** `Authorization: Bearer {{token}}`

## 6. Error Testing Scenarios

### Try Creating Contest Without Auth
**POST** `{{baseUrl}}/contests`
```json
{
  "title": "Unauthorized Contest Creation Attempt",
  "is_public": true
}
```

### Invalid Contest Data - Missing Title
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "starts_at": "2025-12-01T09:00:00Z",
  "ends_at": "2025-12-31T18:00:00Z",
  "is_public": true
}
```

### Invalid Contest Data - End Before Start
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Invalid Date Range Contest",
  "starts_at": "2025-12-31T18:00:00Z",
  "ends_at": "2025-12-01T09:00:00Z",
  "is_public": true
}
```

### Invalid Contest Data - Title Too Long
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "This is an extremely long contest title that exceeds the maximum character limit of 150 characters and should trigger a validation error when submitted to the API endpoint",
  "is_public": true
}
```

### Get Non-existent Contest
**GET** `{{baseUrl}}/contests/99999`

### Get Contest with Invalid Slug
**GET** `{{baseUrl}}/contests/slug/non-existent-contest-slug`

### Join Non-existent Contest
**POST** `{{baseUrl}}/contests/99999/join`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "participant"
}
```

### Join Contest Twice (Should Fail)
**POST** `{{baseUrl}}/contests/1/join`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "role_in_contest": "participant"
}
```
*Run this after already joining the contest*

### Update Contest Without Permission
**PUT** `{{baseUrl}}/contests/1`
**Headers:** `Authorization: Bearer {{invalidToken}}`
```json
{
  "title": "Unauthorized Update Attempt"
}
```

### Delete Contest Without Permission
**DELETE** `{{baseUrl}}/contests/1`
**Headers:** `Authorization: Bearer {{invalidToken}}`

## 7. File Upload Tests (Form Data)

### Create Contest with Profile Image
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
**Body Type:** `form-data`
```
title: Visual Design Contest 2025
starts_at: 2026-02-01T09:00:00Z
ends_at: 2026-02-28T18:00:00Z
is_public: true
profile_img: [Select an image file - JPG/PNG]
```

### Update Contest with New Profile Image
**PUT** `{{baseUrl}}/contests/1`
**Headers:** `Authorization: Bearer {{token}}`
**Body Type:** `form-data`
```
title: Updated Visual Design Contest 2025
profile_img: [Select a different image file]
```

### Try Invalid File Type
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
**Body Type:** `form-data`
```
title: Invalid File Type Test
profile_img: [Select a PDF or text file - should fail]
```

## 8. Advanced Query Tests

### Pagination Test - Page 2
**GET** `{{baseUrl}}/contests?page=2&limit=2`

### Large Limit Test
**GET** `{{baseUrl}}/contests?limit=50`

### Invalid Pagination
**GET** `{{baseUrl}}/contests?page=0&limit=-1`

### Combined Filters
**GET** `{{baseUrl}}/contests?is_public=true&page=1&limit=5&created_by=1`

## 9. Cleanup Tests

### Delete Contest (Creator Only)
**DELETE** `{{baseUrl}}/contests/5`
**Headers:** `Authorization: Bearer {{token}}`

### Try to Access Deleted Contest
**GET** `{{baseUrl}}/contests/5`

## 10. Load Testing Data

### Multiple Contest Creation (Run multiple times)
**POST** `{{baseUrl}}/contests`
**Headers:** `Authorization: Bearer {{token}}`
```json
{
  "title": "Batch Contest {{$randomInt}}",
  "starts_at": "2025-{{$randomInt}}{{$randomInt}}-01T09:00:00Z",
  "ends_at": "2025-12-31T18:00:00Z",
  "is_public": {{$randomBoolean}}
}
```

## Test Execution Order

1. **Setup Phase:**
   - Register users
   - Login and get tokens

2. **Creation Phase:**
   - Create multiple contests
   - Test file uploads

3. **Retrieval Phase:**
   - Test all GET endpoints
   - Test filtering and pagination

4. **Participation Phase:**
   - Join contests
   - Update roles
   - Leave contests

5. **Update Phase:**
   - Update contest details
   - Update profile images

6. **Error Testing Phase:**
   - Test all error scenarios
   - Test unauthorized access

7. **Cleanup Phase:**
   - Delete contests
   - Verify deletions

## Expected Response Formats

### Successful Contest Creation (201)
```json
{
  "success": true,
  "message": "Contest created successfully",
  "data": {
    "contest_id": 1,
    "title": "Ultimate Web Development Challenge 2025",
    "slug": "ultimate-web-development-challenge-2025",
    "profile_img": null,
    "created_by": 1,
    "starts_at": "2025-12-01T09:00:00.000Z",
    "ends_at": "2025-12-31T18:00:00.000Z",
    "is_public": 1
  }
}
```

### Error Response (400/401/403/404)
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error information"]
}
```