const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);
/**
 * @openapi
 * /getMe:
 *   get:
 *     summary: Retrieve the data of the logged-in user.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Returns the logged-in user's data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/getMe", getLoggedUserData, getUser);
/**
 * @openapi
 * /changeMyPassword:
 *   put:
 *     summary: Change the password of the logged-in user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 */
router.put("/changeMyPassword", updateLoggedUserPassword);
/**
 * @openapi
 * /updateMe:
 *   put:
 *     summary: Update the data of the logged-in user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully.
 */
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
/**
 * @openapi
 * /deleteMe:
 *   delete:
 *     summary: Delete the logged-in user's account.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
router.use(authService.allowedTo("admin", "manager"));
/**
 * @openapi
 * /changePassword/{id}:
 *   put:
 *     summary: Change the password of a user by ID (Admin only).
 *     tags: [Admin, User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User password updated successfully.
 */
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
/**
 * @openapi
 * /:
 *   get:
 *     summary: Retrieve a list of all users (Admin only).
 *     tags: [Admin, User]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router
  .route("/")
  .get(getUsers)
  /**
   * @openapi
   * /:
   *   post:
   *     summary: Create a new user (Admin only).
   *     tags: [Admin, User]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               image:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: User created successfully.
   */
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

/**
 * @openapi
 * /{id}:
 *   get:
 *     summary: Retrieve a user by ID (Admin only).
 *     tags: [Admin, User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *
 *   put:
 *     summary: Update a user by ID (Admin only).
 *     tags: [Admin, User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *
 *   delete:
 *     summary: Delete a user by ID (Admin only).
 *     tags: [Admin, User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
