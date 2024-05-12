const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory"); // Assuming the above functions are in reportController.js
const Report = require("../models/reportModel");
const ApiError = require("../utils/apiError");

// Example usage in routes
exports.getReports = async (req, res, next) => {
  try {
    // Assuming you have a way to identify the user, for example through req.user._id
    const userId = req.user._id;

    // Build a query that retrieves either reports owned by the user (in any status)
    // or reports from other users but only if they are in the 'verified' status
    const query = Report.find({
      $or: [
        { user: userId }, // Reports owned by the user
        { status: "verified", user: { $ne: userId } }, // Verified reports from other users
      ],
    });

    // Execute the query to get the reports
    const reports = await query;

    // Send back the retrieved reports
    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
// exports.createReport = factory.createOne(Report);

exports.createReport = asyncHandler(async (req, res, next) => {
  try {
    // Extract user ID from the request user object, which is set by the `protect` middleware
    const userId = req.user._id;

    // Create a new report with data from the request body and the user ID
    const newReport = await Report.create({
      ...req.body, // Spread operator to copy properties from req.body into the new object
      user: userId, // Set the user field to the logged-in user's ID
    });

    res.status(201).json({
      success: true,
      data: newReport,
    });
  } catch (error) {
    // Handle errors, possibly with a custom error handling middleware
    next(error);
  }
});

exports.getReport = asyncHandler(async (req, res, next) => {
  // Assuming you have some form of authentication that adds the user to req.user
  const userId = req.user._id;
  const { studyUID } = req.params;

  // Build a query that retrieves either the report owned by the user
  // or a verified report from another user
  const documents = await Report.find({
    studyUID: studyUID,
    $or: [
      { user: userId }, // Report owned by the user
      { status: "verified", user: { $ne: userId } }, // Verified report from other users
    ],
  });

  if (!documents || documents.length === 0) {
    return next(
      new ApiError(
        `No documents found for studyUID ${studyUID} under the specified conditions`,
        404
      )
    );
  }

  res.status(200).json({ data: documents });
});

exports.getReportStatus = asyncHandler(async (req, res, next) => {
  const document = await Report.findOne({ studyUID: req.params.studyUID });

  if (!document) {
    return next(
      new ApiError(`No document for this  studyUID ${req.params.studyUID}`, 404)
    );
  }
  res.status(200).json({ status: document.status });
});

exports.deleteReport = asyncHandler(async (req, res, next) => {
  // Find the document first to check its status
  const document = await Report.findById(req.params.id); // Assuming the ID is passed as a parameter

  if (!document) {
    return next(
      new ApiError(`No document found with ID ${req.params.id}`, 404)
    );
  }

  // Check if the user is the owner of the document or has a manager role
  const isOwner = document.user.toString() === req.user._id.toString();
  const isManager =
    req.user.role.includes("admin") || req.user.role.includes("manager");
  // authService.allowedTo("admin", "manager")

  // Allow deletion if the user is the owner and the document is not verified,
  // or if the user has a manager role (regardless of the document's verification status)
  if ((isOwner && document.status !== "verified") || isManager) {
    // Proceed with the deletion
    await Report.findByIdAndDelete(req.params.id); // This will remove the document

    res.status(204).json({ message: "Document successfully deleted" }); // 204 No Content or 200 OK, based on your API design
  } else {
    // Deny the deletion otherwise
    return next(new ApiError("Unauthorized to delete this document", 403));
  }
});

exports.updateReport = asyncHandler(async (req, res, next) => {
  // Find the document first to check its status and ownership
  const document = await Report.findOne({ _id: req.params.id }); // Assuming the ID is passed as a parameter

  if (!document) {
    return next(
      new ApiError(`No document found with ID ${req.params.id}`, 404)
    );
  }

  // Prevent updates if the document is verified, regardless of ownership
  if (document.status === "verified") {
    return next(new ApiError("Cannot modify a verified document", 403));
  }

  // Allow updates only if the document is owned by the user and not verified
  if (document.user.toString() === req.user._id.toString()) {
    // Proceed with the update
    const updatedDocument = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          content: req.body.content,
          status: req.body.status,
          title: req.body.title,
          patientID: req.body.patientID,
          patientName: req.body.patientName, // Again, ensure this matches your schema
          // User field should not be updated, as ownership doesn't change
        },
      },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    res.status(200).json({ data: updatedDocument });
  } else {
    // Deny the update if the user is not the owner
    return next(new ApiError("Unauthorized to modify this document", 403));
  }
});

// exports.updateStatus = asyncHandler(async (req, res, next) => {
//   const document = await Report.findOneAndUpdate(
//     { studyUID: req.params.studyUID },
//     { content: req.body.content },
//     { status: req.body.status },
//     { title: req.body.title },
//     { patientID: req.body.patientID },
//     { PatientName: req.body.PatientName },
//     { user: req.user.id }
//   );

//   if (!document) {
//     return next(
//       new ApiError(`No document for this  studyUID ${req.params.studyUID}`, 404)
//     );
//   }
//   res.status(200).json({ data: document });
// });
exports.updateStatus = asyncHandler(async (req, res, next) => {
  // Find the document first to check its status and ownership
  const document = await Report.findOne({ studyUID: req.params.studyUID });

  if (!document) {
    return next(
      new ApiError(`No document for this studyUID ${req.params.studyUID}`, 404)
    );
  }

  // Prevent updates if the document is verified, regardless of ownership
  if (document.status === "verified") {
    return next(new ApiError("Cannot modify a verified document", 403));
  }

  // Allow updates only if the document is owned by the user and not verified
  if (document.user.toString() === req.user._id.toString()) {
    // It's safe to proceed with the update
    const updatedDocument = await Report.findOneAndUpdate(
      { studyUID: req.params.studyUID },
      {
        $set: {
          content: req.body.content,
          status: req.body.status,
          title: req.body.title,
          patientID: req.body.patientID,
          patientName: req.body.patientName, // Ensure this matches your schema
          // No need to update the user field, as ownership doesn't change
        },
      },
      { new: true } // Return the updated document after the update
    );

    res.status(200).json({ data: updatedDocument });
  } else {
    // If the user is not the owner, deny the update
    return next(new ApiError("Unauthorized to modify this document", 403));
  }
});
