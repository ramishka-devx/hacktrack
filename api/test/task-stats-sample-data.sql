-- Sample data for testing Task Statistics module
-- This script creates realistic test data for task completion tracking

-- First, ensure you have contests and users
-- This assumes you have contests with IDs 1 and 2, and users with IDs 1-5

-- Sample user_task data with various completion statuses
INSERT INTO user_task (user_id, task_id, status, score, submitted_at, created_at) VALUES

-- Contest 1 Tasks - Mixed completion states
-- User 1 - High performer (4/5 tasks completed)
(1, 1, 'closed', 9.5, '2025-09-15 14:30:00', '2025-09-15 10:00:00'),
(1, 2, 'reviewed', 8.7, '2025-09-16 16:20:00', '2025-09-15 10:00:00'),
(1, 3, 'submitted', 9.0, '2025-09-17 11:45:00', '2025-09-15 10:00:00'),
(1, 4, 'in_progress', NULL, NULL, '2025-09-15 10:00:00'),
(1, 5, 'assigned', NULL, NULL, '2025-09-15 10:00:00'),

-- User 2 - Medium performer (3/4 tasks completed)
(2, 1, 'closed', 8.2, '2025-09-15 18:15:00', '2025-09-15 11:00:00'),
(2, 2, 'reviewed', 7.8, '2025-09-16 20:30:00', '2025-09-15 11:00:00'),
(2, 3, 'submitted', 8.5, '2025-09-17 13:20:00', '2025-09-15 11:00:00'),
(2, 4, 'in_progress', NULL, NULL, '2025-09-15 11:00:00'),

-- User 3 - Lower performer (2/4 tasks completed)
(3, 1, 'closed', 7.5, '2025-09-16 09:45:00', '2025-09-15 12:00:00'),
(3, 2, 'submitted', 6.9, '2025-09-17 15:10:00', '2025-09-15 12:00:00'),
(3, 3, 'in_progress', NULL, NULL, '2025-09-15 12:00:00'),
(3, 5, 'assigned', NULL, NULL, '2025-09-15 12:00:00'),

-- User 4 - New participant (1/3 tasks completed)
(4, 1, 'reviewed', 8.0, '2025-09-16 22:00:00', '2025-09-16 08:00:00'),
(4, 2, 'in_progress', NULL, NULL, '2025-09-16 08:00:00'),
(4, 3, 'assigned', NULL, NULL, '2025-09-16 08:00:00'),

-- User 5 - Struggling participant (0/2 tasks completed)
(5, 1, 'in_progress', NULL, NULL, '2025-09-16 14:00:00'),
(5, 2, 'assigned', NULL, NULL, '2025-09-16 14:00:00'),

-- Contest 2 Tasks - Different participation pattern
-- User 1 - Participating in multiple contests (2/3 completed)
(1, 6, 'closed', 9.2, '2025-09-16 10:30:00', '2025-09-15 15:00:00'),
(1, 7, 'reviewed', 8.8, '2025-09-17 09:15:00', '2025-09-15 15:00:00'),
(1, 8, 'in_progress', NULL, NULL, '2025-09-15 15:00:00'),

-- User 2 - Also in contest 2 (1/2 completed)
(2, 6, 'submitted', 7.9, '2025-09-17 12:00:00', '2025-09-16 09:00:00'),
(2, 7, 'assigned', NULL, NULL, '2025-09-16 09:00:00'),

-- User 3 - Different performance in contest 2 (3/3 completed)
(3, 6, 'closed', 8.5, '2025-09-16 14:20:00', '2025-09-15 16:00:00'),
(3, 7, 'closed', 9.1, '2025-09-17 08:45:00', '2025-09-15 16:00:00'),
(3, 8, 'reviewed', 8.3, '2025-09-17 16:30:00', '2025-09-15 16:00:00'),

-- Additional test scenarios

-- Late joiner scenario
(4, 6, 'in_progress', NULL, NULL, '2025-09-17 10:00:00'),

-- Quick completer scenario  
(5, 6, 'closed', 9.8, '2025-09-16 12:00:00', '2025-09-16 11:00:00');

-- Additional sample data for more comprehensive testing
-- Create some tasks that haven't been assigned to anyone (to test 0% completion)

-- Update some existing task assignments to show variety in scores
UPDATE user_task SET score = 10.0 WHERE user_id = 1 AND task_id = 1;
UPDATE user_task SET score = 6.5 WHERE user_id = 2 AND task_id = 1;
UPDATE user_task SET score = 9.3 WHERE user_id = 1 AND task_id = 2;
UPDATE user_task SET score = 7.2 WHERE user_id = 3 AND task_id = 1;

-- Create some additional user_task entries for stress testing pagination
INSERT INTO user_task (user_id, task_id, status, score, submitted_at, created_at) VALUES
-- More participants for contest 1
(6, 1, 'closed', 8.8, '2025-09-15 20:00:00', '2025-09-15 13:00:00'),
(6, 2, 'in_progress', NULL, NULL, '2025-09-15 13:00:00'),
(7, 1, 'reviewed', 7.6, '2025-09-16 11:30:00', '2025-09-15 14:00:00'),
(7, 3, 'assigned', NULL, NULL, '2025-09-15 14:00:00'),
(8, 1, 'submitted', 8.9, '2025-09-17 10:15:00', '2025-09-16 16:00:00'),
(8, 2, 'assigned', NULL, NULL, '2025-09-16 16:00:00'),

-- More participants for contest 2
(6, 6, 'reviewed', 8.4, '2025-09-17 14:00:00', '2025-09-16 12:00:00'),
(7, 6, 'closed', 9.0, '2025-09-16 18:30:00', '2025-09-16 10:00:00'),
(7, 7, 'in_progress', NULL, NULL, '2025-09-16 10:00:00'),
(8, 6, 'assigned', NULL, NULL, '2025-09-17 08:00:00');

-- Some additional users might need to be created first
-- If users 6, 7, 8 don't exist, uncomment and modify these:
-- INSERT INTO users (first_name, last_name, email, password_hash, created_at, updated_at) VALUES
-- ('Alice', 'Johnson', 'alice.johnson@example.com', '$2b$10$hashedpassword1', NOW(), NOW()),
-- ('Bob', 'Wilson', 'bob.wilson@example.com', '$2b$10$hashedpassword2', NOW(), NOW()),
-- ('Carol', 'Brown', 'carol.brown@example.com', '$2b$10$hashedpassword3', NOW(), NOW());