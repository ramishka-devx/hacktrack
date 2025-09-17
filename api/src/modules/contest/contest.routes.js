import { Router } from 'express';
import multer from 'multer';
import { ContestController } from './contest.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import {
  createContestSchema,
  updateContestSchema,
  contestIdSchema,
  contestSlugSchema,
  listContestsSchema,
  joinContestSchema,
  updateParticipantRoleSchema
} from './contest.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public routes
router.get('/', validate(listContestsSchema), ContestController.list);
router.get('/slug/:slug', validate(contestSlugSchema), ContestController.getBySlug);

// Protected routes (require authentication)
router.use(authMiddleware);

// User's contests (must be before /:contest_id to avoid conflict)
router.get('/my/contests', ContestController.myContests);

// Contest by ID and participants
router.get('/:contest_id', validate(contestIdSchema), ContestController.getById);
router.get('/:contest_id/participants', validate(contestIdSchema), ContestController.getParticipants);

// Contest CRUD operations
router.post('/', 
  upload.single('profile_img'), 
  validate(createContestSchema), 
  ContestController.create
);

router.put('/:contest_id', 
  upload.single('profile_img'), 
  validate(updateContestSchema), 
  ContestController.update
);

router.delete('/:contest_id', 
  validate(contestIdSchema), 
  ContestController.remove
);

// Contest participation
router.post('/:contest_id/join', 
  validate(joinContestSchema), 
  ContestController.joinContest
);

router.delete('/:contest_id/leave', 
  validate(contestIdSchema), 
  ContestController.leaveContest
);

// Manage participants (organizer/creator only)
router.put('/:contest_id/participants/:user_id/role', 
  validate(updateParticipantRoleSchema), 
  ContestController.updateParticipantRole
);

export default router;