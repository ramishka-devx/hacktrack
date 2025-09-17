import Joi from 'joi';

export const contestStatsParamsSchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be a positive number.',
        'any.required': 'Contest ID is required.'
      })
  })
});

export const userStatsParamsSchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be a positive number.',
        'any.required': 'Contest ID is required.'
      }),
    user_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'User ID must be a number.',
        'number.integer': 'User ID must be an integer.',
        'number.positive': 'User ID must be a positive number.',
        'any.required': 'User ID is required.'
      })
  })
});

export const leaderboardQuerySchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be a positive number.',
        'any.required': 'Contest ID is required.'
      })
  }),
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'Page must be a number.',
        'number.integer': 'Page must be an integer.',
        'number.min': 'Page must be at least 1.'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'Limit must be a number.',
        'number.integer': 'Limit must be an integer.',
        'number.min': 'Limit must be at least 1.',
        'number.max': 'Limit cannot exceed 100.'
      })
  })
});