# Tasks Module

This module handles task management within contests, providing CRUD operations for tasks.

## Features

- Create tasks within specific contests
- Retrieve tasks by ID or contest
- Update task details (only by creator)
- Delete tasks (only by creator)
- List all tasks with pagination and filtering

## API Endpoints

### 1. Create Task
**POST** `/api/tasks`

Creates a new task in a specific contest.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "contest_id": 1,
  "title": "Two Sum Problem",
  "description": "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
  "points": 100,
  "difficulty": "easy"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task_id": 1,
    "contest_id": 1,
    "title": "Two Sum Problem",
    "description": "Given an array of integers...",
    "points": 100,
    "difficulty": "easy",
    "created_by": 1
  }
}
```

### 2. Get Task by ID
**GET** `/api/tasks/:task_id`

Retrieves a specific task by its ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task_id": 1,
    "contest_id": 1,
    "title": "Two Sum Problem",
    "description": "Given an array of integers...",
    "points": 100,
    "difficulty": "easy",
    "created_by": 1,
    "created_at": "2025-09-17T16:50:00.000Z",
    "updated_at": "2025-09-17T16:50:00.000Z",
    "contest_title": "Algorithm Challenge 2025",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### 3. Get Tasks by Contest
**GET** `/api/tasks/contest/:contest_id`

Retrieves all tasks for a specific contest with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "task_id": 1,
        "contest_id": 1,
        "title": "Two Sum Problem",
        "description": "Given an array of integers...",
        "points": 100,
        "difficulty": "easy",
        "created_by": 1,
        "created_at": "2025-09-17T16:50:00.000Z",
        "updated_at": "2025-09-17T16:50:00.000Z",
        "first_name": "John",
        "last_name": "Doe"
      }
    ],
    "total": 1
  }
}
```

### 4. List All Tasks
**GET** `/api/tasks`

Retrieves all tasks with optional filtering and pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `contest_id` (optional): Filter by contest ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "task_id": 1,
        "contest_id": 1,
        "title": "Two Sum Problem",
        "description": "Given an array of integers...",
        "points": 100,
        "difficulty": "easy",
        "created_by": 1,
        "created_at": "2025-09-17T16:50:00.000Z",
        "updated_at": "2025-09-17T16:50:00.000Z",
        "contest_title": "Algorithm Challenge 2025",
        "first_name": "John",
        "last_name": "Doe"
      }
    ],
    "total": 1
  }
}
```

### 5. Update Task
**PUT** `/api/tasks/:task_id`

Updates an existing task. Only the creator can update the task.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Two Sum Problem",
  "description": "Updated description...",
  "points": 150,
  "difficulty": "medium"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task_id": 1,
    "contest_id": 1,
    "title": "Updated Two Sum Problem",
    "description": "Updated description...",
    "points": 150,
    "difficulty": "medium",
    "created_by": 1,
    "created_at": "2025-09-17T16:50:00.000Z",
    "updated_at": "2025-09-17T17:00:00.000Z",
    "contest_title": "Algorithm Challenge 2025",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### 6. Delete Task
**DELETE** `/api/tasks/:task_id`

Deletes a task. Only the creator can delete the task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

## Validation Rules

### Task Creation
- `contest_id`: Required, positive integer
- `title`: Required, max 200 characters
- `description`: Optional, text
- `points`: Optional, non-negative integer (default: 0)
- `difficulty`: Optional, must be "easy", "medium", or "hard" (default: "medium")

### Task Update
- `title`: Optional, max 200 characters
- `description`: Optional, text
- `points`: Optional, non-negative integer
- `difficulty`: Optional, must be "easy", "medium", or "hard"
- At least one field must be provided

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title is required."
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You can only update tasks you created"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

## Permissions

- **Create Task**: Authenticated users can create tasks in any contest
- **Read Tasks**: Authenticated users can view all tasks
- **Update Task**: Only the task creator can update their tasks
- **Delete Task**: Only the task creator can delete their tasks

## Database Schema

The tasks module uses the `task` table with the following structure:

```sql
CREATE TABLE `task` (
  `task_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `contest_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `difficulty` enum('easy','medium','hard') DEFAULT 'medium',
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`task_id`),
  KEY `idx_task_contest` (`contest_id`),
  KEY `idx_task_created_by` (`created_by`),
  CONSTRAINT `fk_task_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`contest_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_task_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```