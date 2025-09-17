import Joi from 'joi';

export const assignContestTasksSchema = Joi.object({
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

export const getUserContestTasksSchema = Joi.object({
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

export const getUserTasksSchema = Joi.object({
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

export const getUserTaskSchema = Joi.object({
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

export const updateTaskStatusSchema = Joi.object({
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
    status: Joi.string()
      .valid('pending', 'on_going', 'completed')
      .required()
      .messages({
        'string.base': 'Status must be a text value.',
        'any.only': 'Status must be one of: assigned, in_progress, submitted, reviewed, closed.',
        'any.required': 'Status is required.'
      }),
    score: Joi.number()
      .min(0)
      .max(999999.99)
      .optional()
      .messages({
        'number.base': 'Score must be a number.',
        'number.min': 'Score must be non-negative.',
        'number.max': 'Score cannot exceed 999999.99.'
      }),
    submitted_at: Joi.date()
      .iso()
      .optional()
      .messages({
        'date.base': 'Submitted at must be a valid date.',
        'date.format': 'Submitted at must be in ISO format.'
      })
  })
});

export const assignSingleTaskSchema = Joi.object({
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
    status: Joi.string()
      .valid('assigned', 'in_progress', 'submitted', 'reviewed', 'closed')
      .default('assigned')
      .messages({
        'string.base': 'Status must be a text value.',
        'any.only': 'Status must be one of: assigned, in_progress, submitted, reviewed, closed.'
      })
  })
});

export const removeUserTaskSchema = Joi.object({
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

export const checkTaskAccessSchema = Joi.object({
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

export const submitAnswerSchema = Joi.object({
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
    answer: Joi.string()
      .min(1)
      .max(500)
      .required()
      .messages({
        'string.base': 'Answer must be a text value.',
        'string.min': 'Answer cannot be empty.',
        'string.max': 'Answer cannot exceed 500 characters.',
        'any.required': 'Answer is required.'
      })
  })
});

export const getUserAnswerSchema = Joi.object({
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