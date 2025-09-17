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
  updateParticipantRoleSchema,
  myContestsSchema,
  addMemberSchema,
  removeMemberSchema
} from './contest.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { optionalAuthMiddleware } from '../../middleware/optionalAuthMiddleware.js';

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

// Public routes with optional authentication (for private contest access)
router.get('/', validate(listContestsSchema), ContestController.list);
router.get('/public', validate(listContestsSchema), ContestController.getPublicContests);
router.get('/slug/:slug', optionalAuthMiddleware, validate(contestSlugSchema), ContestController.getBySlug);

// Protected /my routes (require authentication) - must be before /:contest_id
router.get('/my/contests', authMiddleware, validate(myContestsSchema), ContestController.myContests);
router.get('/my', authMiddleware, validate(myContestsSchema), ContestController.myAllContests);

// Contest by ID and participants (with optional auth for private contest access)
router.get('/:contest_id', optionalAuthMiddleware, validate(contestIdSchema), ContestController.getById);
router.get('/:contest_id/participants', optionalAuthMiddleware, validate(contestIdSchema), ContestController.getParticipants);

// Protected routes (require authentication)
router.use(authMiddleware);

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

// Add member to contest (organizer/creator only)
router.post('/:contest_id/members', 
  validate(addMemberSchema), 
  ContestController.addMember
);

// Remove member from contest (organizer/creator only)
router.delete('/:contest_id/members/:user_id', 
  validate(removeMemberSchema), 
  ContestController.removeMember
);

// Manage participants (organizer/creator only)
router.put('/:contest_id/participants/:user_id/role', 
  validate(updateParticipantRoleSchema), 
  ContestController.updateParticipantRole
);

export default router;