const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: User Signup
 *     tags: [Auth]
 *     description: >
 *       Allows users to create an account by providing a username, email, and password.
 *       The username must be at least 3 characters long.
 *       The email must be a valid email address and unique.
 *       The password must be at least 6 characters and match the password confirmation field.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: 'John Doe'
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: 'john@example.com'
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: 'password123'
 *               passwordConfirm:
 *                 type: string
 *                 description: Confirmation of the user's password.
 *                 example: 'password123'
 *     responses:
 *       201:
 *         description: Signup successful. Returns user data and a accessToken.
 *       400:
 *         description: Bad Request due to validation errors or other issues.
 */
router.post("/signup", signupValidator, signup);
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *         description: Invalid username/password supplied
 */
router.post("/login", loginValidator, login);
/**
 * @openapi
 * /forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       '200':
 *         description: Password reset link sent
 *       '400':
 *         description: Invalid email supplied
 *       '404':
 *         description: Email not found
 */
router.post("/forgotPassword", forgotPassword);
/**
 * @openapi
 * /verifyResetCode:
 *   post:
 *     summary: Verify the password reset code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Code verified successfully
 *       '400':
 *         description: Invalid email or code supplied
 *       '404':
 *         description: Email not found or code not valid
 */
router.post("/verifyResetCode", verifyPassResetCode);
/**
 * @openapi
 * /resetPassword:
 *   put:
 *     summary: Reset the password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         description: Invalid email, code, or password supplied
 *       '404':
 *         description: Email not found or code not valid
 */
router.put("/resetPassword", resetPassword);

module.exports = router;
