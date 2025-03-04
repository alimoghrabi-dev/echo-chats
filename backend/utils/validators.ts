import { ValidationChain, body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const randomName = () => crypto.randomBytes(32).toString("hex");

const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export const RegisterValidator = [
  body("firstName").isString().notEmpty().withMessage("first name is required"),
  body("lastName").isString().notEmpty().withMessage("last name is required"),
  body("username").isString().notEmpty().withMessage("username is required"),
  body("email")
    .isString()
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid Email"),
  body("password")
    .isString()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .isString()
    .notEmpty()
    .withMessage("Confirm Password is required"),
];

export const LoginValidator = [
  body("identifier")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Please enter a username or email"),
  body("password").isString().notEmpty().withMessage("Please enter a password"),
];

export const EditUserCredentialsValidator = [
  body("profilePicture")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        if (typeof value !== "string") {
          throw new Error("Invalid profile picture format.");
        }
        return true;
      }
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and GIF are allowed."
        );
      }
      if (req.file.size > 6 * 1024 * 1024) {
        throw new Error("File size must be less than 6MB.");
      }
      return true;
    }),
  body("firstName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("First name is required."),
  body("lastName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Username is required."),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Description cannot exceed 150 characters."),
];
