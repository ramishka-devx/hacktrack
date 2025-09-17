import Joi from 'joi';

export const createContestSchema = Joi.object({
  body: Joi.object({
    title: Joi.string()
      .max(150)
      .required()
      .messages({
        'string.base': 'Title must be a text value.',
        'string.max': 'Title cannot exceed 150 characters.',
        'any.required': 'Title is required.'
      }),
    starts_at: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Start date must be a valid date.',
        'date.format': 'Start date must be in ISO format (YYYY-MM-DDTHH:mm:ss).'
      }),
    ends_at: Joi.date()
      .iso()
      .optional()
      .greater(Joi.ref('starts_at'))
      .messages({
        'date.base': 'End date must be a valid date.',
        'date.format': 'End date must be in ISO format (YYYY-MM-DDTHH:mm:ss).',
        'date.greater': 'End date must be after start date.'
      }),
    is_public: Joi.boolean()
      .optional()
      .default(true)
      .messages({
        'boolean.base': 'is_public must be a boolean value.'
      })
  })
});

export const updateContestSchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be positive.',
        'any.required': 'Contest ID is required.'
      })
  }),
  body: Joi.object({
    title: Joi.string()
      .max(150)
      .optional()
      .messages({
        'string.base': 'Title must be a text value.',
        'string.max': 'Title cannot exceed 150 characters.'
      }),
    starts_at: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Start date must be a valid date.',
        'date.format': 'Start date must be in ISO format (YYYY-MM-DDTHH:mm:ss).'
      }),
    ends_at: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'End date must be a valid date.',
        'date.format': 'End date must be in ISO format (YYYY-MM-DDTHH:mm:ss).'
      }),
    is_public: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'is_public must be a boolean value.'
      })
  }).min(1).messages({
    'object.min': 'At least one field is required for update.'
  })
});

export const contestIdSchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be positive.',
        'any.required': 'Contest ID is required.'
      })
  })
});

export const contestSlugSchema = Joi.object({
  params: Joi.object({
    slug: Joi.string()
      .max(200)
      .required()
      .messages({
        'string.base': 'Slug must be a text value.',
        'string.max': 'Slug cannot exceed 200 characters.',
        'any.required': 'Slug is required.'
      })
  })
});

export const listContestsSchema = Joi.object({
  query: Joi.object({
    page: Joi.number()
      .integer()
      .positive()
      .optional()
      .default(1)
      .messages({
        'number.base': 'Page must be a number.',
        'number.integer': 'Page must be an integer.',
        'number.positive': 'Page must be positive.'
      }),
    limit: Joi.number()
      .integer()
      .positive()
      .max(100)
      .optional()
      .default(10)
      .messages({
        'number.base': 'Limit must be a number.',
        'number.integer': 'Limit must be an integer.',
        'number.positive': 'Limit must be positive.',
        'number.max': 'Limit cannot exceed 100.'
      }),
    is_public: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'is_public must be a boolean value.'
      }),
    created_by: Joi.number()
      .integer()
      .positive()
      .optional()
      .messages({
        'number.base': 'Created by must be a number.',
        'number.integer': 'Created by must be an integer.',
        'number.positive': 'Created by must be positive.'
      })
  })
});

export const joinContestSchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be positive.',
        'any.required': 'Contest ID is required.'
      })
  }),
  body: Joi.object({
    role_in_contest: Joi.string()
      .valid('participant', 'mentor', 'organizer')
      .optional()
      .default('participant')
      .messages({
        'string.base': 'Role must be a text value.',
        'any.only': 'Role must be one of: participant, mentor, organizer.'
      })
  })
});

export const updateParticipantRoleSchema = Joi.object({
  params: Joi.object({
    contest_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be positive.',
        'any.required': 'Contest ID is required.'
      }),
    user_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'User ID must be a number.',
        'number.integer': 'User ID must be an integer.',
        'number.positive': 'User ID must be positive.',
        'any.required': 'User ID is required.'
      })
  }),
  body: Joi.object({
    role_in_contest: Joi.string()
      .valid('participant', 'mentor', 'organizer')
      .required()
      .messages({
        'string.base': 'Role must be a text value.',
        'any.only': 'Role must be one of: participant, mentor, organizer.',
        'any.required': 'Role is required.'
      })
  })
});