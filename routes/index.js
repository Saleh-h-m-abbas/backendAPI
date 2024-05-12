const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reportRoute = require("./reportRoute"); // Add this line to import the reportRoute module

const mountRoutes = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reports", reportRoute);
};

module.exports = mountRoutes;
