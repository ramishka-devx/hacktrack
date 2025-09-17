# User Task Module

This module handles the assignment and management of tasks to users within contests. When a user joins a contest or accesses contest tasks, entries are created in the `user_task` table to track their progress.

## Features

- **Automatic Task Assignment**: When a user accesses a contest, all tasks in that contest are automatically assigned to them
- **Individual Task Assignment**: Single tasks can be assigned to users
- **Task Status Tracking**: Track user progress through various task states
- **Access Control**: Check if users have access to specific tasks
- **Progress Management**: Update task status and scores

## Database Schema

The module works with the `user_task` table:

```sql
CREATE TABLE `user_task` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `task_id` int(10) UNSIGNED NOT NULL,
  `status` enum('assigned','in_progress','submitted','reviewed','closed') DEFAULT 'assigned',
  `score` decimal(6,2) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_task_user_task` (`user_id`,`task_id`)
);
```

## API Endpoints

### Contest-specific User Tasks

All endpoints require JWT authentication.

#### Assign All Contest Tasks to User
```http
POST /api/contests/:contest_id/user-tasks/assign
Authorization: Bearer <jwt_token>
```

Automatically assigns all tasks from the specified contest to the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "contest_id": 1,
    "tasks_assigned": 5,
    "new_assignments": 3,
    "message": "Successfully assigned 3 new tasks to user"
  }
}
```

#### Get User's Contest Tasks
```http
GET /api/contests/:contest_id/user-tasks
Authorization: Bearer <jwt_token>
```

Retrieves all tasks assigned to the user for a specific contest.

#### Get Specific User Task
```http
GET /api/contests/:contest_id/user-tasks/:task_id
Authorization: Bearer <jwt_token>
```

#### Update Task Status
```http
PUT /api/contests/:contest_id/user-tasks/:task_id/status
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "status": "submitted",
  "score": 95.5
}
```

**Valid statuses:** `assigned`, `in_progress`, `submitted`, `reviewed`, `closed`

#### Assign Single Task
```http
POST /api/contests/:contest_id/user-tasks/:task_id/assign
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "status": "assigned"
}
```

#### Remove Task Assignment
```http
DELETE /api/contests/:contest_id/user-tasks/:task_id
Authorization: Bearer <jwt_token>
```

#### Check Task Access
```http
GET /api/contests/:contest_id/user-tasks/:task_id/access
Authorization: Bearer <jwt_token>
```

### General User Tasks

#### Get All User Tasks
```http
GET /api/user-tasks?page=1&limit=10
Authorization: Bearer <jwt_token>
```

Retrieves all tasks assigned to the user across all contests with pagination.

## Usage Example

1. **User joins a contest**: Call the assign endpoint to automatically assign all contest tasks
2. **User starts working on a task**: Update status to `in_progress`
3. **User submits solution**: Update status to `submitted` with optional score
4. **Admin reviews**: Update status to `reviewed` or `closed`

## Implementation Details

- **JWT Integration**: User ID is extracted from the JWT token in the request headers
- **Duplicate Prevention**: Uses `INSERT IGNORE` to prevent duplicate assignments
- **Cascade Deletes**: When tasks or users are deleted, user_task entries are automatically removed
- **Status Validation**: Only valid status transitions are allowed
- **Access Control**: Users can only access their own task assignments

## Dependencies

- Express.js for routing
- Joi for request validation
- JWT for authentication
- MySQL/MariaDB for data storage