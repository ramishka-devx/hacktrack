# My Contests API Endpoint

## 📋 **New Endpoint: `/api/contests/my`**

This endpoint returns all contests related to the authenticated user - both contests they have created and contests they have enrolled in.

### **Request**
```http
GET /api/contests/my
Authorization: Bearer <token>
```

### **Query Parameters**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of contests per page (default: 10, max: 100)

### **Response Structure**

```json
{
  "success": true,
  "data": {
    "contests": [
      {
        "contest_id": 1,
        "title": "Web Development Championship 2025",
        "slug": "web-development-championship-2025",
        "profile_img": "https://cloudinary.../image.jpg",
        "created_by": 1,
        "starts_at": "2025-01-15T09:00:00.000Z",
        "ends_at": "2025-01-30T18:00:00.000Z",
        "is_public": true,
        "created_at": "2025-01-01T10:00:00.000Z",
        "updated_at": "2025-01-01T10:00:00.000Z",
        "first_name": "John",
        "last_name": "Doe",
        "creator_email": "john@example.com",
        "my_role": "creator",
        "contest_type": "created"
      },
      {
        "contest_id": 2,
        "title": "JavaScript Mastery Challenge",
        "slug": "javascript-mastery-challenge",
        "profile_img": null,
        "created_by": 2,
        "starts_at": "2025-03-01T08:00:00.000Z",
        "ends_at": "2025-03-15T23:59:59.000Z",
        "is_public": true,
        "created_at": "2025-02-15T14:30:00.000Z",
        "updated_at": "2025-02-15T14:30:00.000Z",
        "first_name": "Jane",
        "last_name": "Smith",
        "creator_email": "jane@example.com",
        "my_role": "participant",
        "contest_type": "enrolled",
        "joined_at": "2025-02-16T09:15:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "total_created": 2,
      "total_enrolled": 3
    }
  }
}
```

## 🔍 **Response Fields Explanation**

### **Contest Fields**
- `contest_id`: Unique contest identifier
- `title`: Contest name
- `slug`: URL-friendly version of title
- `profile_img`: Contest profile image URL (can be null)
- `created_by`: User ID of contest creator
- `starts_at/ends_at`: Contest duration
- `is_public`: Whether contest is public or private
- `created_at/updated_at`: Contest timestamps

### **Creator Information**
- `first_name/last_name`: Contest creator's name
- `creator_email`: Contest creator's email

### **User Relationship Fields**
- `my_role`: User's role in this contest
  - `"creator"`: User created this contest
  - `"participant"`: User joined as participant
  - `"mentor"`: User joined as mentor
  - `"organizer"`: User joined as organizer
- `contest_type`: How user relates to contest
  - `"created"`: Contest created by user
  - `"enrolled"`: Contest user joined
- `joined_at`: When user joined (only for enrolled contests)

### **Pagination Information**
- `page`: Current page number
- `limit`: Items per page
- `total`: Total number of contests for this user
- `total_created`: Number of contests created by user
- `total_enrolled`: Number of contests user enrolled in

## 🆚 **Comparison with Existing Endpoints**

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `GET /api/contests/my/contests` | Created contests only | Contests created by user |
| `GET /api/contests/my` | **NEW** All my contests | Created + enrolled contests |
| `GET /api/contests` | All contests | Public + accessible private contests |

## 📊 **Sorting Logic**

Contests are sorted by most recent activity:
- **Created contests**: Sorted by `created_at`
- **Enrolled contests**: Sorted by `joined_at`
- **Combined**: All contests mixed and sorted by most recent timestamp

## 🔒 **Security & Access**

- **Authentication Required**: Must provide valid JWT token
- **User Isolation**: Only returns contests related to authenticated user
- **Privacy Respected**: Private contest details only shown if user has access

## 📝 **Usage Examples**

### **Get All My Contests**
```bash
curl -X GET "http://localhost:3000/api/contests/my" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Get My Contests (Paginated)**
```bash
curl -X GET "http://localhost:3000/api/contests/my?page=2&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 **Test Scenarios**

1. **User with created contests only**
2. **User with enrolled contests only** 
3. **User with both created and enrolled contests**
4. **Empty result (new user)**
5. **Pagination with various limits**
6. **Mixed public and private contests**

This endpoint provides a comprehensive view of all contests a user is involved with, making it perfect for user dashboards and profile pages!