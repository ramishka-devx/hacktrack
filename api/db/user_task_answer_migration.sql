-- Schema updates for user_task table to support answer submissions
-- Run these one by one and ignore errors if columns already exist

-- Step 1: Fix the status enum and add user_answer field
ALTER TABLE `user_task` 
MODIFY COLUMN `status` enum('assigned','in_progress','submitted','reviewed','closed') DEFAULT 'assigned';

-- Step 2: Add user_answer column (ignore error if already exists)
ALTER TABLE `user_task` 
ADD COLUMN `user_answer` varchar(500) DEFAULT NULL AFTER `score`;

-- Step 3: Ensure task table has required_answer field (ignore error if already exists)
ALTER TABLE `task` 
ADD COLUMN `required_answer` varchar(500) DEFAULT NULL AFTER `rule_type`;

-- Step 4: Add indexes for better performance
ALTER TABLE `user_task` 
ADD INDEX `idx_user_task_status` (`status`);

ALTER TABLE `task` 
ADD INDEX `idx_task_required_answer` (`required_answer`);