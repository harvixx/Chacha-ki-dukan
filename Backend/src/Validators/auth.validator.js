import { body } from "express-validator";


// 🔐 Register Validator
export const registerValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3, max: 30 }).withMessage("Name must be 3-30 characters")
    .trim(),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("avatar")
    .optional()
    .isURL().withMessage("Avatar must be a valid URL"),
];


// 🔑 Login Validator
export const loginValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];


// 🔄 Refresh Token Validator
export const refreshTokenValidator = [
  body("refreshToken")
    .notEmpty().withMessage("Refresh token is required"),
];