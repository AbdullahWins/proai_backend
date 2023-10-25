const router = require("express").Router();

const {
  getOnedeviceTracker,
  addOnedeviceTracker,
  updatedeviceTrackerById,
  deleteOnedeviceTrackerById,
} = require("../controllers/deviceTrackerController");

router.get("/tracker/:deviceId", getOnedeviceTracker);
router.post("/tracker/add", addOnedeviceTracker);
router.patch("/tracker/:deviceId", updatedeviceTrackerById);
router.delete("/tracker/:deviceId", deleteOnedeviceTrackerById);

module.exports = router;
