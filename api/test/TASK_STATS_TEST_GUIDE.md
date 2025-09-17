# Task Statistics Module - Test Guide

This document provides comprehensive testing scenarios and expected results for the Task Statistics API endpoints.

## Prerequisites

1. **Database Setup**: Run the sample data scripts
2. **Authentication**: Valid JWT token from user login
3. **Test Data**: At least 2 contests with tasks and user assignments

## Test Data Overview

### Contest 1 (ID: 1)
- **5 tasks** available
- **5 participants** with varying completion rates
- **Mixed completion statuses** (assigned, in_progress, submitted, reviewed, closed)

### Contest 2 (ID: 2)  
- **3 tasks** available
- **4 participants** with different performance patterns
- **Cross-contest participation** (some users in both contests)

### User Completion Patterns

| User ID | Contest 1 | Contest 2 | Performance Level |
|---------|-----------|-----------|-------------------|
| 1       | 4/5 tasks | 2/3 tasks | High Performer    |
| 2       | 3/4 tasks | 1/2 tasks | Medium Performer  |
| 3       | 2/4 tasks | 3/3 tasks | Variable          |
| 4       | 1/3 tasks | 1/1 tasks | New Participant   |
| 5       | 0/2 tasks | 1/1 tasks | Struggling        |

## Test Scenarios

### 1. Contest Overall Statistics

**Endpoint**: `GET /api/contests/1/stats/overall`

**Expected Response Structure**:
```json
{
  "success": true,
  "message": "Contest overall statistics retrieved successfully",
  "data": {
    "total_tasks": 5,
    "total_participants": 5,
    "total_assignments": 18,
    "total_completed": 10,
    "total_in_progress": 4,
    "total_assigned": 4,
    "overall_completion_percentage": 55.56,
    "total_points_earned": 1500,
    "total_possible_points": 2700
  }
}
```

**Validation Points**:
- ✅ Total tasks matches contest task count
- ✅ Participants count includes only users with assignments
- ✅ Completion percentage is calculated correctly
- ✅ Points calculations are accurate

### 2. Task Completion Statistics

**Endpoint**: `GET /api/contests/1/stats/tasks`

**Expected Results**:
- **Task 1** (Easy - 100 pts): Highest completion rate (~80%)
- **Task 2** (Medium - 200 pts): Medium completion rate (~60%)
- **Task 3** (Medium - 300 pts): Lower completion rate (~40%)
- **Task 4** (Hard - 500 pts): Low completion rate (~20%)
- **Task 5** (Easy - 120 pts): Very low completion rate (0-20%)

**Validation Points**:
- ✅ Completion percentages decrease with difficulty
- ✅ Assignment counts match user_task records
- ✅ Status counts are accurate (completed, in_progress, assigned)

### 3. Contest Leaderboard

**Endpoint**: `GET /api/contests/1/stats/leaderboard`

**Expected Ranking**:
1. **User 1**: ~450 points, 80% completion
2. **User 2**: ~350 points, 75% completion  
3. **User 3**: ~200 points, 50% completion
4. **User 4**: ~100 points, 33% completion
5. **User 5**: 0 points, 0% completion

**Validation Points**:
- ✅ Users ranked by total points (primary)
- ✅ Completion percentage as secondary ranking
- ✅ Pagination works correctly
- ✅ Total count matches participating users

### 4. User Task Statistics

**Endpoint**: `GET /api/contests/1/stats/users/1/tasks`

**Expected for User 1**:
```json
[
  {
    "task_id": 1,
    "title": "Two Sum Problem",
    "status": "closed",
    "score": 9.5,
    "completion_status": "completed"
  },
  {
    "task_id": 2,
    "status": "reviewed", 
    "completion_status": "completed"
  },
  {
    "task_id": 4,
    "status": "in_progress",
    "completion_status": "in_progress"
  }
]
```

**Validation Points**:
- ✅ Shows all tasks for the contest
- ✅ Includes assigned, in_progress, and completed tasks
- ✅ Completion status mapping is correct
- ✅ Scores and submission dates are accurate

### 5. User Detailed Statistics

**Endpoint**: `GET /api/contests/1/stats/users/1/stats`

**Expected for User 1**:
```json
{
  "user_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "completed_tasks": 3,
  "in_progress_tasks": 1,
  "assigned_tasks": 1,
  "total_assigned_tasks": 5,
  "total_points": 450,
  "average_score": 8.7,
  "completion_percentage": 60.0
}
```

