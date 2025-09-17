# Contest Privacy & Access Control

## 🔒 **Private Contest Access Rules**

After the implementation of proper access control, here's how private contest visibility works:

### **Who Can View Private Contest Details?**

1. **Contest Creator** - Always has full access
2. **Enrolled Participants** - Can view contest details and participants
3. **Non-enrolled Users** - **CANNOT** view private contest details
4. **Anonymous Users** - **CANNOT** view private contest details

### **Public vs Private Contest Access**

| Action | Public Contest | Private Contest |
|--------|---------------|-----------------|
| View contest details | ✅ Anyone | ❌ Only enrolled users |
| View participants | ✅ Anyone | ❌ Only enrolled users |
| Join contest | ✅ Anyone (if authenticated) | ❌ Only by invitation |
| See in contest list | ✅ Everyone | ✅ Everyone (but limited info) |

## 📋 **API Behavior Changes**

### **Contest Details Endpoints**

```bash
# These now check private access:
GET /api/contests/:id
GET /api/contests/slug/:slug  
GET /api/contests/:id/participants
```

**For Private Contests:**
- **Without Authentication**: Returns `403 Forbidden`
- **With Authentication but not enrolled**: Returns `403 Forbidden`
- **With Authentication and enrolled**: Returns full details

### **Contest Listing**

```bash
GET /api/contests
```
- Still shows all contests (public and private)
- Private contests show basic info but access is restricted

## 🛡️ **Security Implementation**

### **Access Control Methods**

1. **`checkContestAccess(contest_id, user_id)`**
   - Checks if user is creator or participant
   - Returns boolean for access permission

2. **Optional Authentication Middleware**
   - Allows endpoints to work with or without auth
   - Sets `req.user = null` if no valid token

3. **Service Layer Validation**
   - Validates access before returning data
   - Throws appropriate 403 errors for denied access

## 📝 **Updated API Examples**

### **Accessing Private Contest (Enrolled User)**
```bash
GET /api/contests/123
Authorization: Bearer <valid-token>

Response: 200 OK
{
  "success": true,
  "data": { /* full contest details */ }
}
```

### **Accessing Private Contest (Non-enrolled User)**
```bash
GET /api/contests/123
Authorization: Bearer <valid-token>

Response: 403 Forbidden
{
  "success": false,
  "message": "You do not have permission to view this private contest"
}
```

### **Accessing Private Contest (No Auth)**
```bash
GET /api/contests/123

Response: 403 Forbidden
{
  "success": false,
  "message": "This contest is private. Please log in to access it."
}
```

## 🔄 **Joining Private Contests**

Private contests require invitation or manual enrollment:

```bash
# Only works if user has permission or contest allows direct joining
POST /api/contests/123/join
Authorization: Bearer <token>
{
  "role_in_contest": "participant"
}
```

## 📊 **Privacy Levels Summary**

### **Public Contest** (`is_public: true`)
- ✅ Visible to everyone
- ✅ Anyone can view details
- ✅ Anyone can join
- ✅ Participants list visible

### **Private Contest** (`is_public: false`)
- ✅ Listed in general contest list
- ❌ Details only for enrolled users
- ❌ Joining restricted
- ❌ Participants list only for enrolled users

This implementation ensures that private contests maintain their privacy while still allowing proper functionality for authorized users.