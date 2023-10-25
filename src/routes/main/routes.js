const express = require("express");
const router = express.Router();

// Import routes
const deviceTrackerRoutes = require("../deviceTrackerRoutes");

// Routes
router.use(deviceTrackerRoutes);

module.exports = router;
