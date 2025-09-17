import Joi from 'joi';

export const createTaskSchema = Joi.object({
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
  body: Joi.object({
    title: Joi.string()
      .max(200)
      .required()
      .messages({
        'string.base': 'Title must be a text value.',
        'string.max': 'Title cannot exceed 200 characters.',
        'any.required': 'Title is required.'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'Description must be a text value.'
      }),
    points: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Points must be a number.',
        'number.integer': 'Points must be an integer.',
        'number.min': 'Points must be non-negative.'
      }),
    difficulty: Joi.string()
      .valid('easy', 'medium', 'hard')
      .default('medium')
      .messages({
        'string.base': 'Difficulty must be a text value.',
        'any.only': 'Difficulty must be one of: easy, medium, hard.'
      })
  })
});

export const updateTaskSchema = Joi.object({
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
    task_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Task ID must be a number.',
        'number.integer': 'Task ID must be an integer.',
        'number.positive': 'Task ID must be a positive number.',
        'any.required': 'Task ID is required.'
      })
  }),
  body: Joi.object({
    title: Joi.string()
      .max(200)
      .messages({
        'string.base': 'Title must be a text value.',
        'string.max': 'Title cannot exceed 200 characters.'
      }),
    description: Joi.string()
      .allow(null, '')
      .messages({
        'string.base': 'Description must be a text value.'
      }),
    points: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'Points must be a number.',
        'number.integer': 'Points must be an integer.',
        'number.min': 'Points must be non-negative.'
      }),
    difficulty: Joi.string()
      .valid('easy', 'medium', 'hard')
      .messages({
        'string.base': 'Difficulty must be a text value.',
        'any.only': 'Difficulty must be one of: easy, medium, hard.'
      })
  }).min(1)
});

export const taskParamsSchema = Joi.object({
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
    task_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Task ID must be a number.',
        'number.integer': 'Task ID must be an integer.',
        'number.positive': 'Task ID must be a positive number.',
        'any.required': 'Task ID is required.'
      })
  })
});

export const contestTasksParamsSchema = Joi.object({
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

export const listTasksSchema = Joi.object({
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
      }),
    contest_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'Contest ID must be a number.',
        'number.integer': 'Contest ID must be an integer.',
        'number.positive': 'Contest ID must be a positive number.'
      })
  })
});