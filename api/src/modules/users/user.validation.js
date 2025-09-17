import Joi from 'joi';

export const registerSchema = Joi.object({
  body: Joi.object({
    first_name: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.base': 'First name must be a text value.',
        'string.max': 'First name cannot exceed 50 characters.',
        'any.required': 'First name is required.'
      }),
    last_name: Joi.string()
      .max(50)
      .required()
      .messages({
        'string.base': 'Last name must be a text value.',
        'string.max': 'Last name cannot exceed 50 characters.',
        'any.required': 'Last name is required.'
      }),
    email: Joi.string()
      .email()
      .max(100)
      .required()
      .messages({
        'string.base': 'Email must be a text value.',
        'string.email': 'Please provide a valid email address.',
        'string.max': 'Email cannot exceed 100 characters.',
        'any.required': 'Email is required.'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.base': 'Password must be a text value.',
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password cannot exceed 128 characters.',
        'any.required': 'Password is required.'
      }),
  })
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.base': 'Email must be a text value.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email is required.'
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.base': 'Password must be a text value.',
        'any.required': 'Password is required.'
      })
  })
});

export const updateSchema = Joi.object({
  params: Joi.object({
    user_id: Joi.number()
      .integer()
      .required()
      .messages({
        'number.base': 'User ID must be a number.',
        'number.integer': 'User ID must be an integer.',
        'any.required': 'User ID is required.'
      })
  }),
  body: Joi.object({
    first_name: Joi.string()
      .max(50)
      .messages({
        'string.base': 'First name must be a text value.',
        'string.max': 'First name cannot exceed 50 characters.'
      }),
    last_name: Joi.string()
      .max(50)
      .messages({
        'string.base': 'Last name must be a text value.',
        'string.max': 'Last name cannot exceed 50 characters.'
      }),
    role_id: Joi.number()
      .integer()
      .messages({
        'number.base': 'Role ID must be a number.',
        'number.integer': 'Role ID must be an integer.'
      })
  })
});

export const searchUsersSchema = Joi.object({
  query: Joi.object({
    q: Joi.string()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.base': 'Search query must be a text value.',
        'string.min': 'Search query must be at least 1 character long.',
        'string.max': 'Search query cannot exceed 100 characters.',
        'any.required': 'Search query is required.'
      }),
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
      .max(50)
      .optional()
      .default(10)
      .messages({
        'number.base': 'Limit must be a number.',
        'number.integer': 'Limit must be an integer.',
        'number.positive': 'Limit must be positive.',
        'number.max': 'Limit cannot exceed 50.'
      })
  })
});
