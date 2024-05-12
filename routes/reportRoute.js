const express = require("express");
const {
  createReport,
  getReport,
  getReportStatus,
  updateReport,
  deleteReport,
  updateStatus,
  getReports,
} = require("../services/reportService");
const authService = require("../services/authService");

const router = express.Router();

/**
 * @openapi
 * /api/v1/reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Report]
 *     description: This endpoint retrieves all reports, optionally allowing for query parameters for filtering, sorting, and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting criteria.
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filtering criteria.
 *     responses:
 *       200:
 *         description: A list of reports.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   description: Number of reports returned.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 * /api/v1/reports/:
 *   post:
 *     summary: Add a new report
 *     tags: [Report]
 *     description: >
 *       This endpoint allows for adding a new report.
 *       The report details are taken from the request body.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *     responses:
 *       201:
 *         description: Report added successfully.
 *       500:
 *         description: Server error.
 *
 */
router
  .route("/")
  .get(authService.protect, getReports)
  .post(authService.protect, createReport);
/**
 * @openapi
 * /api/v1/reports/{id}:
 *   put:
 *     summary: Update a report
 *     tags: [Report]
 *     description: >
 *       Updates the content of a report based on its ID.
 *     parameters:
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the report.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportContent:
 *                 type: string
 *                 description: Updated content of the report.
 *     responses:
 *       200:
 *         description: Report updated successfully.
 *       500:
 *         description: Server error.
 *
 * /api/v1/reports/:{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Report]
 *     description: >
 *       Deletes a report based on its ID.
 *     parameters:
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the report.
 *     responses:
 *       200:
 *         description: Report deleted successfully.
 *       500:
 *         description: Server error.
 */
router
  .route("/:id")
  .put(authService.protect, updateReport)
  .delete(authService.protect, deleteReport);

/**
 * @openapi
 * /api/v1/reports/:{studyUID}:
 *   get:
 *     summary: Get reports by image UID
 *     tags: [Report]
 *     description: >
 *       Retrieves all reports associated with a given image UID.
 *     parameters:
 *       - in: path
 *         name: studyUID
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the image.
 *     responses:
 *       200:
 *         description: Reports retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.route("/:studyUID").get(authService.protect, getReport);

/**
 * @openapi
 * /api/v1/reports/status/{studyUID}:
 *   get:
 *     summary: Get report status by image UID
 *     tags: [Report]
 *     description: >
 *       Retrieves the status of a report associated with a given image UID.
 *     parameters:
 *         name: studyUID
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the image.
 *     responses:
 *       200:
 *         description: Report status retrieved successfully.
 *       500:
 *         description: Server error.
 * /api/v1/reports/status/:{studyUID}:
 *   put:
 *     summary: Update report status by image UID
 *     tags: [Report]
 *     description: >
 *       Updates the status of a report associated with a given image UID.
 *     parameters:
 *         name: studyUID
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the image.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the report.
 *     responses:
 *       200:
 *         description: Report status updated successfully.
 *       404:
 *         description: Report not found.
 *       500:
 *         description: Server error.
 */
router
  .route("/status/:studyUID")
  .get(authService.protect, getReportStatus)
  .put(authService.protect, updateStatus);

module.exports = router;
