# Public Contests API Endpoint

## 📋 **New Endpoint: `/api/contests/public`**

This endpoint returns only public contests that are visible and joinable by everyone.

### **Request**
```http
GET /api/contests/public
```

### **Query Parameters**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of contests per page (default: 10, max: 100)
- `created_by` (optional): Filter by specific creator's user ID

### **Response Structure**

```json
{
  "success": true,
  "data": {
    "rows": [
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
        "creator_email": "john@example.com"
      },
      {
        "contest_id": 3,
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
        "creator_email": "jane@example.com"
      }
    ],
    "total": 15
  }
}
```

## 🔍 **What This Endpoint Does**

- ✅ **Shows only public contests** (`is_public: true`)
- ✅ **No authentication required**
- ✅ **Includes creator information**
- ✅ **Supports pagination**
- ✅ **Allows filtering by creator**
- ✅ **Perfect for public contest galleries**

## 🆚 **Comparison with Other Endpoints**

| Endpoint | Authentication | Returns | Use Case |
|----------|---------------|---------|----------|
| `GET /api/contests` | Optional | All accessible contests | General contest listing |
| `GET /api/contests/public` | **Not required** | **Only public contests** | **Public galleries** |
| `GET /api/contests/my` | Required | User's contests | User dashboard |
| `GET /api/contests/my/contests` | Required | User's created contests | Creator dashboard |

## 🌟 **Key Benefits**

1. **No Authentication Needed**: Perfect for public-facing pages
2. **Guaranteed Public**: Only shows contests anyone can join
3. **Clean Response**: No private contests mixed in
4. **SEO Friendly**: Great for public contest directories
5. **Fast Performance**: Optimized for public display

## 📱 **Use Cases**

- **Homepage contest showcases**
- **Public contest directories**
- **Landing pages for anonymous users**
- **Contest discovery pages**
- **Public APIs for third-party integrations**

## 📝 **Usage Examples**

### **Get All Public Contests**
```bash
curl -X GET "http://localhost:3000/api/contests/public"
```

### **Get Public Contests with Pagination**
```bash
curl -X GET "http://localhost:3000/api/contests/public?page=1&limit=5"
```

### **Get Public Contests by Specific Creator**
```bash
curl -X GET "http://localhost:3000/api/contests/public?created_by=1"
```

## 🔒 **Security Features**

- **No private contest leakage**: Only `is_public: true` contests
- **Creator info included**: Safe to show since contests are public
- **No sensitive data**: All returned data is meant to be public

## 🧪 **Test Scenarios**

1. **Anonymous access** (no token required)
2. **Pagination with various limits**
3. **Filter by specific creator**
4. **Empty results** (no public contests)
5. **Mixed public/private database** (only public returned)

## 📊 **Response Fields**

Same as general contest listing, but guaranteed to be:
- `is_public: true` for all contests
- Safe for public display
- No access restrictions needed

This endpoint is perfect for creating public contest galleries and showcases without worrying about privacy or authentication!