-- Schema updates for user_task table to support answer submissions

-- First, fix the status enum and add user_answer field
ALTER TABLE `user_task` 
MODIFY COLUMN `status` enum('assigned','in_progress','submitted','reviewed','closed') DEFAULT 'assigned',
ADD COLUMN `user_answer` varchar(500) DEFAULT NULL AFTER `score`;

-- Also ensure task table has required_answer field (if not already present)
-- This might already exist based on schema, but adding it conditionally
ALTER TABLE `task` 
ADD COLUMN IF NOT EXISTS `required_answer` varchar(500) DEFAULT NULL AFTER `rule_type`;

-- Add index for better performance on answer lookups
ALTER TABLE `user_task` 
ADD INDEX `idx_user_task_status` (`status`);

-- Add index for task answer lookups
ALTER TABLE `task` 
ADD INDEX `idx_task_required_answer` (`required_answer`);