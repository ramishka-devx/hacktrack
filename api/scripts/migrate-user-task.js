import { query } from '../src/config/db.config.js';

async function runMigration() {
  try {
    console.log('Running user_task table migration...');
    
    // Step 1: Fix status enum
    console.log('1. Updating status enum...');
    await query(`
      ALTER TABLE user_task 
      MODIFY COLUMN status enum('assigned','in_progress','submitted','reviewed','closed') DEFAULT 'assigned'
    `);
    console.log('✓ Status enum updated');
    
    // Step 2: Add user_answer column
    console.log('2. Adding user_answer column...');
    try {
      await query(`
        ALTER TABLE user_task 
        ADD COLUMN user_answer varchar(500) DEFAULT NULL AFTER score
      `);
      console.log('✓ user_answer column added');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ user_answer column already exists');
      } else {
        throw error;
      }
    }
    
    // Step 3: Ensure required_answer column exists in task table
    console.log('3. Checking required_answer column in task table...');
    try {
      await query(`
        ALTER TABLE task 
        ADD COLUMN required_answer varchar(500) DEFAULT NULL AFTER rule_type
      `);
      console.log('✓ required_answer column added to task table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ required_answer column already exists in task table');
      } else {
        throw error;
      }
    }
    
    // Step 4: Add indexes
    console.log('4. Adding indexes...');
    try {
      await query(`ALTER TABLE user_task ADD INDEX idx_user_task_status (status)`);
      console.log('✓ Status index added');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✓ Status index already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await query(`ALTER TABLE task ADD INDEX idx_task_required_answer (required_answer)`);
      console.log('✓ Required answer index added');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('✓ Required answer index already exists');
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('You can now test the answer submission APIs.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Please check your database connection and try again.');
  }
  
  process.exit(0);
}

runMigration();