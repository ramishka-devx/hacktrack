# Task Statistics Module

This module provides comprehensive statistics and analytics for task completion within contests, including user progress tracking, leaderboards, and contest performance metrics.

## Features

- Contest-wide task completion statistics
- Individual user task progress tracking
- Contest leaderboards with rankings
- Overall contest performance metrics
- User detailed statistics and achievements

## API Endpoints

### 1. Get Contest Overall Statistics
**GET** `/api/contests/:contest_id/stats/overall`

Retrieves overall statistics for a contest including total tasks, participants, and completion rates.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contest overall statistics retrieved successfully",
  "data": {
    "total_tasks": 5,
    "total_participants": 10,
    "total_assignments": 25,
    "total_completed": 12,
    "total_in_progress": 8,
    "total_assigned": 5,
    "overall_completion_percentage": 48.00,
    "total_points_earned": 1250,
    "total_possible_points": 2500
  }
}
```

### 2. Get Task Completion Statistics
**GET** `/api/contests/:contest_id/stats/tasks`

Retrieves completion statistics for each task in the contest.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contest task statistics retrieved successfully",
  "data": [
    {
      "task_id": 1,
      "title": "Two Sum Problem",
      "difficulty": "easy",
      "points": 100,
      "total_assignments": 8,
      "completed_count": 6,
      "in_progress_count": 1,
      "assigned_count": 1,
      "completion_percentage": 75.00
    },
    {
      "task_id": 2,
      "title": "Binary Tree Traversal",
      "difficulty": "medium",
      "points": 200,
      "total_assignments": 5,
      "completed_count": 3,
      "in_progress_count": 2,
      "assigned_count": 0,
      "completion_percentage": 60.00
    }
  ]
}
```

### 3. Get Contest Leaderboard
**GET** `/api/contests/:contest_id/stats/leaderboard`

Retrieves the contest leaderboard with user rankings based on points and completion.

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
  "message": "Contest leaderboard retrieved successfully",
  "data": {
    "rows": [
      {
        "user_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "completed_tasks": 4,
        "total_assigned_tasks": 5,
        "total_points": 450,
        "average_score": 8.5,
        "completion_percentage": 80.00
      },
      {
        "user_id": 2,
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane@example.com",
        "completed_tasks": 3,
        "total_assigned_tasks": 4,
        "total_points": 350,
        "average_score": 7.8,
        "completion_percentage": 75.00
      }
    ],
    "total": 10
  }
}
```

### 4. Get Current User's Task Statistics
**GET** `/api/contests/:contest_id/stats/my-tasks`

Retrieves the current user's task completion status for the contest.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Your task statistics retrieved successfully",
  "data": [
    {
      "task_id": 1,
      "title": "Two Sum Problem",
      "description": "Given an array of integers...",
      "difficulty": "easy",
      "points": 100,
      "status": "submitted",
      "score": 9.5,
      "submitted_at": "2025-09-17T18:30:00.000Z",
      "assigned_at": "2025-09-17T10:00:00.000Z",
      "completion_status": "completed"
    },
    {
      "task_id": 2,
      "title": "Binary Tree Traversal",
      "description": "Given the root of a binary tree...",
      "difficulty": "medium",
      "points": 200,
      "status": "in_progress",
      "score": null,
      "submitted_at": null,
      "assigned_at": "2025-09-17T11:00:00.000Z",
      "completion_status": "in_progress"
    }
  ]
}
```

### 5. Get Current User's Detailed Statistics
**GET** `/api/contests/:contest_id/stats/my-stats`

Retrieves detailed statistics summary for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Your detailed statistics retrieved successfully",
  "data": {
    "user_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "completed_tasks": 3,
    "in_progress_tasks": 1,
    "assigned_tasks": 1,
    "total_assigned_tasks": 5,
    "total_points": 450,
    "average_score": 8.5,
    "completion_percentage": 60.00
  }
}
```

### 6. Get Specific User's Task Statistics
**GET** `/api/contests/:contest_id/stats/users/:user_id/tasks`

Retrieves task completion status for a specific user in the contest.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):** Same format as current user's task statistics

### 7. Get Specific User's Detailed Statistics
**GET** `/api/contests/:contest_id/stats/users/:user_id/stats`

Retrieves detailed statistics summary for a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):** Same format as current user's detailed statistics

## Task Status Values

The system tracks the following task statuses:

- **`assigned`**: Task has been assigned but not started
- **`in_progress`**: User is currently working on the task
- **`submitted`**: User has submitted the task for review
- **`reviewed`**: Task has been reviewed by mentors/organizers
- **`closed`**: Task is complete and closed

## Completion Status Mapping

- **`not_assigned`**: Task exists but not assigned to user
- **`not_started`**: Task assigned but work hasn't begun (`assigned`)
- **`in_progress`**: User is actively working (`in_progress`)
- **`completed`**: Task is finished (`submitted`, `reviewed`, or `closed`)

## Statistics Calculations

### Completion Percentage
```
(Completed Tasks / Total Assigned Tasks) × 100
```

### Total Points
Sum of points from all completed tasks (status: `submitted`, `reviewed`, or `closed`)

### Average Score
Average of all scores from completed tasks where score is not null

## Error Responses

### 404 Not Found
```json
{
  "success": false,
  "message": "Contest not found"
}
```

```json
{
  "success": false,
  "message": "User not found or not participating in this contest"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token is required"
}
```

## Sample Use Cases

### 1. Contest Dashboard
```javascript
// Get overall contest metrics
GET /api/contests/1/stats/overall

// Get task completion breakdown
GET /api/contests/1/stats/tasks

// Get top performers
GET /api/contests/1/stats/leaderboard?limit=5
```

### 2. User Progress Tracking
```javascript
// Get user's current progress
GET /api/contests/1/stats/my-tasks

// Get user's summary statistics
GET /api/contests/1/stats/my-stats
```

### 3. Administrative Monitoring
```javascript
// Monitor specific user progress
GET /api/contests/1/stats/users/123/tasks

// Get detailed user analytics
GET /api/contests/1/stats/users/123/stats
```

## Database Dependencies

This module relies on the following tables:
- `contests` - Contest information
- `task` - Task definitions
- `users` - User information  
- `user_task` - Task assignments and completion status

## Performance Considerations

- Queries use appropriate indexes on `contest_id`, `user_id`, and `task_id`
- Leaderboard queries are optimized with pagination
- Statistics are calculated in real-time (consider caching for high-traffic scenarios)
- Complex aggregations may benefit from database views or materialized tables

## Future Enhancements

- Real-time statistics updates via WebSockets
- Caching layer for frequently accessed statistics
- Historical trend analysis
- Export functionality for reports
- Custom date range filtering
- Performance analytics and insights