import { ContestModel } from './contest.model.js';
import { badRequest, notFound, forbidden } from '../../utils/errorHandler.js';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../../config/env.js';
import { query } from '../../config/db.config.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinary?.cloudName,
  api_key: env.cloudinary?.apiKey,
  api_secret: env.cloudinary?.apiSecret,
});

export const ContestService = {
  async create({ title, starts_at, ends_at, is_public = 1, created_by }, profileImageFile = null) {
    // Generate unique slug from title
    const slug = await ContestModel.generateUniqueSlug(title);
    
    let profile_img = null;
    
    // Upload profile image to Cloudinary if provided
    if (profileImageFile) {
      // Check if Cloudinary is configured
      if (!env.cloudinary?.cloudName || !env.cloudinary?.apiKey || !env.cloudinary?.apiSecret) {
        console.warn('Cloudinary not configured, skipping image upload');
      } else {
        try {
          let uploadSource;
          if (profileImageFile.buffer) {
            // For memory storage (multer)
            uploadSource = `data:${profileImageFile.mimetype};base64,${profileImageFile.buffer.toString('base64')}`;
          } else if (profileImageFile.path) {
            // For disk storage
            uploadSource = profileImageFile.path;
          } else {
            throw new Error('Invalid file format');
          }

          const result = await cloudinary.uploader.upload(uploadSource, {
            folder: 'contests/profile-images',
            public_id: `contest-${slug}-${Date.now()}`,
            transformation: [
              { width: 500, height: 500, crop: 'fill', quality: 'auto' }
            ]
          });
          profile_img = result.secure_url;
        } catch (error) {
          console.error('Cloudinary upload error:', error);
          throw badRequest('Failed to upload profile image: ' + error.message);
        }
      }
    }

    const contest = await ContestModel.create({
      title,
      slug,
      profile_img,
      created_by,
      starts_at,
      ends_at,
      is_public
    });

    return contest;
  },

  async getById(contest_id) {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');
    return contest;
  },

  async getBySlug(slug) {
    const contest = await ContestModel.findBySlug(slug);
    if (!contest) throw notFound('Contest not found');
    return contest;
  },

  async list(params) {
    return ContestModel.list(params);
  },

  async update(contest_id, payload, profileImageFile = null, user_id) {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');

    // Check if user has permission to update (creator or organizer)
    const participant = await ContestModel.checkParticipant(contest_id, user_id);
    const isCreator = contest.created_by === user_id;
    const isOrganizer = participant && participant.role_in_contest === 'organizer';
    
    if (!isCreator && !isOrganizer) {
      throw forbidden('You do not have permission to update this contest');
    }

    // Handle profile image update
    if (profileImageFile) {
      try {
        // Delete old image if exists
        if (contest.profile_img) {
          const publicId = contest.profile_img.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`contests/profile-images/${publicId}`);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(profileImageFile.path || profileImageFile.buffer, {
          folder: 'contests/profile-images',
          public_id: `contest-${contest.slug}-${Date.now()}`,
          transformation: [
            { width: 500, height: 500, crop: 'fill', quality: 'auto' }
          ]
        });
        payload.profile_img = result.secure_url;
      } catch (error) {
        throw badRequest('Failed to upload profile image');
      }
    }

    // Generate new slug if title is being updated
    if (payload.title && payload.title !== contest.title) {
      payload.slug = await ContestModel.generateUniqueSlug(payload.title);
    }

    return ContestModel.update(contest_id, payload);
  },

  async remove(contest_id, user_id) {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');

    // Only creator can delete contest
    if (contest.created_by !== user_id) {
      throw forbidden('Only the contest creator can delete this contest');
    }

    // Delete profile image from Cloudinary if exists
    if (contest.profile_img) {
      try {
        const publicId = contest.profile_img.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`contests/profile-images/${publicId}`);
      } catch (error) {
        // Log error but don't fail the deletion
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    await ContestModel.remove(contest_id);
  },

  async getParticipants(contest_id) {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');
    return ContestModel.getParticipants(contest_id);
  },

  async joinContest(contest_id, user_id, role_in_contest = 'participant') {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');

    // Check if contest is public or user has permission
    if (!contest.is_public && role_in_contest === 'participant') {
      throw forbidden('This contest is private');
    }

    // Check if user is already a participant
    const existing = await ContestModel.checkParticipant(contest_id, user_id);
    if (existing) {
      throw badRequest('User is already a participant in this contest');
    }

    // Add participant
    await ContestModel.addParticipant(contest_id, user_id, role_in_contest);
    return { message: 'Successfully joined the contest' };
  },

  async leaveContest(contest_id, user_id) {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');

    // Check if user is a participant
    const participant = await ContestModel.checkParticipant(contest_id, user_id);
    if (!participant) {
      throw badRequest('User is not a participant in this contest');
    }

    // Contest creator cannot leave their own contest
    if (contest.created_by === user_id) {
      throw forbidden('Contest creator cannot leave their own contest');
    }

    await ContestModel.removeParticipant(contest_id, user_id);
    return { message: 'Successfully left the contest' };
  },

  async updateParticipantRole(contest_id, target_user_id, new_role, requesting_user_id) {
    const contest = await ContestModel.findById(contest_id);
    if (!contest) throw notFound('Contest not found');

    // Check if requesting user has permission (creator or organizer)
    const requestingParticipant = await ContestModel.checkParticipant(contest_id, requesting_user_id);
    const isCreator = contest.created_by === requesting_user_id;
    const isOrganizer = requestingParticipant && requestingParticipant.role_in_contest === 'organizer';
    
    if (!isCreator && !isOrganizer) {
      throw forbidden('You do not have permission to update participant roles');
    }

    // Check if target user is a participant
    const targetParticipant = await ContestModel.checkParticipant(contest_id, target_user_id);
    if (!targetParticipant) {
      throw badRequest('Target user is not a participant in this contest');
    }

    // Update role
    await query('UPDATE user_contest SET role_in_contest = ? WHERE contest_id = ? AND user_id = ?', 
                [new_role, contest_id, target_user_id]);
    return { message: 'Participant role updated successfully' };
  }
};