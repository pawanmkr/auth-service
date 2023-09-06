import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export class InputValidation {
  static validateSchema(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  }

  static userRegistrationSchema = Joi.object({
    user_type: Joi.string().valid('teacher', 'student', 'admin').required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().min(4).pattern(/^[a-z0-9.?_?]+$/).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
  });

  static userLoginSchema = Joi.object({
    username: Joi.string().min(4).pattern(/^[a-z0-9.?_?]+$/).trim().optional(),
    email: Joi.string().email().trim().optional(),
    password: Joi.string().min(6).required()
  });

  static emailSchema = Joi.object({
    email: Joi.string().email().trim().required(),
  });

  static passwordConfirmSchema = Joi.object({
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().min(6).required(),
    reset_token: Joi.string().required()
  });

  static validateUserRegistration = InputValidation.validateSchema(InputValidation.userRegistrationSchema);
  static validateUserLogin = InputValidation.validateSchema(InputValidation.userLoginSchema);
  static validateEmail = InputValidation.validateSchema(InputValidation.emailSchema);
  static validatePassword = InputValidation.validateSchema(InputValidation.passwordConfirmSchema);
}

























/* import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// roles available on the platform for users
const userRoles = ['teacher', 'student', 'admin']

// function to find input validation errors
export async function validateRoute(req: Request, res: Response, next: NextFunction): Promise<Response> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send(errors.array());
    return;
  }
  next();
}

// input validation chain for user registration route
export const userRegistrationValidationChain = [
  body('user_type').custom((value) => {
    if (!userRoles.includes(value)) {
      throw new Error("Invalid Role")
    }
    return true;
  }),
  
  body('first_name')
    .notEmpty()
    .isString()
    .withMessage("First Name is required"),
  
  body('last_name')
    .notEmpty()
    .isString()
    .withMessage("Last Name is required"),
  
  body('username')
    .isLength({ min: 4 })
    .withMessage("Username should be at least 4 characters long")
    .matches(/^[a-z0-9.?_?]+$/)
    .withMessage("Username should only contain lowercase letters, numbers, . and _")
    .trim()
    .escape(),
    
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .escape(),
  
  body('password')
    .isStrongPassword()
    .withMessage("Password should be strong, containing lowercase, uppercase, numbers, and special characters"),
]

// input validation chain on user login route
export const userLoginValidationChain = [
  body('username')
  .optional()
    .isLength({ min: 4 })
    .withMessage('Username should be at least 4 characters long')
    .matches(/^[a-z0-9.?_?]+$/)
    .withMessage('Username should only contain lowercase letters, numbers, . and _')
    .trim()
    .escape(),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .escape(),
];

// email validation when accepting password reset request
export const emailValidation = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .trim()
    .escape(),
]

export const passwordValidation = [
  body('password')
    .isStrongPassword()
    .withMessage("Password should be strong, containing lowercase, uppercase, numbers, and special characters"),
] */