## Error Testing Scenarios

### 1. Non-existent Resources

| Test Case | Endpoint | Expected Status | Expected Message |
|-----------|----------|-----------------|------------------|
| Invalid Contest | `/api/contests/999/stats/overall` | 404 | "Contest not found" |
| Invalid User | `/api/contests/1/stats/users/999/tasks` | 404 | "User not found or not participating" |

### 2. Authentication Errors

| Test Case | Token | Expected Status | Expected Message |
|-----------|--------|-----------------|------------------|
| No Token | (none) | 401 | "Access token is required" |
| Invalid Token | "invalid_token" | 401 | "Invalid token" |
| Expired Token | (expired JWT) | 401 | "Token expired" |

### 3. Validation Errors

| Test Case | Parameter | Expected Status | Expected Message |
|-----------|-----------|-----------------|------------------|
| Invalid Page | `page=0` | 400 | "Page must be at least 1" |
| Invalid Limit | `limit=-5` | 400 | "Limit must be at least 1" |
| Limit Too High | `limit=200` | 400 | "Limit cannot exceed 100" |

## Performance Testing

### 1. Pagination Testing

```http
# Test different page sizes
GET /api/contests/1/stats/leaderboard?page=1&limit=3
GET /api/contests/1/stats/leaderboard?page=2&limit=3
GET /api/contests/1/stats/leaderboard?page=3&limit=3

# Test edge cases
GET /api/contests/1/stats/leaderboard?page=999&limit=10  # Beyond available data
GET /api/contests/1/stats/leaderboard?page=1&limit=100   # Maximum limit
```

### 2. Multiple Rapid Requests (Rate Limiting)

```http
# Send multiple requests rapidly to test rate limiting
GET /api/contests/1/stats/overall
GET /api/contests/1/stats/tasks  
GET /api/contests/1/stats/leaderboard
# ... continue rapidly
```

## Cross-Contest Testing

### Compare User Performance Across Contests

```http
# User 1's performance in different contests
GET /api/contests/1/stats/users/1/stats  # Should show lower completion %
GET /api/contests/2/stats/users/1/stats  # Should show higher completion %

# User 3's contrasting performance
GET /api/contests/1/stats/users/3/stats  # Lower performance
GET /api/contests/2/stats/users/3/stats  # Perfect performance
```

## Data Integrity Checks

### 1. Completion Status Mapping

- `assigned` → `not_started`
- `in_progress` → `in_progress`  
- `submitted` → `completed`
- `reviewed` → `completed`
- `closed` → `completed`

### 2. Points Calculation

- Only count points from completed tasks (`submitted`, `reviewed`, `closed`)
- Verify total points match sum of individual task points
- Check average score calculation excludes null scores

### 3. Percentage Calculations

```
Completion % = (Completed Tasks / Total Assigned Tasks) × 100
Task Completion % = (Users Completed / Users Assigned) × 100
```

## Workflow Testing

### Complete User Journey

1. **Check contest status** → Overall stats
2. **Review task difficulty** → Task completion stats  
3. **Check personal progress** → My tasks & stats
4. **Compare performance** → Leaderboard
5. **Monitor specific users** → User-specific stats

### Administrative Monitoring

1. **Contest health check** → Overall stats + task stats
2. **Identify struggling users** → Leaderboard (bottom performers)
3. **Task difficulty analysis** → Task completion rates
4. **Individual user support** → User detailed stats

## Expected Database Queries

The endpoints should generate efficient queries with:
- ✅ Proper JOINs between tables
- ✅ Appropriate GROUP BY clauses
- ✅ CASE statements for status mapping
- ✅ COUNT and SUM aggregations
- ✅ Percentage calculations in SQL
- ✅ Proper pagination with LIMIT/OFFSET

## Common Issues to Watch For

1. **Division by Zero**: When no tasks are assigned
2. **NULL Handling**: Scores that are NULL should not affect averages
3. **Status Mapping**: Ensure all status values are handled
4. **Cross-Contest Data**: User stats should be contest-specific
5. **Timezone Issues**: Dates should be consistent
6. **Performance**: Queries should use appropriate indexes

## Success Criteria

✅ **Functional**: All endpoints return correct data
✅ **Performance**: Queries execute within reasonable time
✅ **Error Handling**: Proper error messages and status codes  
✅ **Security**: Authentication required for all endpoints
✅ **Validation**: Input parameters properly validated
✅ **Consistency**: Data matches across different endpoint views