# Contest Module

This module provides complete CRUD operations for contest management following the same patterns as the user module. It includes profile image upload functionality using Cloudinary.

## Features

- **Contest CRUD Operations**: Create, read, update, delete contests
- **Profile Image Upload**: Upload and manage contest profile images via Cloudinary
- **Participant Management**: Join/leave contests, manage participant roles
- **Slug-based URLs**: SEO-friendly URLs using auto-generated slugs
- **Access Control**: Public/private contests with proper permissions
- **Rich Queries**: Filter contests by creator, public status, pagination

## Database Schema

The contest module uses the following tables:
- `contests`: Main contest information
- `user_contest`: Many-to-many relationship between users and contests
- `task`: Tasks belonging to contests (future implementation)

## API Endpoints

### Public Endpoints

```
GET /api/contests                    # List all contests (with filters)
GET /api/contests/public             # List only public contests
GET /api/contests/slug/:slug         # Get contest by slug
GET /api/contests/:id                # Get contest by ID
GET /api/contests/:id/participants   # Get contest participants
```

### Protected Endpoints (Authentication Required)

```
POST /api/contests                   # Create new contest
PUT /api/contests/:id                # Update contest
DELETE /api/contests/:id             # Delete contest
GET /api/contests/my/contests        # Get current user's created contests
GET /api/contests/my                 # Get all user's contests (created + enrolled)
POST /api/contests/:id/join          # Join a contest
DELETE /api/contests/:id/leave       # Leave a contest
PUT /api/contests/:id/participants/:user_id/role  # Update participant role
```

## Environment Variables

Add these to your `.env` file for Cloudinary integration:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Usage Examples

### Creating a Contest

```bash
POST /api/contests
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "title": "Web Development Challenge 2025",
  "starts_at": "2025-01-01T00:00:00Z",
  "ends_at": "2025-01-31T23:59:59Z",
  "is_public": true
}
# + profile_img file upload
```

### Joining a Contest

```bash
POST /api/contests/123/join
Content-Type: application/json
Authorization: Bearer <token>

{
  "role_in_contest": "participant"
}
```

### Updating Contest

```bash
PUT /api/contests/123
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "title": "Updated Contest Title",
  "is_public": false
}
# + optional new profile_img file upload
```

## File Structure

```
src/modules/contest/
├── contest.model.js       # Database operations
├── contest.service.js     # Business logic + Cloudinary integration
├── contest.controller.js  # HTTP request handlers
├── contest.routes.js      # Route definitions + middleware
└── contest.validation.js  # Input validation schemas
```

## Key Features Implementation

### 1. Cloudinary Integration
- Automatic image upload on contest creation/update
- Image optimization (500x500, auto quality)
- Organized folder structure (`contests/profile-images/`)
- Automatic cleanup on contest deletion

### 2. Slug Generation
- Auto-generated from contest title
- URL-safe formatting
- Automatic uniqueness handling with counters

### 3. Permission System
- Contest creators have full control
- Organizers can update contest details
- Participants can view and leave
- Public/private contest access control

### 4. Participant Management
- Multiple roles: participant, mentor, organizer
- Join/leave functionality
- Role updates by authorized users
- Participant listing

## Dependencies

- `cloudinary`: Image upload and management
- `multer`: File upload middleware
- `joi`: Input validation
- `express`: Web framework
- `mysql2`: Database connection

## Notes

- Profile images are optional
- Contests can be public or private
- Slugs are auto-generated and guaranteed unique
- File size limit is set to 5MB for profile images
- Only image files are accepted for profile uploads
- All dates should be in ISO format