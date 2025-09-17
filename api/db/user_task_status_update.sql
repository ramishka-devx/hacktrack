-- Update user_task status enum to only allow: pending, on_going, completed
ALTER TABLE `user_task`
MODIFY COLUMN `status` enum('pending','on_going','completed') DEFAULT 'pending';