# Task Module Test Data

This document provides sample test data and scenarios for testing the Task API endpoints.

## Prerequisites

Before testing task endpoints, ensure you have:

1. **Created contests** (tasks belong to contests)
2. **Valid authentication token** from user login
3. **Database seeded** with test contests and users

## Sample Test Contests

First, create some test contests:

```json
// Contest 1 - Algorithm Challenge
{
  "title": "Algorithm Challenge 2025",
  "slug": "algorithm-challenge-2025",
  "starts_at": "2025-09-20T10:00:00Z",
  "ends_at": "2025-09-25T18:00:00Z",
  "is_public": true
}

// Contest 2 - Data Structures Marathon
{
  "title": "Data Structures Marathon",
  "slug": "data-structures-marathon",
  "starts_at": "2025-10-01T09:00:00Z",
  "ends_at": "2025-10-07T17:00:00Z",
  "is_public": true
}
```

## Sample Task Test Data

### Easy Level Tasks

```json
{
  "contest_id": 1,
  "title": "Two Sum Problem",
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  "points": 100,
  "difficulty": "easy"
}

{
  "contest_id": 1,
  "title": "Valid Palindrome",
  "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
  "points": 75,
  "difficulty": "easy"
}

{
  "contest_id": 2,
  "title": "Reverse Linked List",
  "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
  "points": 120,
  "difficulty": "easy"
}
```

### Medium Level Tasks

```json
{
  "contest_id": 1,
  "title": "Binary Tree Inorder Traversal",
  "description": "Given the root of a binary tree, return the inorder traversal of its nodes' values. Implement both recursive and iterative solutions.",
  "points": 200,
  "difficulty": "medium"
}

{
  "contest_id": 1,
  "title": "Maximum Subarray",
  "description": "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. Implement using Kadane's algorithm.",
  "points": 300,
  "difficulty": "medium"
}

{
  "contest_id": 2,
  "title": "Longest Substring Without Repeating Characters",
  "description": "Given a string s, find the length of the longest substring without repeating characters.",
  "points": 250,
  "difficulty": "medium"
}

{
  "contest_id": 2,
  "title": "3Sum",
  "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
  "points": 350,
  "difficulty": "medium"
}
```

### Hard Level Tasks

```json
{
  "contest_id": 1,
  "title": "N-Queens",
  "description": "The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle.",
  "points": 500,
  "difficulty": "hard"
}

{
  "contest_id": 2,
  "title": "Merge k Sorted Lists",
  "description": "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
  "points": 600,
  "difficulty": "hard"
}

{
  "contest_id": 2,
  "title": "Word Ladder",
  "description": "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter.",
  "points": 550,
  "difficulty": "hard"
}
```

## Test Scenarios

### 1. Positive Test Cases

#### Task Creation
- ✅ Create task with all required fields
- ✅ Create task with optional fields (points, difficulty)
- ✅ Create task with default values
- ✅ Create multiple tasks in same contest
- ✅ Create tasks in different contests

#### Task Retrieval
- ✅ Get task by valid ID
- ✅ Get all tasks for a contest
- ✅ Get all tasks with pagination
- ✅ Get all tasks filtered by contest
- ✅ List tasks with different page sizes

#### Task Updates
- ✅ Update task title
- ✅ Update task description
- ✅ Update task points
- ✅ Update task difficulty
- ✅ Update multiple fields at once
- ✅ Partial updates (single field)

#### Task Deletion
- ✅ Delete existing task by creator
- ✅ Verify task is removed from database

### 2. Negative Test Cases

#### Validation Errors
- ❌ Create task without required fields
- ❌ Create task with invalid contest_id
- ❌ Create task with invalid difficulty
- ❌ Create task with negative points
- ❌ Create task with title too long (>200 chars)
- ❌ Update task with empty body
- ❌ Update task with invalid difficulty

#### Not Found Errors
- ❌ Get non-existent task
- ❌ Get tasks for non-existent contest
- ❌ Update non-existent task
- ❌ Delete non-existent task

#### Permission Errors
- ❌ Update task created by another user
- ❌ Delete task created by another user
- ❌ Access tasks without authentication

#### Contest Validation
- ❌ Create task for non-existent contest
- ❌ Create task with contest_id = null
- ❌ Create task with invalid contest_id format

## Expected Response Examples

### Successful Task Creation (201)
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

### Task List with Pagination (200)
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

### Validation Error (400)
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

### Permission Error (403)
```json
{
  "success": false,
  "message": "You can only update tasks you created"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Task not found"
}
```

## Testing Tools

### 1. REST Client (VS Code Extension)
Use the provided `tasks.rest` file with the REST Client extension to test all endpoints interactively.

### 2. Postman Collection
Import the REST file into Postman or create a collection with the provided endpoints.

### 3. cURL Commands
```bash
# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "contest_id": 1,
    "title": "Two Sum Problem",
    "description": "Given an array of integers...",
    "points": 100,
    "difficulty": "easy"
  }'

# Get task by ID
curl -X GET http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update task
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Updated Two Sum Problem",
    "points": 150
  }'

# Delete task
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Performance Testing

Test with larger datasets:
- Create 100+ tasks in a single contest
- Test pagination with large datasets
- Test concurrent task creation
- Test bulk operations

## Authentication Setup

Before running tests, get an authentication token:

```http
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Use the returned token in the `Authorization: Bearer <token>` header for all task API requests.