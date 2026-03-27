import Joi from 'joi';

// Registration validation
export const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      // .pattern(/@adypu\.edu\.in$/)
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        // 'string.pattern.base': 'Email must be from ADYPU college domain (@adypu.edu.in)',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    name: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'string.pattern.base': 'Name can only contain letters and spaces',
        'any.required': 'Name is required'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    return {
      valid: false,
      errors: error.details.map(detail => detail.message)
    };
  }

  return { valid: true, data: value };
};

// Login validation
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    return {
      valid: false,
      errors: error.details.map(detail => detail.message)
    };
  }

  return { valid: true, data: value };
};