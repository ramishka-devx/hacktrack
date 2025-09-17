-- Seed roles
INSERT INTO roles (role_id, name) VALUES (1, 'admin') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO roles (role_id, name) VALUES (2, 'user') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed permissions
SET @perms = 'user.list,user.update,user.delete,permission.add,permission.list,permission.delete,permission.assign,permission.revoke,divisionType.add,divisionType.list,divisionType.update,divisionType.delete,division.add,division.list,division.update,division.delete,machine.add,machine.list,machine.update,machine.delete,meter.add,meter.list,meter.update,meter.delete,parameter.add,parameter.list,parameter.update,parameter.delete';

-- Insert permissions if not exists
DROP TEMPORARY TABLE IF EXISTS tmp_perms;
CREATE TEMPORARY TABLE tmp_perms (name VARCHAR(100) UNIQUE);
SET @sql = CONCAT('INSERT IGNORE INTO permissions (name) VALUES ', REPLACE(@perms, ',', "'), ('"), "('");
SET @sql = REPLACE(@sql, "VALUES ", "VALUES ('");
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Grant all permissions to admin (role_id = 1)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT 1, permission_id FROM permissions;
